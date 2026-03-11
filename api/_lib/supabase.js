const { createClient } = require('@supabase/supabase-js');
const { getEnv, requireEnv } = require('./env');

function getServiceClient() {
  requireEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });
}

function getAnonClient() {
  requireEnv(['SUPABASE_URL', 'SUPABASE_ANON_KEY']);
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_ANON_KEY'), {
    auth: { persistSession: false },
  });
}

function getBriefBucket() {
  return getEnv('SUPABASE_BRIEF_BUCKET', 'brief-assets');
}

module.exports = {
  getAnonClient,
  getBriefBucket,
  getServiceClient,
};

