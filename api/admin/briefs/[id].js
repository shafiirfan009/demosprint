const { getBearerToken, forbidden, methodNotAllowed, sendJson, serverError, unauthorized } = require('../../_lib/http');
const { createSignedDownload, getLeadByIdentifier } = require('../../_lib/leads');
const { getUserFromToken, isAdminEmail } = require('../../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const token = getBearerToken(req);
    if (!token) return unauthorized(res, 'Missing bearer token');

    const user = await getUserFromToken(token);
    if (!user || !user.email) return unauthorized(res, 'Invalid auth token');
    if (!isAdminEmail(user.email)) return forbidden(res, 'Admin access denied');

    const lead = await getLeadByIdentifier(req.query.id);
    if (!lead) return sendJson(res, 404, { ok: false, error: 'Brief not found' });

    const attachments = Array.isArray(lead.attachments) ? lead.attachments : [];
    const attachment_downloads = [];
    for (const item of attachments) {
      const signedUrl = item.path ? await createSignedDownload(item.path) : '';
      attachment_downloads.push({
        ...item,
        signed_url: signedUrl,
      });
    }

    const summary_pdf_url = lead.summary_pdf_path ? await createSignedDownload(lead.summary_pdf_path) : '';

    return sendJson(res, 200, {
      ok: true,
      brief: {
        ...lead,
        attachment_downloads,
        summary_pdf_url,
      },
    });
  } catch (error) {
    console.error('Admin brief detail error:', error);
    return serverError(res, error.message || 'Failed to fetch brief detail');
  }
};

