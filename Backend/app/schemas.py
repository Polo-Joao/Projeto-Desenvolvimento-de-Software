
from pydantic import BaseModel, Field


class DoacaoCreate(BaseModel):
    titulo: str = Field(min_length=3, max_length=100)
    descricao: str = Field(min_length=5, max_length=500)
    categoria: str = Field(min_length=3, max_length=50)
    regiao: str | None = Field(default=None, max_length=100)


class DoacaoResponse(DoacaoCreate):
    id: int

    model_config = {
        "from_attributes": True
    }
