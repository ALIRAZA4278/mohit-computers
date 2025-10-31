-- Check if there are any 12th Gen laptops in the database
SELECT
  id,
  name,
  generation,
  processor,
  ram,
  hdd as storage,
  price,
  stock_status
FROM products
WHERE
  category = 'Laptops'
  AND (
    generation LIKE '%12%'
    OR generation = '12th Gen'
    OR generation = 12
    OR processor LIKE '%12th Gen%'
    OR processor LIKE '%i3-12%'
    OR processor LIKE '%i5-12%'
    OR processor LIKE '%i7-12%'
    OR processor LIKE '%i9-12%'
  )
ORDER BY id DESC
LIMIT 10;

-- If no 12th gen found, show all generations available
SELECT DISTINCT generation, COUNT(*) as count
FROM products
WHERE category = 'Laptops'
GROUP BY generation
ORDER BY generation DESC;
