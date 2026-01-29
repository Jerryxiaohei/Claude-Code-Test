-- SynScale Database Initialization Script
-- This script will be executed when PostgreSQL container starts for the first time

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS core;       -- Core tables (Arks, Assets, Rights)
CREATE SCHEMA IF NOT EXISTS metrics;    -- Time-series metrics
CREATE SCHEMA IF NOT EXISTS audit;      -- Audit logs

-- Set search path
SET search_path TO core, public;

-- Create enum types
CREATE TYPE ark_type AS ENUM ('personal', 'team', 'distributor');
CREATE TYPE asset_category AS ENUM ('compute', 'intelligence', 'data');
CREATE TYPE rights_type AS ENUM ('time-fuse', 'decay', 'pow', 'credit-delegation', 'project-binding');
CREATE TYPE transaction_type AS ENUM ('inflow', 'outflow', 'transfer');

-- Grant permissions
GRANT USAGE ON SCHEMA core TO synscale;
GRANT USAGE ON SCHEMA metrics TO synscale;
GRANT USAGE ON SCHEMA audit TO synscale;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core TO synscale;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA metrics TO synscale;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO synscale;

-- Welcome message
DO $$
BEGIN
    RAISE NOTICE 'SynScale Database Initialized Successfully!';
    RAISE NOTICE 'Database: synscale_dev';
    RAISE NOTICE 'User: synscale';
    RAISE NOTICE 'Extensions: timescaledb, uuid-ossp';
    RAISE NOTICE 'Schemas: core, metrics, audit';
END $$;
