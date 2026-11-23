import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


class TestDoacoesAPI(unittest.TestCase):
    def setUp(self):
        # shortcut: usa SQLite em memoria para nao alterar o PostgreSQL real; trocar se usar tipos exclusivos do Postgres
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=self.engine)
        TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

        def override_get_db():
            db = TestingSession()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=self.engine)
        self.engine.dispose()

    def test_home(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("mensagem", res.json())

    def test_listar_vazio_inicialmente(self):
        res = self.client.get("/doacoes")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])

    def test_criar_e_listar_doacao(self):
        payload = {
            "titulo": "Bicicleta infantil",
            "descricao": "Aro 16 em bom estado",
            "categoria": "Esportes",
            "regiao": "Centro",
        }
        res_post = self.client.post("/doacoes", json=payload)
        self.assertEqual(res_post.status_code, 201)
        criada = res_post.json()
        self.assertEqual(criada["id"], 1)
        self.assertEqual(criada["titulo"], payload["titulo"])

        res_get = self.client.get("/doacoes")
        self.assertEqual(res_get.status_code, 200)
        self.assertEqual(res_get.json(), [criada])

    def test_criar_sem_regiao_opcional(self):
        payload = {
            "titulo": "Livros didaticos",
            "descricao": "Colecao completa de matematica",
            "categoria": "Livros",
        }
        res = self.client.post("/doacoes", json=payload)
        self.assertEqual(res.status_code, 201)
        self.assertIsNone(res.json()["regiao"])

    def test_validacao_rejeita_campos_curtos(self):
        res = self.client.post("/doacoes", json={"titulo": "Oi", "descricao": "abc", "categoria": "x"})
        self.assertEqual(res.status_code, 422)

    def test_cors_preflight_frontend(self):
        res = self.client.options(
            "/doacoes",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get("access-control-allow-origin"), "http://localhost:5173")


if __name__ == "__main__":
    unittest.main()
