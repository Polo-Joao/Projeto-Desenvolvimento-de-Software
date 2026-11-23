import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { criarDoacao, listarDoacoes } from "./api.js";

const fetchOriginal = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

describe("services/api", () => {
  it("listarDoacoes retorna lista JSON", async () => {
    const lista = [{ id: 1, titulo: "Mesa", descricao: "Madeira", categoria: "Móveis", regiao: null }];
    globalThis.fetch = async () => ({ ok: true, json: async () => lista });

    assert.deepEqual(await listarDoacoes(), lista);
  });

  it("criarDoacao envia POST JSON e retorna item criado", async () => {
    let chamado;
    globalThis.fetch = async (url, opcoes) => {
      chamado = { url, opcoes };
      return { ok: true, json: async () => ({ id: 1, ...JSON.parse(opcoes.body) }) };
    };

    const res = await criarDoacao({ titulo: "Livro", descricao: "Bom estado", categoria: "Livros", regiao: null });
    assert.equal(res.id, 1);
    assert.equal(chamado.opcoes.method, "POST");
    assert.match(chamado.url, /\/doacoes$/);
  });

  it("formata erros 422 do FastAPI em texto legivel", async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 422,
      json: async () => ({ detail: [{ loc: ["body", "titulo"], msg: "too short" }] }),
    });

    await assert.rejects(() => criarDoacao({}), /titulo: too short/);
  });

  it("retorna mensagem amigavel quando a API esta fora do ar", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("fetch failed");
    };

    await assert.rejects(() => listarDoacoes(), /Não foi possível conectar à API/);
  });
});
