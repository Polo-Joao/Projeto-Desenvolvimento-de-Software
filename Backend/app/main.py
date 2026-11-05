from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import DoacaoCreate, DoacaoResponse

app = FastAPI(title="Doações entre Vizinhos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "mensagem": "API de doações entre vizinhos"
    }


# Consulta as doações
@app.get("/doacoes", response_model=list[DoacaoResponse])
def listar_doacoes(db: Session = Depends(get_db)):
    return db.query(models.Doacao).all()


# Publica uma doação
@app.post("/doacoes", response_model=DoacaoResponse, status_code=201)
def criar_doacao(dados: DoacaoCreate, db: Session = Depends(get_db)):
    doacao = models.Doacao(**dados.model_dump())

    db.add(doacao)
    db.commit()
    db.refresh(doacao)
    return doacao
