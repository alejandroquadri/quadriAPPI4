-- trae facturas
SELECT 	  tr.numerodocumento as numero,
          tr.nombreoriginante as vendedor,
          tr.nombredestinatario as cliente,	
          'Factura' as transaccion,
          replace(replace(replace(SUBSTRING(tr.nombre,1,10),'Fact.Vta. ','Factura Vta'),'Fact.Vta.M','Fact Most'),'Anticipo N','Anticipo') as tipo_transaccion,
          Case 	itc.nombre
                WHEN 'Quadri' THEN 'Productos Elaborados'
                WHEN 'Flete' THEN 'Flete'
                ELSE 'Reventa'
                End as tipo_producto,
          SUBSTRING(tr.fechaactual,1,4) || SUBSTRING(tr.fechaactual,5,2) || SUBSTRING(tr.fechaactual,7,2) fecha,
          SUBSTRING(tr.fechaactual,5,2) mes,
          SUBSTRING(tr.fechaactual,1,4) anio,
          itr.cantidad2_cantidad as cantidad,
          um.nombre as unidad_medida,
          itr.valor2_importe as precio,
          itr.nombrereferencia as codigo,
          itr.descripcion as descripcion,
          Case 	tr.nota
                WHEN 'A' THEN 'Responsable Inscripto'
                ELSE 'Consumidor Final' 
                End  
                as tipo_consumidor, 
          itr.totalsindescuentos as neto,
          itr.impboni2_importe * -1  as bonificacion,
          itr.impdesc2_importe * -1  as anticipo,
          itr.totalsindescuentos - itr.impboni2_importe - itr.impdesc2_importe as total,
          seg.nombre1 as color,
          seg.nombre2 as clase_producto,
          seg.nombre3 as dibujo,
          seg.nombre4 as pulido,
          seg.nombre5 as marca,
          seg.nombre6 as prensa,
          seg.nombre7 as tipo_cemento

FROM      trfacturaventa tr
LEFT JOIN itemfacturaventa itr on itr.bo_place_id = tr.itemstransaccion_id 
LEFT JOIN (
            SELECT  id, segmento_id 
            FROM    producto
            UNION
            SELECT  id, segmento_id 
            FROM    Servicio
            UNION
            SELECT  id, segmento_id 
            FROM    ConceptoContable
          ) prod on prod.id = itr.referencia_id
LEFT JOIN segmento seg on seg.id = prod.segmento_id 
LEFT JOIN itemtipoclasificador itc on itc.id = seg.segmento5_id
LEFT JOIN unidadmedida um on um.id = itr.unidadmedida_id

-- WHERE     SUBSTRING(tr.fechaactual, 1, 8) >= SUBSTRING('20171201', 1, 8) 
-- AND       SUBSTRING(tr.fechaactual, 1, 8) <= SUBSTRING('20171231', 1, 8)

WHERE     SUBSTRING(tr.fechaactual, 1, 8) >= SUBSTRING(${fechaDesde}, 1, 8) 
AND       SUBSTRING(tr.fechaactual, 1, 8) <= SUBSTRING(${fechaHasta}, 1, 8)

AND       tr.nombre not like 'SdoInCli%'

UNION ALL

-- trae notas de credito
SELECT    tr.numerodocumento as numero,
          tr.nombreoriginante as vendedor,
          tr.nombredestinatario as cliente,
          'Nota de Credito' as transaccion,
          replace(replace(replace(replace(SUBSTRING(tr.nombre,1,10),'Fact.Anul.','Fact Aunulada'),'NC.Vta.Int','Credito Interno'),'NC. Vta. N','Credito Vta'),'ND.Anul. N','ND Anulada') as tipo_transaccion,
          Case  itc.nombre
                WHEN 'Quadri' THEN 'Productos Elaborados'
                WHEN 'Flete' THEN 'Flete'
                ELSE 'Reventa'
                End as tipo_producto, 
          SUBSTRING(tr.fechaactual,1,4) || SUBSTRING(tr.fechaactual,5,2) || SUBSTRING(tr.fechaactual,7,2) fecha,
          SUBSTRING(tr.fechaactual,5,2) as mes,
          SUBSTRING(tr.fechaactual,1,4) as anio,
          itr.cantidad2_cantidad as cantidad,
          um.nombre as unidad_medida,
          itr.valor2_importe as precio,
          itr.nombrereferencia as codigo,
          itr.descripcion as descripcion,
          Case  tr.nota
                WHEN 'A' THEN 'Responsable Inscripto'
                ELSE 'Consumidor Final' 
                End  as TipoConsumidor, 
          itr.totalsindescuentos * -1 as Neto,
          itr.impboni2_importe * -1  as bonificacion,
          itr.impdesc2_importe * -1 as anticipo,
          itr.totalsindescuentos * -1 - itr.impboni2_importe - itr.impdesc2_importe as total,
          seg.nombre1 as color,
          seg.nombre2 as clase_producto,
          seg.nombre3 as dibujo,
          seg.nombre4 as pulido,
          seg.nombre5 as marca,
          seg.nombre6 as prensa,
          seg.nombre7 as tipo_cemento

