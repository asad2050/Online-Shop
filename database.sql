-- This file is used to create tables for the database for PostgreSQL
-- It uses version major version 16 of PostgreSQL.
CREATE TABLE session (
    sid VARCHAR PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
) 


CREATE TABLE products (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(250) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR NOT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- or SERIAL for auto-incrementing IDs
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT false;
);

CREATE TABLE addresses(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0, -- New column for total quantity
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- New column for total price
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_title TEXT NOT NULL,          -- Stores product title at the time of order
    product_price NUMERIC(10, 2) NOT NULL, -- Stores product price at the time of order
    quantity INTEGER NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL, -- New column for total price of this item (quantity * product_price)
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);