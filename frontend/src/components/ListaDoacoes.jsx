function ListaDoacoes({ doacoes }) {
  if (doacoes.length === 0) {
    return <p>Nenhuma doação disponível no momento.</p>;
  }

  return (
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
  );
}

export default ListaDoacoes;
