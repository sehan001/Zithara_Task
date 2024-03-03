CREATE TABLE customers (
    sno SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    age INTEGER,
    phone VARCHAR(20),
    location VARCHAR(255),
    created_at TIMESTAMP
);
INSERT INTO customers (customer_name, age, phone, location, created_at)
SELECT
    md5(random()::text),
    floor(random() * 100) + 18, 
    concat('+91', floor(random() * 9000000000) + 1000000000), -- Random phone number
    md5(random()::text),
    NOW() - interval '1 day' * floor(random() * 365) 
FROM generate_series(1, 50);
select * from customers