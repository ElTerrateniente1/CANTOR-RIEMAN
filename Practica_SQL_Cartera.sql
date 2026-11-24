-- Práctica de cartera (datos ficticios). Ejecutar en SQLite.
CREATE TABLE prestamos(id_prestamo INT, id_cliente TEXT, fecha_desembolso TEXT, producto TEXT, sucursal TEXT, monto REAL, plazo_meses INT, tasa_anual REAL, dias_mora INT);
CREATE TABLE clientes(id_cliente TEXT, canal_origen TEXT);
INSERT INTO clientes VALUES('C001','Sucursal');
INSERT INTO clientes VALUES('C002','App');
INSERT INTO clientes VALUES('C003','Sucursal');
INSERT INTO clientes VALUES('C004','App');
INSERT INTO clientes VALUES('C005','Sucursal');
INSERT INTO clientes VALUES('C006','App');
INSERT INTO clientes VALUES('C007','Sucursal');
INSERT INTO clientes VALUES('C008','App');
INSERT INTO clientes VALUES('C009','Sucursal');
INSERT INTO clientes VALUES('C010','App');
INSERT INTO clientes VALUES('C011','Sucursal');
INSERT INTO clientes VALUES('C012','App');
INSERT INTO clientes VALUES('C013','Sucursal');
INSERT INTO clientes VALUES('C014','App');
INSERT INTO clientes VALUES('C015','Sucursal');
INSERT INTO clientes VALUES('C016','App');
INSERT INTO clientes VALUES('C017','Sucursal');
INSERT INTO clientes VALUES('C018','App');
INSERT INTO clientes VALUES('C019','Sucursal');
INSERT INTO clientes VALUES('C020','App');
INSERT INTO prestamos VALUES(1001,'C011','2026-03-23','Préstamo personal','Albrook',350,36,0.18,0);
INSERT INTO prestamos VALUES(1002,'C019','2026-02-03','Tarjeta CMF','Albrook',350,24,0.3,0);
INSERT INTO prestamos VALUES(1003,'C008','2026-02-20','Préstamo personal','Albrook',4500,6,0.24,0);
INSERT INTO prestamos VALUES(1004,'C019','2026-02-05','Préstamo personal','Albrook',800,6,0.36,120);
INSERT INTO prestamos VALUES(1005,'C005','2026-06-02','Préstamo personal','Tocumen',3000,6,0.36,0);
INSERT INTO prestamos VALUES(1006,'C018','2026-04-07','Tarjeta CMF','Chorrera',4500,12,0.28,0);
INSERT INTO prestamos VALUES(1007,'C018','2026-02-06','Tarjeta CMF','Chorrera',800,24,0.36,0);
INSERT INTO prestamos VALUES(1008,'C011','2026-08-31','Préstamo personal','Costa del Este',1200,12,0.24,15);
INSERT INTO prestamos VALUES(1009,'C008','2026-02-15','Préstamo personal','Chorrera',2500,18,0.3,0);
INSERT INTO prestamos VALUES(1010,'C020','2026-02-11','Tarjeta CMF','Chorrera',2000,12,0.28,0);
INSERT INTO prestamos VALUES(1011,'C016','2026-08-08','Tarjeta CMF','Albrook',3000,36,0.28,0);
INSERT INTO prestamos VALUES(1012,'C012','2026-09-16','Préstamo personal','Albrook',350,18,0.3,15);
INSERT INTO prestamos VALUES(1013,'C003','2026-02-05','Préstamo personal','Chorrera',5000,24,0.28,15);
INSERT INTO prestamos VALUES(1014,'C013','2026-07-01','Tarjeta CMF','David',1500,12,0.36,0);
INSERT INTO prestamos VALUES(1015,'C016','2026-02-04','Tarjeta CMF','Costa del Este',500,12,0.3,0);
INSERT INTO prestamos VALUES(1016,'C016','2026-02-15','Tarjeta CMF','David',2000,36,0.28,0);
INSERT INTO prestamos VALUES(1017,'C014','2026-05-27','Préstamo personal','Costa del Este',5000,24,0.24,0);
INSERT INTO prestamos VALUES(1018,'C003','2026-04-05','Tarjeta CMF','Tocumen',5000,12,0.18,0);
INSERT INTO prestamos VALUES(1019,'C019','2026-04-08','Préstamo personal','Costa del Este',200,12,0.3,0);
INSERT INTO prestamos VALUES(1020,'C012','2026-06-17','Tarjeta CMF','Chorrera',4500,6,0.3,120);
INSERT INTO prestamos VALUES(1021,'C018','2026-07-24','Préstamo personal','David',2000,6,0.3,0);
INSERT INTO prestamos VALUES(1022,'C013','2026-02-05','Tarjeta CMF','Albrook',800,24,0.24,0);
INSERT INTO prestamos VALUES(1023,'C011','2026-01-31','Tarjeta CMF','Albrook',4500,12,0.36,0);
INSERT INTO prestamos VALUES(1024,'C012','2026-01-18','Tarjeta CMF','Tocumen',4500,24,0.24,0);
INSERT INTO prestamos VALUES(1025,'C009','2026-07-01','Préstamo personal','David',350,6,0.3,0);
INSERT INTO prestamos VALUES(1026,'C016','2026-09-09','Préstamo personal','Albrook',500,6,0.28,35);
INSERT INTO prestamos VALUES(1027,'C009','2026-09-07','Tarjeta CMF','Chorrera',200,12,0.36,0);
INSERT INTO prestamos VALUES(1028,'C005','2026-01-18','Préstamo personal','Albrook',1200,36,0.28,0);
INSERT INTO prestamos VALUES(1029,'C012','2026-04-29','Préstamo personal','Tocumen',4500,12,0.24,95);
INSERT INTO prestamos VALUES(1030,'C013','2026-05-01','Tarjeta CMF','Chorrera',2500,18,0.18,0);
INSERT INTO prestamos VALUES(1031,'C009','2026-09-03','Préstamo personal','Tocumen',4500,18,0.3,61);
INSERT INTO prestamos VALUES(1032,'C012','2026-07-10','Tarjeta CMF','Tocumen',350,12,0.3,0);
INSERT INTO prestamos VALUES(1033,'C011','2026-04-19','Préstamo personal','Chorrera',4500,6,0.3,0);
INSERT INTO prestamos VALUES(1034,'C012','2026-02-17','Tarjeta CMF','David',800,24,0.24,0);
INSERT INTO prestamos VALUES(1035,'C011','2026-02-18','Préstamo personal','David',2000,6,0.24,0);
INSERT INTO prestamos VALUES(1036,'C005','2026-01-19','Tarjeta CMF','Chorrera',2500,12,0.36,95);
INSERT INTO prestamos VALUES(1037,'C020','2026-09-04','Préstamo personal','Tocumen',3000,36,0.24,0);
INSERT INTO prestamos VALUES(1038,'C001','2026-02-26','Tarjeta CMF','David',800,12,0.18,0);
INSERT INTO prestamos VALUES(1039,'C007','2026-06-03','Tarjeta CMF','Chorrera',1500,18,0.36,0);
INSERT INTO prestamos VALUES(1040,'C005','2026-02-05','Préstamo personal','David',5000,36,0.36,0);
INSERT INTO prestamos VALUES(1005,'C005','2026-06-02','Préstamo personal','Tocumen',3000,6,0.36,0);
INSERT INTO prestamos VALUES(1041,'C007','2026-06-10','Préstamo personal','Albrook',-300,12,0.24,0);
INSERT INTO prestamos VALUES(1042,'C012','2026-07-02','Tarjeta CMF','David',900,12,0.28,-5);
INSERT INTO prestamos VALUES(1043,'C003','2026-08-15','Préstamo personal','Tocumen',1500,24,NULL,0);

