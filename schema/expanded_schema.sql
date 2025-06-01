-- Existing tables (simplified versions for reference)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE parkings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_floors INTEGER NOT NULL DEFAULT 1,
    operating_hours_start TIME,
    operating_hours_end TIME,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    last_login TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- New table: vehicle_types
CREATE TABLE vehicle_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Insert common vehicle types
INSERT INTO vehicle_types (name, description) VALUES 
('CAR', 'Standard passenger car'),
('MOTORCYCLE', 'Motorcycle or scooter'),
('SUV', 'Sport utility vehicle'),
('VAN', 'Passenger or cargo van'),
('TRUCK', 'Light or medium truck'),
('BICYCLE', 'Bicycle or e-bike'),
('ELECTRIC_VEHICLE', 'Electric car or vehicle');

-- New table: vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(id),
    license_plate VARCHAR(20) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(license_plate)
);

-- New table: parking_zones
CREATE TABLE parking_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parking_id UUID NOT NULL REFERENCES parkings(id),
    name VARCHAR(100) NOT NULL,
    floor_number INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- New table: parking_spaces
CREATE TABLE parking_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES parking_zones(id),
    space_number VARCHAR(20) NOT NULL,
    vehicle_type_id UUID REFERENCES vehicle_types(id),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(zone_id, space_number)
);

-- New table: tarifas (rates by vehicle type and time period)
CREATE TABLE tarifas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parking_id UUID NOT NULL REFERENCES parkings(id),
    vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(id),
    name VARCHAR(100) NOT NULL,
    rate_per_hour DECIMAL(10, 2) NOT NULL,
    rate_per_day DECIMAL(10, 2),
    rate_per_week DECIMAL(10, 2),
    rate_per_month DECIMAL(10, 2),
    minimum_time_minutes INTEGER NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(parking_id, vehicle_type_id, name)
);

-- New table: planes_especiales (special plans/subscriptions)
CREATE TABLE planes_especiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parking_id UUID NOT NULL REFERENCES parkings(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(id),
    base_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
    max_entries INTEGER,
    max_hours INTEGER,
    is_vip BOOLEAN NOT NULL DEFAULT FALSE,
    requires_registration BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- New table: user_planes (user subscriptions to special plans)
CREATE TABLE user_planes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    plan_id UUID NOT NULL REFERENCES planes_especiales(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_paid DECIMAL(10, 2) NOT NULL,
    payment_reference VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- New table: reservas (reservations)
CREATE TABLE reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    parking_id UUID NOT NULL REFERENCES parkings(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    parking_space_id UUID REFERENCES parking_spaces(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    estimated_duration_minutes INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELED, NO_SHOW, COMPLETED
    tarifa_id UUID REFERENCES tarifas(id),
    user_plan_id UUID REFERENCES user_planes(id),
    estimated_cost DECIMAL(10, 2),
    confirmation_code VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT check_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELED', 'NO_SHOW', 'COMPLETED')),
    CONSTRAINT check_reservation_times CHECK (end_time IS NULL OR end_time > start_time)
);

-- New table: parking_sessions (actual parking usage)
CREATE TABLE parking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES reservas(id),
    user_id UUID NOT NULL REFERENCES users(id),
    parking_id UUID NOT NULL REFERENCES parkings(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    parking_space_id UUID NOT NULL REFERENCES parking_spaces(id),
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP,
    tarifa_id UUID REFERENCES tarifas(id),
    user_plan_id UUID REFERENCES user_planes(id),
    total_cost DECIMAL(10, 2),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, FAILED
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT check_session_times CHECK (exit_time IS NULL OR exit_time > entry_time)
);

-- New table: puntos_fidelidad (loyalty points)
CREATE TABLE puntos_fidelidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    points_balance INTEGER NOT NULL DEFAULT 0,
    total_points_earned INTEGER NOT NULL DEFAULT 0,
    total_points_redeemed INTEGER NOT NULL DEFAULT 0,
    last_activity_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT check_points_balance CHECK (points_balance >= 0),
    CONSTRAINT check_points_earned CHECK (total_points_earned >= 0),
    CONSTRAINT check_points_redeemed CHECK (total_points_redeemed >= 0)
);

-- New table: puntos_fidelidad_transactions (loyalty points transactions)
CREATE TABLE puntos_fidelidad_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    parking_session_id UUID REFERENCES parking_sessions(id),
    transaction_type VARCHAR(20) NOT NULL, -- EARN, REDEEM, EXPIRE, ADJUST
    points_amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_transaction_type CHECK (transaction_type IN ('EARN', 'REDEEM', 'EXPIRE', 'ADJUST'))
);

-- New table: descuentos (discounts)
CREATE TABLE descuentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parking_id UUID NOT NULL REFERENCES parkings(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FIXED_AMOUNT, FREE_HOURS
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_purchase DECIMAL(10, 2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT check_discount_type CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_HOURS')),
    CONSTRAINT check_discount_dates CHECK (end_date IS NULL OR end_date > start_date)
);

-- New table: parking_session_discounts (applied discounts)
CREATE TABLE parking_session_discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parking_session_id UUID NOT NULL REFERENCES parking_sessions(id),
    descuento_id UUID NOT NULL REFERENCES descuentos(id),
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tarifas_parking_vehicle ON tarifas(parking_id, vehicle_type_id);
CREATE INDEX idx_planes_especiales_parking ON planes_especiales(parking_id);
CREATE INDEX idx_user_planes_user ON user_planes(user_id);
CREATE INDEX idx_user_planes_status ON user_planes(status);
CREATE INDEX idx_reservas_user ON reservas(user_id);
CREATE INDEX idx_reservas_parking ON reservas(parking_id);
CREATE INDEX idx_reservas_status ON reservas(status);
CREATE INDEX idx_parking_sessions_user ON parking_sessions(user_id);
CREATE INDEX idx_parking_sessions_parking ON parking_sessions(parking_id);
CREATE INDEX idx_parking_sessions_entry_time ON parking_sessions(entry_time);
CREATE INDEX idx_puntos_fidelidad_user ON puntos_fidelidad(user_id);
CREATE INDEX idx_puntos_transactions_user ON puntos_fidelidad_transactions(user_id);
