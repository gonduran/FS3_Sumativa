CREATE TABLE ordenes (
    id_orden BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    estado INTEGER NOT NULL,
    fecha TIMESTAMP,
    monto_total DOUBLE
);

CREATE TABLE detalle_ordenes (
    id_detalle_orden BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_orden BIGINT,
    id_producto BIGINT NOT NULL,
    precio DOUBLE NOT NULL,
    cantidad INTEGER NOT NULL,
    monto_total DOUBLE NOT NULL,
    FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden)
);

CREATE TABLE IF NOT EXISTS Categoria (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Producto (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DOUBLE NOT NULL,
    stock DOUBLE NOT NULL,
    imagen VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Producto_Categoria (
    id_producto BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,
    PRIMARY KEY (id_producto, id_categoria),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
);