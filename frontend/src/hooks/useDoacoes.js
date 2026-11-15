import { useEffect, useState } from "react";
import { criarDoacao, listarDoacoes } from "../services/api";

export function useDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true; // evita atualizar estado se o componente já foi desmontado

    async function carregar() {
      try {
        const dados = await listarDoacoes();
        if (ativo) setDoacoes(dados);
      } catch (e) {
        if (ativo) setErro(e.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  // Deixa o erro subir: quem chama (o formulário) decide como mostrá-lo.
  async function adicionar(dados) {
    const nova = await criarDoacao(dados);
    setDoacoes((atual) => [...atual, nova]);
  }

  return { doacoes, carregando, erro, adicionar };
}
