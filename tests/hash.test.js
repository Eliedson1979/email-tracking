const { deterministicId } = require('../lib/hash');
test('deterministic id stable', () => {
  const ev = { site: 's', type: 'sent', user_id: 'u', timestamp: '2020-01-01T00:00:00Z' };
  const a = deterministicId(ev);
  const b = deterministicId(ev);
  expect(typeof a).toBe('string');
  expect(a).toBe(b);
});