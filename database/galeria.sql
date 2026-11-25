CREATE DATABASE IF NOT EXISTS cafe_aroma
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe_aroma;

CREATE TABLE IF NOT EXISTS fotos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(60) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    descripcion VARCHAR(160) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO fotos (id, titulo, categoria, imagen, descripcion) VALUES
(1, 'Espresso', 'Bebidas', 'galeria1.avif', 'Taza de café espresso'),
(2, 'Cappuccino', 'Bebidas', 'galeria.avif', 'Cappuccino con espuma de leche'),
(3, 'Latte', 'Bebidas', 'latte.avif', 'Café latte'),
(4, 'Croissant artesanal', 'Repostería', 'croissant.avif', 'Croissant artesanal recién horneado'),
(5, 'Repostería artesanal', 'Repostería', 'panes.avif', 'Postre artesanal de Café Aroma'),
(6, 'Interior de la cafetería', 'Ambiente', 'cafeteriainterior.webp', 'Interior de la cafetería con mesas, sillas y barra de café'),
(7, 'Ambiente de la tarde', 'Ambiente', 'ambienteacogedor.jpg', 'Vista del ambiente acogedor de la cafetería.');