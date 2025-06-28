
-- Primeiro, encontrar a categoria "Parcela Carro" mais antiga (que vamos manter)
WITH oldest_category AS (
  SELECT id 
  FROM financial_categories 
  WHERE name = 'Parcela Carro' 
    AND type = 'despesa'
  ORDER BY created_at 
  LIMIT 1
),
categories_to_delete AS (
  SELECT id
  FROM financial_categories 
  WHERE name = 'Parcela Carro' 
    AND type = 'despesa'
    AND id NOT IN (SELECT id FROM oldest_category)
)
-- Atualizar todas as despesas que referenciam categorias duplicadas para usar a categoria mais antiga
UPDATE expenses 
SET category_id = (SELECT id FROM oldest_category)
WHERE category_id IN (SELECT id FROM categories_to_delete);

-- Agora remover as categorias duplicadas
WITH oldest_category AS (
  SELECT id 
  FROM financial_categories 
  WHERE name = 'Parcela Carro' 
    AND type = 'despesa'
  ORDER BY created_at 
  LIMIT 1
)
DELETE FROM financial_categories 
WHERE name = 'Parcela Carro' 
  AND type = 'despesa'
  AND id NOT IN (SELECT id FROM oldest_category);

-- Garantir que existe pelo menos uma categoria "Parcela Carro"
INSERT INTO financial_categories (name, type, is_default)
SELECT 'Parcela Carro', 'despesa', true
WHERE NOT EXISTS (
  SELECT 1 FROM financial_categories 
  WHERE name = 'Parcela Carro' 
    AND type = 'despesa'
);
