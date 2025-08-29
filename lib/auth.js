const allowed = (process.env.API_KEYS || '').split(',').map(s => s.trim()).filter(Boolean);
function requireApiKey(req, res) {
  const key = req.headers['x-api-key'];
  if (!key || !allowed.includes(key)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
module.exports = { requireApiKey };