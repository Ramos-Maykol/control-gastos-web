-- ----------------------------
-- 1. Script de Base de Datos Mejorado
-- ----------------------------
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

DROP DATABASE IF EXISTS control_gastos;
CREATE DATABASE IF NOT EXISTS control_gastos;
USE control_gastos;

-- Tabla Usuarios (Seguridad Mejorada)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,  -- Para hashing seguro
    edad INT CHECK (edad BETWEEN 18 AND 25),
    ciudad VARCHAR(100) DEFAULT 'Trujillo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario_email (email)
) ENGINE=InnoDB;

-- Tabla Categorías (Globales + Personales)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('ingreso', 'egreso') NOT NULL,
    usuario_id INT DEFAULT NULL,
    es_global BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_tipo_categoria CHECK (
        (es_global = TRUE AND usuario_id IS NULL) OR 
        (es_global = FALSE AND usuario_id IS NOT NULL)
    ),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_categoria_usuario (usuario_id)
) ENGINE=InnoDB;

-- Tabla Movimientos (Con histórico implícito)
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
    descripcion TEXT,
    fecha DATE NOT NULL,
    tipo ENUM('ingreso', 'egreso') NOT NULL,
    recurrente BOOLEAN DEFAULT FALSE,
    etiquetas JSON,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_usuario_fecha (usuario_id, fecha),
    INDEX idx_movimientos_tipo (tipo, fecha)
) ENGINE=InnoDB;

-- Tabla Metas de Ahorro (Con progreso calculado)
CREATE TABLE metas_ahorro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    monto_objetivo DECIMAL(10, 2) NOT NULL CHECK (monto_objetivo > 0),
    monto_actual DECIMAL(10, 2) DEFAULT 0 CHECK (monto_actual >= 0),
    fecha_inicio DATE DEFAULT (CURRENT_DATE),
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CHECK (fecha_fin > fecha_inicio),
    INDEX idx_metas_estado ((monto_objetivo - monto_actual))
) ENGINE=InnoDB;

-- Tabla Consejos (Con sistema de votación)
CREATE TABLE consejos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    publico_objetivo ENUM('general', 'universitario', 'ahorro') DEFAULT 'general',
    dificultad ENUM('básico', 'intermedio', 'avanzado') DEFAULT 'básico',
    votos_positivos INT DEFAULT 0,
    votos_negativos INT DEFAULT 0,
    INDEX idx_consejos_popularidad ((votos_positivos - votos_negativos))
) ENGINE=InnoDB;

-- Tabla Alertas Inteligentes
CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    tipo_alerta ENUM('gasto_limite', 'recordatorio', 'meta') NOT NULL,
    fecha_alerta DATE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    parametros JSON,  -- Ej: {"limite": 500, "categoria": 3}
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_alertas_activas (activa)
) ENGINE=InnoDB;

COMMIT;