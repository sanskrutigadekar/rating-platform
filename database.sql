
CREATE DATABASE IF NOT EXISTS rating_platform;
USE rating_platform;


CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role ENUM('admin', 'user', 'store_owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id)
);


INSERT INTO users (name, email, password, address, role) VALUES
('System Administrator Full Name Here', 'admin@rating.com', '$2a$12$GK2ptVxZNQujEsCGD4PdGuxI7t/2bEKbF6Jo48F5xPPZW.J7FvHAO', '123 Admin Street, City, Country', 'admin');


INSERT INTO users (name, email, password, address, role) VALUES
('Store Owner Full Name Example Here', 'store@example.com', '$2a$12$J1txlLq9nIHZfXvI5Xd7Oei7.emF8wCBr6k4otQJ1Q4IEJFK2zRFS', '456 Store Street, City, Country', 'store_owner');


INSERT INTO users (name, email, password, address, role) VALUES
('Normal User Full Name Example Here', 'user@example.com', '$2a$12$p3fKno/C2LG8EisePkT0U.fs4urzzSxbV7kAimRdRy04VIoM33I/m', '789 User Street, City, Country', 'user');


INSERT INTO stores (name, email, address, owner_id) VALUES
('SuperMart Retail Store', 'info@supermart.com', '123 Shopping Mall, Main Street, City', 2),
('Tech Gadgets Electronics', 'sales@techgadgets.com', '456 Tech Park, Electronics Avenue', 2),
('Fresh Foods Grocery', 'contact@freshfoods.com', '789 Market Square, Food Court', 2),
('Fashion Trends Boutique', 'hello@fashiontrends.com', '321 Fashion Street, Style District', 2);


INSERT INTO ratings (store_id, user_id, rating) VALUES
(1, 3, 5),  
(2, 3, 4),  
(3, 3, 3);  