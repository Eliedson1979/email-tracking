jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("lib/db", () => {
  let Pool, pool;

  beforeEach(() => {
    jest.resetModules(); // limpa cache do require
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/testdb";
    ({ Pool } = require("pg")); // reimporta mock
    ({ pool } = require("../lib/db")); // importa módulo a testar
  });

  it("cria uma instância de Pool com DATABASE_URL do .env", () => {
    expect(Pool).toHaveBeenCalledWith({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });
  });

  it("exporta o pool com métodos query/connect/end", () => {
    expect(typeof pool.query).toBe("function");
    expect(typeof pool.connect).toBe("function");
    expect(typeof pool.end).toBe("function");
  });

  it("propaga exceções se Pool lançar erro", () => {
    jest.resetModules();
    const err = new Error("fail");
    const BadPool = jest.fn(() => {
      throw err;
    });
    jest.doMock("pg", () => ({ Pool: BadPool }));
    expect(() => require("../lib/db")).toThrow("fail");
  });
});
