"""
Script para cargar nodos y relaciones en Neo4j a partir del dataset y mapeos psicológicos.
"""
import os
import csv
from neo4j import GraphDatabase

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "picto_neo4j_password")

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sample_professions.csv")

def ingest_data():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    
    with driver.session() as session:
        print("[*] Creando restricciones e índices en Neo4j...")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (p:Profession) REQUIRE p.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (r:Trait) REQUIRE r.code IS UNIQUE")

        print(f"[*] Leyendo dataset desde {CSV_PATH}...")
        with open(CSV_PATH, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                prof_id = row["id"]
                name = row["name"]
                category = row["category"]
                riasec_code = row["riasec_code"]
                skills = [s.strip() for s in row["skills"].split(";") if s.strip()]

                # Crear o actualizar Profesión
                session.run(
                    """
                    MERGE (p:Profession {id: $prof_id})
                    SET p.name = $name, p.category = $category, p.riasec = $riasec_code
                    """,
                    prof_id=prof_id, name=name, category=category, riasec_code=riasec_code
                )

                # Relacionar Habilidades (REQUIRES_SKILL)
                for skill in skills:
                    session.run(
                        """
                        MERGE (s:Skill {name: $skill_name})
                        WITH s
                        MATCH (p:Profession {id: $prof_id})
                        MERGE (p)-[:REQUIRES_SKILL]->(s)
                        """,
                        skill_name=skill, prof_id=prof_id
                    )

        print("[✓] Ingesta en Neo4j completada con éxito.")

    driver.close()

if __name__ == "__main__":
    ingest_data()
