import FormularioDoacao from "./components/FormularioDoacao";
import ListaDoacoes from "./components/ListaDoacoes";
import { useDoacoes } from "./hooks/useDoacoes";

function App() {
  const { doacoes, carregando, erro, adicionar } = useDoacoes();

  return (
    <main>
      <h1>Doações entre Vizinhos</h1>
      <p>Encontre itens disponíveis na sua comunidade.</p>

      <FormularioDoacao aoEnviar={adicionar} />

      {carregando && <p>Carregando doações...</p>}
      {erro && <p role="alert">{erro}</p>}
      {!carregando && !erro && <ListaDoacoes doacoes={doacoes} />}
    </main>
  );
}

export default App;
