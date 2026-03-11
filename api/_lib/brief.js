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

const FIELD_CANDIDATES = {
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
  demo_focus: ['demo_focus', 'focus_summary', 'ms-focus', 'f-focus'],
  source_page: ['source_page'],
};

function pickValue(input, keys) {
  for (const key of keys) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function normalizeBriefInput(input) {
  const normalized = {};
  Object.entries(FIELD_CANDIDATES).forEach(([field, keys]) => {
    normalized[field] = pickValue(input, keys);
  });
  return normalized;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
}

function validateBrief(brief) {
  const errors = {};
  REQUIRED_FIELDS.forEach((field) => {
    if (!brief[field]) errors[field] = 'required';
  });

  if (brief.client_email && !isValidEmail(brief.client_email)) {
    errors.client_email = 'invalid_email';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
}

function summaryRows(brief) {
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
    ['Demo focus', brief.demo_focus],
    ['Source page', brief.source_page],
  ];
}

module.exports = {
  normalizeBriefInput,
  validateBrief,
  summaryRows,
};

