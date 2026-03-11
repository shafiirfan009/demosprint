// ─────────────────────────────────────────────
//  DEMO SPRINT · Supabase Client Config
//  Frontend use-cases:
//  1) Brief modal (fallback direct submit if API is unavailable)
//  2) Admin auth via Supabase magic link
// ─────────────────────────────────────────────

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

function dsPick(data, keys) {
  for (const key of keys) {
    const value = data && Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function dsNormalizeLeadPayload(data) {
  const source = data || {};
  return {
    product_name: dsPick(source, ['product_name', 'ms-product-name', 'f-product-name']),
    product_desc: dsPick(source, ['product_desc', 'ms-product-desc', 'f-product-desc']),
    end_user: dsPick(source, ['end_user', 'ms-end-user', 'f-end-user']),
    audience: dsPick(source, ['audience', 'ms-audience', 'f-audience']),
    desired_action: dsPick(source, ['desired_action', 'ms-action', 'f-action']),
    output_type: dsPick(source, ['output_type', 'ms-output', 'f-output']),
    value_moment: dsPick(source, ['value_moment', 'ms-value-moment', 'f-value-moment']),
    build_status: dsPick(source, ['build_status', 'ms-status', 'f-status']),
    screen_count: dsPick(source, ['screen_count', 'ms-screens', 'f-screens']),
    seed_data: dsPick(source, ['seed_data', 'ms-seed-data', 'f-seed-data']),
    references: dsPick(source, ['references', 'ms-references', 'f-references']),
    visual_style: dsPick(source, ['visual_style', 'ms-style', 'f-style']),
    brand_colors: dsPick(source, ['brand_colors', 'ms-colors', 'f-colors']),
    links: dsPick(source, ['links', 'ms-links', 'f-links']),
    deadline: dsPick(source, ['deadline', 'ms-deadline', 'f-deadline']),
    urgency: dsPick(source, ['urgency', 'ms-urgency', 'f-urgency']),
    client_name: dsPick(source, ['client_name', 'ms-name', 'f-name']),
    client_email: dsPick(source, ['client_email', 'ms-email', 'f-email']),
    extra_notes: dsPick(source, ['extra_notes', 'ms-extra', 'f-extra']),
    source_page: dsPick(source, ['source_page']) || window.location.pathname,
    submitted_at: new Date().toISOString(),
  };
}

async function submitLeadToSupabase(data) {
  const payload = dsNormalizeLeadPayload(data);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase error ${res.status}: ${errorText}`);
  }

  return true;
}

window.DS_SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
};
window.submitLeadToSupabase = submitLeadToSupabase;
window.dsNormalizeLeadPayload = dsNormalizeLeadPayload;

