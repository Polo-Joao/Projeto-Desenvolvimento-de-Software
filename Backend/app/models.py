
from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Doacao(Base):
    __tablename__ = "doacoes"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=False)
    categoria = Column(String(50), nullable=False)
    regiao = Column(String(100), nullable=True)
