const { getBearerToken, forbidden, methodNotAllowed, sendJson, serverError, unauthorized } = require('../../_lib/http');
const { getServiceClient } = require('../../_lib/supabase');
const { getUserFromToken, isAdminEmail } = require('../../_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const token = getBearerToken(req);
    if (!token) return unauthorized(res, 'Missing bearer token');

    const user = await getUserFromToken(token);
    if (!user || !user.email) return unauthorized(res, 'Invalid auth token');
    if (!isAdminEmail(user.email)) return forbidden(res, 'Admin access denied');

    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.page_size || 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = getServiceClient();
    const { data, error, count } = await supabase
      .from('leads')
      .select(
        'id,brief_id,product_name,client_name,client_email,output_type,deadline,email_status,created_at,submitted_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message || 'Failed to load leads');

    const items = (data || []).map((row) => ({
      id: row.id,
      brief_id: row.brief_id || String(row.id),
      product_name: row.product_name || '',
      client_name: row.client_name || '',
      client_email: row.client_email || '',
      output_type: row.output_type || '',
      deadline: row.deadline || '',
      email_status: row.email_status || 'unknown',
      submitted_at: row.created_at || row.submitted_at || '',
    }));

    return sendJson(res, 200, {
      ok: true,
      page,
      page_size: pageSize,
      total: count || 0,
      items,
    });
  } catch (error) {
    console.error('Admin briefs list error:', error);
    return serverError(res, error.message || 'Failed to fetch briefs');
  }
};

