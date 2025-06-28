
-- Migração de fotos da tabela vehicles para vehicle_photos
DO $$
DECLARE
    vehicle_record RECORD;
    photo_url TEXT;
    photo_position INTEGER;
BEGIN
    -- Iterar por todos os veículos que têm fotos
    FOR vehicle_record IN 
        SELECT id, photos 
        FROM vehicles 
        WHERE photos IS NOT NULL AND array_length(photos, 1) > 0
    LOOP
        photo_position := 1;
        
        -- Iterar por cada foto no array
        FOREACH photo_url IN ARRAY vehicle_record.photos
        LOOP
            -- Inserir foto na tabela vehicle_photos
            INSERT INTO vehicle_photos (vehicle_id, url, position, is_main)
            VALUES (
                vehicle_record.id,
                photo_url,
                photo_position,
                photo_position = 1  -- A primeira foto será marcada como principal
            );
            
            photo_position := photo_position + 1;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Migração concluída. Fotos transferidas com sucesso.';
END $$;

-- Verificar se a migração foi bem-sucedida
SELECT 
    v.name,
    v.internal_code,
    array_length(v.photos, 1) as fotos_originais,
    COUNT(vp.id) as fotos_migradas
FROM vehicles v
LEFT JOIN vehicle_photos vp ON v.id = vp.vehicle_id
WHERE v.photos IS NOT NULL AND array_length(v.photos, 1) > 0
GROUP BY v.id, v.name, v.internal_code, v.photos
ORDER BY v.internal_code;
