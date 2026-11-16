CREATE DATABASE IF NOT EXISTS cecyt9_local
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cecyt9_local;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  boleta CHAR(10) NOT NULL UNIQUE,
  rol ENUM('alumno', 'admin') NOT NULL DEFAULT 'alumno',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS talleres (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  instructor VARCHAR(100),
  fecha DATE NOT NULL,
  cupo SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_taller_cupo CHECK (cupo BETWEEN 1 AND 500)
);

CREATE TABLE IF NOT EXISTS asistencias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  taller_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NULL,
  nombre_alumno VARCHAR(100) NOT NULL,
  boleta CHAR(10) NOT NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_taller_boleta UNIQUE (taller_id, boleta),
  CONSTRAINT fk_asistencia_taller
    FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE,
  CONSTRAINT fk_asistencia_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo)
SELECT 'Programación Web con Next.js',
       'Crea aplicaciones web modernas con componentes y rutas dinámicas.',
       'María Guadalupe Vázquez', '2026-11-15', 30
WHERE NOT EXISTS (SELECT 1 FROM talleres WHERE nombre = 'Programación Web con Next.js');

INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo)
SELECT 'Administración de Bases de Datos MySQL',
       'Diseña esquemas relacionales y consulta información con SQL.',
       'Equipo de bases de datos', '2026-11-20', 25
WHERE NOT EXISTS (SELECT 1 FROM talleres WHERE nombre = 'Administración de Bases de Datos MySQL');

INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo)
SELECT 'Introducción a Express',
       'Construye una API REST con rutas, controladores y validaciones.',
       'Equipo de desarrollo web', '2026-12-05', 20
WHERE NOT EXISTS (SELECT 1 FROM talleres WHERE nombre = 'Introducción a Express');
