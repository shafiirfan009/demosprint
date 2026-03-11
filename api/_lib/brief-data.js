const FIELD_ALIASES = {
  product_name: ['product_name', 'ms-product-name', 'f-product-name'],
  product_desc: ['product_desc', 'ms-product-desc', 'f-product-desc'],
  end_user: ['end_user', 'ms-end-user', 'f-end-user'],
  audience: ['audience', 'ms-audience', 'f-audience'],
  desired_action: ['desired_action', 'ms-action', 'f-action'],
  output_type: ['output_type', 'ms-output', 'f-output'],
  value_moment: ['value_moment', 'ms-value-moment', 'f-value-moment'],
  build_status: ['build_status', 'ms-status', 'f-status'],
  screen_count: ['screen_count', 'ms-screens', 'f-screens'],
  seed_data: ['seed_data', 'ms-seed-data', 'f-seed-data'],
  references: ['references', 'ms-references', 'f-references'],
  visual_style: ['visual_style', 'ms-style', 'f-style'],
  brand_colors: ['brand_colors', 'ms-colors', 'f-colors'],
  links: ['links', 'ms-links', 'f-links'],
  deadline: ['deadline', 'ms-deadline', 'f-deadline'],
  urgency: ['urgency', 'ms-urgency', 'f-urgency'],
  client_name: ['client_name', 'ms-name', 'f-name'],
  client_email: ['client_email', 'ms-email', 'f-email'],
  extra_notes: ['extra_notes', 'ms-extra', 'f-extra'],
  source_page: ['source_page'],
};

const REQUIRED_FIELDS = [
  'product_name',
  'product_desc',
  'end_user',
  'audience',
  'desired_action',
  'output_type',
  'value_moment',
  'build_status',
  'screen_count',
  'visual_style',
  'deadline',
  'client_name',
  'client_email',
];

function firstNonEmpty(input, keys) {
  for (const key of keys) {
    const value = input && Object.prototype.hasOwnProperty.call(input, key) ? input[key] : '';
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function normalizeBriefInput(input) {
  const out = {};
  const source = input || {};
  for (const [targetKey, aliases] of Object.entries(FIELD_ALIASES)) {
    out[targetKey] = firstNonEmpty(source, aliases);
  }
  return out;
}

function validateBrief(brief) {
  const errors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!brief[field]) errors[field] = 'Required';
  }

  if (brief.client_email && !brief.client_email.includes('@')) {
    errors.client_email = 'Invalid email';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

function toLeadRow(brief, options) {
  const now = new Date().toISOString();
  const opts = options || {};
  return {
    ...brief,
    brief_id: opts.briefId,
    attachments: opts.attachments || [],
    summary_pdf_path: opts.summaryPdfPath || '',
    email_status: opts.emailStatus || 'pending',
    email_error: opts.emailError || '',
    source_page: brief.source_page || opts.sourcePage || '',
    created_at: now,
    submitted_at: now,
  };
}

function formatBriefLines(brief) {
  return [
    ['Product name', brief.product_name],
    ['Product description', brief.product_desc],
    ['End user', brief.end_user],
    ['Audience', brief.audience],
    ['Desired action', brief.desired_action],
    ['Output type', brief.output_type],
    ['Value moment', brief.value_moment],
    ['Build status', brief.build_status],
    ['Screen count', brief.screen_count],
    ['Seed data', brief.seed_data],
    ['References', brief.references],
    ['Visual style', brief.visual_style],
    ['Brand colors', brief.brand_colors],
    ['Links', brief.links],
    ['Deadline', brief.deadline],
    ['Urgency', brief.urgency],
    ['Client name', brief.client_name],
    ['Client email', brief.client_email],
    ['Extra notes', brief.extra_notes],
    ['Source page', brief.source_page],
  ];
}

module.exports = {
  formatBriefLines,
  normalizeBriefInput,
  toLeadRow,
  validateBrief,
};

