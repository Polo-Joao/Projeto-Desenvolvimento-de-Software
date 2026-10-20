import { useEffect, useState } from "react";

function App() {
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarDoacoes() {
      try {
        const resposta = await fetch("http://127.0.0.1:8000/doacoes");

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar as doações.");
        }

        const dados = await resposta.json();
        setDoacoes(dados);
      } catch (erro) {
        setErro("Não foi possível conectar à API. Verifique se o backend está funcionando.");
      } finally {
        setCarregando(false);
      }
    }

    buscarDoacoes();
  }, []);

  return (
    <main>
      <h1>Doações entre Vizinhos</h1>
      <p>Encontre itens disponíveis na sua comunidade.</p>

      {carregando && <p>Carregando doações...</p>}
      {erro && <p role="alert">{erro}</p>}

      {!carregando && !erro && doacoes.length === 0 && (
        <p>Nenhuma doação disponível no momento.</p>
      )}

      <section>
        {doacoes.map((doacao) => (
          <article key={doacao.id}>
            <h2>{doacao.titulo}</h2>
            <p>{doacao.descricao}</p>
            <p>Categoria: {doacao.categoria}</p>
            {doacao.regiao && <p>Região: {doacao.regiao}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
