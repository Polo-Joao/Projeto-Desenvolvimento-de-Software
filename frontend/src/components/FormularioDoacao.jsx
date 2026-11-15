import { useState } from "react";

const VAZIO = { titulo: "", descricao: "", categoria: "", regiao: "" };

// Limites iguais aos de Backend/app/schemas.py
function FormularioDoacao({ aoEnviar }) {
  const [campos, setCampos] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizar(evento) {
    const { name, value } = evento.target;
    setCampos((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      await aoEnviar({
        titulo: campos.titulo.trim(),
        descricao: campos.descricao.trim(),
        categoria: campos.categoria.trim(),
        regiao: campos.regiao.trim() || null,
      });
      setCampos(VAZIO);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar}>
      <h2>Publicar doação</h2>

      <label>
        Título
        <input name="titulo" value={campos.titulo} onChange={atualizar} minLength={3} maxLength={100} required />
      </label>

      <label>
        Descrição
        <textarea name="descricao" value={campos.descricao} onChange={atualizar} minLength={5} maxLength={500} required />
      </label>

      <label>
        Categoria
        <input name="categoria" value={campos.categoria} onChange={atualizar} minLength={3} maxLength={50} required />
      </label>

      <label>
        Região (opcional)
        <input name="regiao" value={campos.regiao} onChange={atualizar} maxLength={100} />
      </label>

      {erro && <p role="alert">{erro}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}

export default FormularioDoacao;