FROM      trcreditoventa tr
LEFT JOIN itemcreditoventa itr on itr.bo_place_id = tr.itemstransaccion_id 
LEFT JOIN (
            SELECT  id, segmento_id 
            FROM    producto
            UNION
            SELECT  id, segmento_id 
            FROM    Servicio
            UNION
            SELECT  id, segmento_id 
            FROM    ConceptoContable
          ) prod on prod.id = itr.referencia_id
LEFT JOIN segmento seg on seg.id = prod.segmento_id 
LEFT JOIN itemtipoclasificador itc on itc.id = seg.segmento5_id
LEFT JOIN unidadmedida um on um.id = itr.unidadmedida_id

-- WHERE     SUBSTRING(tr.fechaactual, 1, 8) >= SUBSTRING('20171201', 1, 8)
-- AND       SUBSTRING(tr.fechaactual, 1, 8) <= SUBSTRING('20171231', 1, 8)

WHERE     SUBSTRING(tr.fechaactual, 1, 8) >= SUBSTRING(${fechaDesde}, 1, 8) 
AND       SUBSTRING(tr.fechaactual, 1, 8) <= SUBSTRING(${fechaHasta}, 1, 8)

AND       tr.nombre not like 'SdoInCli%'
   
UNION ALL

-- trae notas de debito
SELECT    tr.numerodocumento as numero,
          tr.nombreoriginante as vendedor,
          tr.nombredestinatario as cliente,
          'Nota de Debito' as transaccion,
          replace(replace(replace(replace(SUBSTRING(tr.nombre,1,10),'NC.Anul. N','Credito Anulado'),'ND.Ch.Rech','Cheque Rechazado'),'ND.Vta.Int','Debito Interno'),'ND. Vta. N','Nota de Debito') as tipo_transaccion,
          Case  itc.nombre
                WHEN 'Quadri' THEN 'Productos Elaborados'
                WHEN 'Flete' THEN 'Flete'
                ELSE 'Reventa'
                End  as tipo_producto, 
          SUBSTRING(tr.fechaactual,1,4) || SUBSTRING(tr.fechaactual,5,2) || SUBSTRING(tr.fechaactual,7,2) fecha,
          SUBSTRING(tr.fechaactual,5,2) as mes,
          SUBSTRING(tr.fechaactual,1,4) as anio,
          itr.cantidad2_cantidad as cantidad,
          um.nombre as unidad_medida,
          itr.valor2_importe as precio,
          itr.nombrereferencia as codigo,
          itr.descripcion as descripcion,
          Case  tr.nota
                WHEN 'A' THEN 'Responsable Inscripto'
                ELSE 'Consumidor Final' 
                End  as tipo_consumidor, 
          itr.totalsindescuentos as Neto,
          itr.impboni2_importe as bonificacion,
          itr.impdesc2_importe as anticipo,
          itr.totalsindescuentos - itr.impboni2_importe - itr.impdesc2_importe as total,
          seg.nombre1 as color,
          seg.nombre2 as clase_producto,
          seg.nombre3 as dibujo,
          seg.nombre4 as pulido,
          seg.nombre5 as marca,
          seg.nombre6 as prensa,
          seg.nombre7 as tipo_cemento

FROM      trdebitoventa tr
LEFT JOIN itemdebitoventa itr on itr.bo_place_id = tr.itemstransaccion_id 
LEFT JOIN (
            SELECT  id, segmento_id 
            FROM    producto
            UNION
            SELECT  id, segmento_id 
            FROM    Servicio
            UNION
            SELECT  id, segmento_id 
            FROM    ConceptoContable
          ) prod on prod.id = itr.referencia_id
LEFT JOIN segmento seg on seg.id = prod.segmento_id 
LEFT JOIN itemtipoclasificador itc on itc.id = seg.segmento5_id
LEFT JOIN unidadmedida um on um.id = itr.unidadmedida_id

-- WHERE     SUBSTRING(tr.fechaactual, 1, 8) >= SUBSTRING('20171201', 1, 8)
-- AND       SUBSTRING(tr.fechaactual, 1, 8) <= SUBSTRING('20171231', 1, 8)

WHERE     SUBSTRING(tr.fechaactual, 1, 8) >= SUBSTRING(${fechaDesde}, 1, 8) 
AND       SUBSTRING(tr.fechaactual, 1, 8) <= SUBSTRING(${fechaHasta}, 1, 8)

AND       tr.nombre not like 'SdoInCli%'

ORDER BY  fecha, tipo_transaccion, numero ASC