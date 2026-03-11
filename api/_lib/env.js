function getEnv(name, fallback) {
  const value = process.env[name];
  if (typeof value !== 'string') return fallback || '';
  return value.trim();
}

function requireEnv(names) {
  const missing = names.filter((name) => !getEnv(name));
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

function parseAdminAllowlist() {
  const raw = getEnv('ADMIN_EMAIL_ALLOWLIST', '');
  const set = new Set(
    raw
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
  const fallback = getEnv('SMTP_USER', '').toLowerCase();
  if (!set.size && fallback) set.add(fallback);
  return set;
}

module.exports = {
  getEnv,
  parseAdminAllowlist,
  requireEnv,
};

