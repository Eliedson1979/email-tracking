const crypto = require('crypto');
function deterministicId(event) {
  const str = JSON.stringify({ site: event.site, type: event.type, user_id: event.user_id || null, timestamp: event.timestamp || event.occurred_at || null, providedId: event.id || null });
  return crypto.createHash('sha256').update(str).digest('hex');
}
module.exports = { deterministicId };