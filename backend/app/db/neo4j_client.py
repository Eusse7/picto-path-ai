from neo4j import GraphDatabase
from app.core.config import settings

class Neo4jConnection:
    def __init__(self):
        self._driver = None

    def connect(self):
        if not self._driver:
            try:
                self._driver = GraphDatabase.driver(
                    settings.NEO4J_URI,
                    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
                )
            except Exception as e:
                print(f"[Aviso] No se pudo conectar a Neo4j: {e}")
        return self._driver

    def close(self):
        if self._driver:
            self._driver.close()

neo4j_conn = Neo4jConnection()

def get_neo4j_driver():
    return neo4j_conn.connect()
