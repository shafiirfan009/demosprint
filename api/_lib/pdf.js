const PDFDocument = require('pdfkit');
const { formatBriefLines } = require('./brief-data');

function safeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function createBriefPdfBuffer(options) {
  const opts = options || {};
  const brief = opts.brief || {};
  const attachments = Array.isArray(opts.attachments) ? opts.attachments : [];
  const briefId = safeText(opts.briefId || brief.brief_id || '');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Demo Sprint Brief Summary', { align: 'left' });
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toISOString()}`);
    if (briefId) doc.text(`Brief ID: ${briefId}`);
    doc.fillColor('#000');
    doc.moveDown(0.8);

    const lines = formatBriefLines(brief);
    doc.fontSize(11);
    for (const [label, value] of lines) {
      const text = safeText(value) || '-';
      doc.font('Helvetica-Bold').text(`${label}:`, { continued: true });
      doc.font('Helvetica').text(` ${text}`);
      doc.moveDown(0.3);
    }

    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').text('Attachments');
    doc.moveDown(0.3);
    if (!attachments.length) {
      doc.font('Helvetica').text('- None');
    } else {
      attachments.forEach((file, index) => {
        const name = safeText(file.original_name || file.path || `File ${index + 1}`);
        const size = Number(file.size || 0);
        const sizeText = size > 0 ? `${Math.round(size / 1024)} KB` : 'size unknown';
        doc.font('Helvetica').text(`- ${name} (${sizeText})`);
      });
    }

    doc.end();
  });
}

module.exports = {
  createBriefPdfBuffer,
};

