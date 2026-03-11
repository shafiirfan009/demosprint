const { getBriefBucket, getServiceClient } = require('./supabase');

async function getLeadByIdentifier(identifier) {
  const supabase = getServiceClient();
  let query = supabase.from('leads').select('*').eq('brief_id', identifier).limit(1);
  let { data, error } = await query.maybeSingle();

  if (!data && /^\d+$/.test(String(identifier || ''))) {
    query = supabase.from('leads').select('*').eq('id', Number(identifier)).limit(1);
    const retry = await query.maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    throw new Error(error.message || 'Failed to fetch lead');
  }
  return data || null;
}

async function createSignedDownload(path) {
  if (!path) return '';
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage.from(getBriefBucket()).createSignedUrl(path, 60 * 15);
  if (error) throw new Error(error.message || 'Failed to create signed URL');
  return data && data.signedUrl ? data.signedUrl : '';
}

async function getPdfBuffer(path) {
  if (!path) return null;
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage.from(getBriefBucket()).download(path);
  if (error || !data) throw new Error(error ? error.message : 'Could not download summary PDF');
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = {
  createSignedDownload,
  getLeadByIdentifier,
  getPdfBuffer,
};

