-- Esquema de la base de datos cecyt9_local
-- Ejecutar una vez en MySQL:  mysql -u root -p < sql/schema.sql
-- Usa IF NOT EXISTS, así que no borra tablas que ya tengas.
-- Si tu tabla usuarios ya existe con otro tipo de id, ajusta usuario_id en
-- inscripciones y asistencias para que tenga exactamente el mismo tipo.

CREATE DATABASE IF NOT EXISTS cecyt9_local
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cecyt9_local;

-- Usuarios (alumnos, profesores, etc.)
CREATE TABLE IF NOT EXISTS usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    correo          VARCHAR(120) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    boleta          CHAR(10)     NOT NULL UNIQUE,
    rol             VARCHAR(20)  NOT NULL DEFAULT 'alumno'
);

-- Talleres. El número de inscritos NO se guarda: se calcula contando inscripciones.
CREATE TABLE IF NOT EXISTS talleres (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(120) NOT NULL,
    instructor VARCHAR(120) NOT NULL,
    cupo       INT          NOT NULL,
    CONSTRAINT ck_talleres_cupo CHECK (cupo > 0)
);

-- Quién está inscrito en qué taller (un alumno no puede inscribirse dos veces al mismo taller)
CREATE TABLE IF NOT EXISTS inscripciones (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id        INT      NOT NULL,
    taller_id         INT      NOT NULL,
    fecha_inscripcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_inscripcion UNIQUE (usuario_id, taller_id),
    CONSTRAINT fk_inscripcion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_inscripcion_taller  FOREIGN KEY (taller_id)  REFERENCES talleres (id) ON DELETE CASCADE
);

-- Asistencias: una por alumno, taller y día
CREATE TABLE IF NOT EXISTS asistencias (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT  NOT NULL,
    taller_id  INT  NOT NULL,
    fecha      DATE NOT NULL,
    CONSTRAINT uq_asistencia UNIQUE (usuario_id, taller_id, fecha),
    CONSTRAINT fk_asistencia_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_asistencia_taller  FOREIGN KEY (taller_id)  REFERENCES talleres (id) ON DELETE CASCADE
);
