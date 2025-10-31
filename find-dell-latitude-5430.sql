-- Find Dell Latitude 5430 (12th Gen) in database
SELECT
  id,
  name,
  generation,
  processor,
  ram,
  hdd as storage,
  price,
  stock_status,
  show_ram_options,
  show_ssd_options
FROM products
WHERE
  name LIKE '%Latitude%5430%'
  OR name LIKE '%5430%'
ORDER BY id DESC;

-- If not found with exact name, try Dell Latitude
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
  name LIKE '%Dell%Latitude%'
  AND (
    generation LIKE '%12%'
    OR processor LIKE '%12th%'
  )
ORDER BY id DESC
LIMIT 5;
