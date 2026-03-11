const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const formidableModule = require('formidable');
const { normalizeBriefInput, toLeadRow, validateBrief } = require('../_lib/brief-data');
const { sendBriefEmails } = require('../_lib/email');
const { badRequest, methodNotAllowed, sendJson, serverError } = require('../_lib/http');
const { createBriefPdfBuffer } = require('../_lib/pdf');
const { getBriefBucket, getServiceClient } = require('../_lib/supabase');

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanFileName(fileName) {
  const base = path.basename(fileName || 'file');
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function parseMultipart(req) {
  const createForm = typeof formidableModule === 'function' ? formidableModule : formidableModule.formidable;
  const form = createForm({
    multiples: true,
    maxFileSize: MAX_FILE_SIZE,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

async function uploadAttachmentFiles(supabase, briefId, files) {
  const bucket = getBriefBucket();
  const uploaded = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const mime = String(file.mimetype || '').toLowerCase();
    const size = Number(file.size || 0);
    const original = cleanFileName(file.originalFilename);
    const extension = path.extname(original);
    const storagePath = `briefs/${briefId}/attachments/${Date.now()}-${i + 1}${extension}`;
    const buffer = await fs.readFile(file.filepath);
    const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
      contentType: mime || 'application/octet-stream',
      upsert: false,
    });
    if (error) {
      throw new Error(`Attachment upload failed: ${error.message}`);
    }
    uploaded.push({
      original_name: original,
      path: storagePath,
      mime_type: mime,
      size,
    });
  }
  return uploaded;
}

function validateAttachments(files) {
  if (files.length > MAX_FILES) {
    return `You can attach up to ${MAX_FILES} files.`;
  }
  for (const file of files) {
    const mime = String(file.mimetype || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mime)) {
      return `Unsupported file type: ${mime || 'unknown'}.`;
    }
    const size = Number(file.size || 0);
    if (size > MAX_FILE_SIZE) {
      return `${file.originalFilename || 'File'} exceeds the 10MB limit.`;
    }
  }
  return '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const { fields, files } = await parseMultipart(req);
    const payloadRaw = Array.isArray(fields.payload) ? fields.payload[0] : fields.payload;
    if (!payloadRaw) return badRequest(res, 'Missing payload');

    let payload = {};
    try {
      payload = JSON.parse(payloadRaw);
    } catch (error) {
      return badRequest(res, 'Invalid payload JSON');
    }

    const brief = normalizeBriefInput(payload);
    const validation = validateBrief(brief);
    if (!validation.valid) return badRequest(res, 'Validation failed', validation.errors);

    const attachments = ensureArray(files.attachments || files['attachments[]']);
    const attachmentError = validateAttachments(attachments);
    if (attachmentError) return badRequest(res, attachmentError);

    const supabase = getServiceClient();
    const briefId = crypto.randomUUID();
    const uploadedAttachments = await uploadAttachmentFiles(supabase, briefId, attachments);

    const pdfBuffer = await createBriefPdfBuffer({
      brief,
      briefId,
      attachments: uploadedAttachments,
    });

    const summaryPdfPath = `briefs/${briefId}/summary/brief-${briefId}.pdf`;
    const { error: pdfError } = await supabase.storage.from(getBriefBucket()).upload(summaryPdfPath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });
    if (pdfError) throw new Error(`Summary PDF upload failed: ${pdfError.message}`);

    const leadRow = toLeadRow(brief, {
      attachments: uploadedAttachments,
      briefId,
      summaryPdfPath,
      sourcePage: brief.source_page,
    });

    const { error: insertError } = await supabase.from('leads').insert(leadRow);
    if (insertError) throw new Error(`Lead insert failed: ${insertError.message}`);

    let emailStatus = 'sent';
    let emailError = '';
    try {
      await sendBriefEmails({ brief, briefId, pdfBuffer });
    } catch (error) {
      emailStatus = 'failed';
      emailError = error.message || 'Unknown email error';
    }

    const { error: updateError } = await supabase
      .from('leads')
      .update({ email_status: emailStatus, email_error: emailError })
      .eq('brief_id', briefId);

    if (updateError) {
      console.error('Lead status update failed:', updateError.message);
    }

    return sendJson(res, 200, {
      ok: true,
      brief_id: briefId,
      email_status: emailStatus,
      email_error: emailError,
    });
  } catch (error) {
    console.error('Brief submit error:', error);
    return serverError(res, error.message || 'Submit failed');
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
    sizeLimit: '35mb',
  },
};