-- Vista con datos limpios (sin duplicados ni valores inválidos)
CREATE VIEW prestamos_ok AS SELECT DISTINCT * FROM prestamos WHERE monto>0 AND dias_mora>=0 AND tasa_anual IS NOT NULL;

-- q1
SELECT id_prestamo, COUNT(*) AS veces
FROM prestamos
GROUP BY id_prestamo
HAVING COUNT(*) > 1;

-- q1b
SELECT id_prestamo, monto, tasa_anual, dias_mora
FROM prestamos
WHERE monto <= 0 OR dias_mora < 0 OR tasa_anual IS NULL;

-- q2
SELECT producto,
       COUNT(*)              AS prestamos,
       SUM(monto)            AS cartera,
       ROUND(AVG(tasa_anual)*100,1) AS tasa_prom_pct
FROM prestamos_ok
GROUP BY producto;

-- q3
SELECT producto,
       COUNT(*) AS total,
       SUM(CASE WHEN dias_mora > 30 THEN 1 ELSE 0 END) AS en_mora,
       ROUND(100.0 * SUM(CASE WHEN dias_mora > 30 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_mora
FROM prestamos_ok
GROUP BY producto;

-- q4
SELECT sucursal,
       COUNT(*) AS total,
       SUM(CASE WHEN dias_mora > 30 THEN 1 ELSE 0 END) AS en_mora,
       ROUND(100.0 * SUM(CASE WHEN dias_mora > 30 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_mora
FROM prestamos_ok
GROUP BY sucursal
HAVING COUNT(*) >= 5
ORDER BY pct_mora DESC;

-- q5
SELECT c.canal_origen,
       COUNT(*) AS total,
       SUM(CASE WHEN p.dias_mora > 30 THEN 1 ELSE 0 END) AS en_mora,
       ROUND(100.0 * SUM(CASE WHEN p.dias_mora > 30 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_mora
FROM prestamos_ok p
JOIN clientes c ON c.id_cliente = p.id_cliente
GROUP BY c.canal_origen;

-- q6
WITH mora AS (
  SELECT sucursal, SUM(monto) AS monto_en_mora
  FROM prestamos_ok
  WHERE dias_mora > 30
  GROUP BY sucursal
)
SELECT sucursal, monto_en_mora,
       RANK() OVER (ORDER BY monto_en_mora DESC) AS puesto
FROM mora;
