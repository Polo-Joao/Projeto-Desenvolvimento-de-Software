const API_URL = import.meta.env?.VITE_API_URL ?? "http://127.0.0.1:8000";

async function requisitar(caminho, opcoes) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se o backend está funcionando.",
    );
  }

  if (!resposta.ok) {
    throw new Error(await extrairMensagemErro(resposta));
  }
  return resposta.json();
}

// O FastAPI devolve erros 422 como lista em `detail`; os demais, como texto.
async function extrairMensagemErro(resposta) {
  try {
    const { detail } = await resposta.json();
    if (Array.isArray(detail)) {
      return detail.map((d) => `${d.loc.at(-1)}: ${d.msg}`).join("; ");
    }
    if (typeof detail === "string") return detail;
  } catch {
    // corpo sem JSON: cai na mensagem padrão abaixo
  }
  return `Erro ${resposta.status} ao falar com a API.`;
}

export const listarDoacoes = () => requisitar("/doacoes");

export const criarDoacao = (dados) =>
  requisitar("/doacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
