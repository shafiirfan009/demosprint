const { normalizeBriefInput } = require('../../../_lib/brief-data');
const { sendBriefEmails } = require('../../../_lib/email');
const { getBearerToken, forbidden, methodNotAllowed, sendJson, serverError, unauthorized } = require('../../../_lib/http');
const { getLeadByIdentifier, getPdfBuffer } = require('../../../_lib/leads');
const { createBriefPdfBuffer } = require('../../../_lib/pdf');
const { getBriefBucket, getServiceClient } = require('../../../_lib/supabase');
const { getUserFromToken, isAdminEmail } = require('../../../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const token = getBearerToken(req);
    if (!token) return unauthorized(res, 'Missing bearer token');

    const user = await getUserFromToken(token);
    if (!user || !user.email) return unauthorized(res, 'Invalid auth token');
    if (!isAdminEmail(user.email)) return forbidden(res, 'Admin access denied');

    const lead = await getLeadByIdentifier(req.query.id);
    if (!lead) return sendJson(res, 404, { ok: false, error: 'Brief not found' });

    const brief = normalizeBriefInput(lead);
    const briefId = lead.brief_id || String(lead.id);
    const attachments = Array.isArray(lead.attachments) ? lead.attachments : [];

    let pdfBuffer = null;
    if (lead.summary_pdf_path) {
      try {
        pdfBuffer = await getPdfBuffer(lead.summary_pdf_path);
      } catch (error) {
        console.warn('Failed to re-download summary PDF, regenerating:', error.message);
      }
    }

    if (!pdfBuffer) {
      pdfBuffer = await createBriefPdfBuffer({ brief, briefId, attachments });
      const summaryPath = lead.summary_pdf_path || `briefs/${briefId}/summary/brief-${briefId}.pdf`;
      const supabase = getServiceClient();
      const { error } = await supabase.storage.from(getBriefBucket()).upload(summaryPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
      if (!error && !lead.summary_pdf_path) {
        await supabase.from('leads').update({ summary_pdf_path: summaryPath }).eq('id', lead.id);
      }
    }

    const supabase = getServiceClient();
    let emailError = '';
    try {
      await sendBriefEmails({ brief, briefId, pdfBuffer });
      await supabase.from('leads').update({ email_status: 'sent', email_error: '' }).eq('id', lead.id);
    } catch (error) {
      emailError = error.message || 'Email resend failed';
      await supabase.from('leads').update({ email_status: 'failed', email_error: emailError }).eq('id', lead.id);
      throw new Error(emailError);
    }

    return sendJson(res, 200, {
      ok: true,
      brief_id: briefId,
      email_status: 'sent',
      email_error: emailError,
    });
  } catch (error) {
    console.error('Resend email error:', error);
    return serverError(res, error.message || 'Failed to resend email');
  }
};

