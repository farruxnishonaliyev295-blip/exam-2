CREATE DATABASE CAR;
\c

CREATE TABLE cars (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year BIGINT NOT NULL,
    color VARCHAR(50),
    price DECIMAL(12,2) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact BIGINT
);
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    carsId BIGINT REFERENCES cars(id),
    customersId BIGINT REFERENCES customers(id),
    count_month INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(12,2) NOT NULL,
    createdAt DATE DEFAULT CURRENT_DATE,
    orderId INT REFERENCES orders(id)
);


INSERT INTO cars (name, year, color, price) VALUES
('BMW X5', 2022, 'Black', 45000),
('Malibu', 2021, 'White', 28000),
('Cobalt', 2020, 'Gray', 18000),
('Toyota Camry', 2023, 'Blue', 32000);

INSERT INTO customers (name, age, password, contact) VALUES
('Ali Valiyev', 28, '123456', 998901112233),
('Bekzod Karimov', 35, 'password', 998931234567),
('Dilshod Akramov', 30, 'qwerty', 998971112244);

INSERT INTO orders (carsId, customersId, count_month, start_date, end_date) VALUES
(1, 1, 6, '2025-01-01', '2025-06-01'),
(2, 2, 3, '2025-02-01', '2025-04-01'),
(3, 3, 1, '2025-03-01', '2025-03-01');

INSERT INTO payments (amount, orderId) VALUES
(7500, 1),
(7500, 1),
(7500, 1),

(9300, 2),
(9300, 2),

(18000, 3);
