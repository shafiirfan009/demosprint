// ─────────────────────────────────────────────
//  DEMO SPRINT · Supabase Client
//  Replace SUPABASE_URL and SUPABASE_ANON_KEY
//  with your actual values from:
//  Supabase Dashboard → Project Settings → API
// ─────────────────────────────────────────────

const SUPABASE_URL      = 'YOUR_SUPABASE_URL';        // https://supabase.com/dashboard/project/qslnwsozlghdhkvlwcmo
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';   // qslnwsozlghdhkvlwcmo
// ── Submit lead to Supabase ──────────────────
async function submitLeadToSupabase(data) {
  const payload = {
    product_name:   data['f-product-name']  || '',
    product_desc:   data['f-product-desc']  || '',
    end_user:       data['f-end-user']      || '',
    audience:       data['f-audience']      || '',
    desired_action: data['f-action']        || '',
    output_type:    data['f-output']        || '',
    value_moment:   data['f-value-moment']  || '',
    build_status:   data['f-status']        || '',
    screen_count:   data['f-screens']       || '',
    seed_data:      data['f-seed-data']     || '',
    references:     data['f-references']    || '',
    visual_style:   data['f-style']         || '',
    brand_colors:   data['f-colors']        || '',
    links:          data['f-links']         || '',
    deadline:       data['f-deadline']      || '',
    urgency:        data['f-urgency']       || '',
    client_name:    data['f-name']          || '',
    client_email:   data['f-email']         || '',
    extra_notes:    data['f-extra']         || '',
    source_page:    window.location.pathname,
    submitted_at:   new Date().toISOString(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error ${res.status}: ${err}`);
  }

  return true;
}
