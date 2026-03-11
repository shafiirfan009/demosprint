function sendJson(res, statusCode, payload) {
  res.status(statusCode).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function methodNotAllowed(res, methods) {
  if (Array.isArray(methods)) res.setHeader('Allow', methods.join(', '));
  return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
}

function badRequest(res, error, details) {
  return sendJson(res, 400, { ok: false, error, details: details || null });
}

function unauthorized(res, error) {
  return sendJson(res, 401, { ok: false, error: error || 'Unauthorized' });
}

function forbidden(res, error) {
  return sendJson(res, 403, { ok: false, error: error || 'Forbidden' });
}

function serverError(res, error) {
  return sendJson(res, 500, { ok: false, error: error || 'Internal server error' });
}

function getBearerToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.toLowerCase().startsWith('bearer ')) return '';
  return auth.slice(7).trim();
}

module.exports = {
  badRequest,
  forbidden,
  getBearerToken,
  methodNotAllowed,
  sendJson,
  serverError,
  unauthorized,
};

