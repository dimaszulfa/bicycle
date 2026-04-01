-- SQL Schema for UD. ADIPA Bicycle E-Commerce

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image TEXT,
    rating DECIMAL(2, 1) DEFAULT 0.0
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(100) NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Menunggu Pembayaran',
    date DATE DEFAULT CURRENT_DATE,
    address TEXT NOT NULL,
    paymentMethod VARCHAR(100) NOT NULL,
    paymentProof TEXT
);

-- Initial Data
INSERT INTO products (name, category, price, stock, description, image, rating) VALUES 
('Polygon Cascade 4', 'Mountain Bike', 3500000, 10, 'Sepeda gunung serbaguna untuk medan off-road ringan dan penggunaan sehari-hari.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80', 4.5),
('United Detroit 1.0', 'Mountain Bike', 2800000, 5, 'Sepeda gunung dengan rangka alloy yang ringan dan tahan lama.', 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80', 4.2),
('Pacific Noris 2.1', 'Folding Bike', 4200000, 8, 'Sepeda lipat stylish dengan performa handal untuk mobilitas perkotaan.', 'https://images.unsplash.com/photo-1571068316344-75bc76f77891?auto=format&fit=crop&w=800&q=80', 4.8),
('Thrill Ravage 5.0', 'Mountain Bike', 5500000, 3, 'Sepeda gunung premium untuk performa maksimal di medan berat.', 'https://images.unsplash.com/photo-1507035895480-2b544cb897ad?auto=format&fit=crop&w=800&q=80', 4.7),
('Wimcycle Pocket Rocket', 'Folding Bike', 2500000, 12, 'Sepeda lipat ekonomis namun tetap berkualitas dari Wimcycle.', 'https://images.unsplash.com/photo-1501147830916-ce44a6359892?auto=format&fit=crop&w=800&q=80', 4.0);
