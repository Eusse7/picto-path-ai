// Consultar profesiones por dimensión RIASEC
MATCH (p:Profession)
WHERE p.riasec CONTAINS 'I'
RETURN p.name, p.category, p.riasec;

// Encontrar habilidades compartidas entre profesiones
MATCH (p1:Profession)-[:REQUIRES_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(p2:Profession)
WHERE p1 <> p2
RETURN p1.name AS Profesion1, p2.name AS Profesion2, s.name AS HabilidadCompartida;

// Recomendar profesiones basadas en un conjunto de habilidades
MATCH (s:Skill)<-[:REQUIRES_SKILL]-(p:Profession)
WHERE s.name IN ['Lógica', 'Algoritmos']
RETURN p.name, count(s) AS HabilidadesCoincidentes
ORDER BY HabilidadesCoincidentes DESC;
