const { parseAdminAllowlist } = require('./env');
const { getServiceClient } = require('./supabase');

async function getUserFromToken(token) {
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return data && data.user ? data.user : null;
}

function isAdminEmail(email) {
  const allowlist = parseAdminAllowlist();
  if (!allowlist.size) return false;
  return allowlist.has(String(email || '').toLowerCase());
}

module.exports = {
  getUserFromToken,
  isAdminEmail,
};

