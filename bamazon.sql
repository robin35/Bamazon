DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (

  item_id INTEGER(11) AUTO_INCREMENT UNIQUE NOT NULL,

  product_name VARCHAR(30) NOT NULL,

  department_name VARCHAR(30),

  price DECIMAL(10,4),

  stock_quantity INTEGER(10),

  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Christian Louboutin Pumps", "Designer Shoes", 845.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jimmy Choo Leather Boots", "Designer Shoes", 1195.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chanel Small Hobo Bag", "Handbags", 3900.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gucci Zumi Clutch", "Handbags", 4300.00, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dolce & Gabbana Shell", "Women's Clothing", 745.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tahari Cocktail Dress", "Women's Clothing", 170.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Valentino Leather Belt", "Accessories", 375.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("UGG Sherling Gloves", "Accessories", 55.00, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tory Burch Sunglasses", "Accessories", 95.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ralph Lauren King Comforter", "Home", 230.00, 15);