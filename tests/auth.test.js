describe("requireApiKey", () => {
  let req, res, requireApiKey;

  const loadModule = () => {
    jest.resetModules(); // força reload do módulo
    process.env.API_KEYS = "valid1,valid2";
    ({ requireApiKey } = require("../lib/auth"));
  };

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    loadModule();
  });

  it("nega acesso se não houver API key", () => {
    const ok = requireApiKey(req, res);
    expect(ok).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("nega acesso se API key for inválida", () => {
    req.headers["x-api-key"] = "wrongkey";
    const ok = requireApiKey(req, res);
    expect(ok).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("permite acesso se API key for válida", () => {
    req.headers["x-api-key"] = "valid1";
    const ok = requireApiKey(req, res);
    expect(ok).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("aceita múltiplas chaves separadas por vírgula", () => {
    req.headers["x-api-key"] = "valid2";
    const ok = requireApiKey(req, res);
    expect(ok).toBe(true);
  });
});
