const nodemailer = require('nodemailer');
const { getEnv, requireEnv } = require('./env');

function getTransport() {
  requireEnv(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_APP_PASSWORD']);
  const port = Number(getEnv('SMTP_PORT', '465'));
  return nodemailer.createTransport({
    host: getEnv('SMTP_HOST'),
    port,
    secure: port === 465,
    auth: {
      user: getEnv('SMTP_USER'),
      pass: getEnv('SMTP_APP_PASSWORD'),
    },
  });
}

function buildInternalHtml(brief, briefId, appBaseUrl) {
  const viewUrl = `${appBaseUrl}/admin/briefs`;
  return `
    <h2>New Demo Sprint Brief</h2>
    <p><strong>Brief ID:</strong> ${briefId}</p>
    <p><strong>Product:</strong> ${brief.product_name || '-'}</p>
    <p><strong>Client:</strong> ${brief.client_name || '-'} (${brief.client_email || '-'})</p>
    <p><strong>Audience:</strong> ${brief.audience || '-'}</p>
    <p><strong>Output:</strong> ${brief.output_type || '-'}</p>
    <p><strong>Deadline:</strong> ${brief.deadline || '-'}</p>
    <p><strong>Action:</strong> ${brief.desired_action || '-'}</p>
    <p><strong>Value moment:</strong> ${brief.value_moment || '-'}</p>
    <p>Open admin dashboard: <a href="${viewUrl}">${viewUrl}</a></p>
  `;
}

function buildLeadHtml(brief) {
  return `
    <h2>Brief Received — Demo Sprint</h2>
    <p>Thanks ${brief.client_name || 'there'}, your brief has been received.</p>
    <p><strong>Product:</strong> ${brief.product_name || '-'}</p>
    <p><strong>Output focus:</strong> ${brief.output_type || '-'}</p>
    <p><strong>Deadline:</strong> ${brief.deadline || '-'}</p>
    <p>I will review your brief and follow up shortly.</p>
  `;
}

async function sendBriefEmails(options) {
  const opts = options || {};
  const brief = opts.brief || {};
  const briefId = opts.briefId || '';
  const pdfBuffer = opts.pdfBuffer;
  const appBaseUrl = getEnv('APP_BASE_URL', 'http://localhost:3000').replace(/\/$/, '');

  if (!brief.client_email) throw new Error('client_email is required for email dispatch');
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) throw new Error('PDF buffer is required');

  const transporter = getTransport();
  const from = getEnv('MAIL_FROM', getEnv('SMTP_USER'));
  const internalTo = getEnv('INTERNAL_BRIEF_TO', getEnv('SMTP_USER'));

  const attachment = {
    filename: `brief-${briefId || 'summary'}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf',
  };

  const jobs = [
    transporter.sendMail({
      from,
      to: internalTo,
      subject: `New brief: ${brief.product_name || 'Untitled'} (${briefId || 'no-id'})`,
      html: buildInternalHtml(brief, briefId, appBaseUrl),
      text: `New brief ${briefId || ''} from ${brief.client_name || ''} (${brief.client_email || ''}).`,
      attachments: [attachment],
    }),
    transporter.sendMail({
      from,
      to: brief.client_email,
      subject: `We received your brief — ${brief.product_name || 'Demo Sprint'}`,
      html: buildLeadHtml(brief),
      text: `Thanks ${brief.client_name || ''}, we received your brief for ${brief.product_name || 'your project'}.`,
      attachments: [attachment],
    }),
  ];

  const results = await Promise.allSettled(jobs);
  const failures = results.filter((result) => result.status === 'rejected');
  if (failures.length) {
    const messages = failures.map((result) => result.reason && result.reason.message ? result.reason.message : String(result.reason));
    throw new Error(`Email dispatch failed: ${messages.join(' | ')}`);
  }
}

module.exports = {
  sendBriefEmails,
};

