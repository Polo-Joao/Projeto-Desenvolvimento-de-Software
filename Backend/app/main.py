from fast api import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Doações entre Vizinhos")

class DoacaoCreate(BaseModel):
    titulo: str = Field(min_length=3, max_length=100)
    descricao: str = Field(min_length=5, max_length=500)
    categoria: str = Field(min_length=3, max_length=50)
    regiao: str | None = None

class Doacao(DoacaoCreate):
    id: int

doacoes: list[Doacao] = []

@app.get("/")
def home():
    return {
        "mensagem": "API de doações entre vizinhos"
    }

#Consulta as doações
@app.get("/doacoes", response_model=list[Doacao])
def listar_doacoes():
    return doacoes

#Publica uma doação
@app.post("/doacoes", response_model=Doacao, status_code=201)
def criar_doacao(dados: DoacaoCreate):
    doacao = Doacao(
        id=len(doacoes) + 1,
        **dados.model_dump()
    )

    doacoes.append(doacao)
    return doacao

