---
name: synscale-database-design
description: Design and create PostgreSQL database schema for SynScale, including tables for Arks, assets, rights, projects, and consumption logs. Generates SQL migration files and ORM models.
invocation: Use when user mentions "database", "schema", "tables", "create database", "design database"
fork: subagent
---

# SynScale Database Design Skill

## Purpose
Automatically design and create the complete database schema for SynScale, including all tables, indexes, relationships, and TimescaleDB hypertables.

## Core Tables

### 1. Arks Table
Primary storage for user/organization wallets.

```sql
CREATE TABLE arks (
    ark_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    parent_ark_id UUID REFERENCES arks(ark_id),
    ark_type VARCHAR(50) DEFAULT 'personal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);
```

### 2. Asset Ledger Table
Multi-dimensional asset accounting.

```sql
CREATE TABLE asset_ledger (
    ledger_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ark_id UUID REFERENCES arks(ark_id),
    asset_sku VARCHAR(100) NOT NULL,
    balance DECIMAL(20, 4) NOT NULL DEFAULT 0,
    source_provider VARCHAR(100),
    rights_rules JSONB[],
    expire_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Rights Templates Table
Reusable smart rights rules.

```sql
CREATE TABLE rights_templates (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_type VARCHAR(50) NOT NULL,
    rule_name VARCHAR(200),
    rule_logic JSONB NOT NULL,
    created_by UUID,
    is_active BOOLEAN DEFAULT true
);
```

### 4. Projects Table
Application projects consuming resources.

```sql
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(200) NOT NULL,
    owner_ark_id UUID REFERENCES arks(ark_id),
    github_repo VARCHAR(500),
    is_active BOOLEAN DEFAULT true
);
```

### 5. Consumption Logs (TimescaleDB)
Time-series consumption tracking.

```sql
CREATE TABLE consumption_logs (
    log_id UUID DEFAULT uuid_generate_v4(),
    ark_id UUID REFERENCES arks(ark_id),
    project_id UUID REFERENCES projects(project_id),
    asset_sku VARCHAR(100),
    amount DECIMAL(20, 4),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

SELECT create_hypertable('consumption_logs', 'timestamp');
```

## Instructions

When user requests database schema:

1. **Check Environment**
   - Verify PostgreSQL is running (Docker or local)
   - Check if database exists
   - Confirm TimescaleDB extension available

2. **Create Migration File**
   Create `infra/docker/migrations/001_initial_schema.sql` with:
   - UUID extension
   - All table definitions
   - Indexes
   - Foreign keys
   - TimescaleDB hypertable

3. **Create ORM Models**

   **For TypeScript (Prisma)**:
   Create `packages/shared-types/prisma/schema.prisma`:
   ```prisma
   model Ark {
     arkId String @id @default(uuid())
     ownerId String
     parentArkId String?
     arkType String @default("personal")
     createdAt DateTime @default(now())
     metadata Json @default("{}")
   }
   ```

   **For Python (SQLAlchemy)**:
   Create `services/ai-proxy/app/models.py`:
   ```python
   from sqlalchemy import Column, String, DECIMAL, TIMESTAMP
   from sqlalchemy.dialects.postgresql import UUID, JSONB

   class Ark(Base):
       __tablename__ = "arks"
       ark_id = Column(UUID(as_uuid=True), primary_key=True)
       owner_id = Column(UUID(as_uuid=True), nullable=False)
       # ...
   ```

4. **Generate Indexes**
   ```sql
   CREATE INDEX idx_arks_owner ON arks(owner_id);
   CREATE INDEX idx_ledger_ark ON asset_ledger(ark_id);
   CREATE INDEX idx_ledger_sku ON asset_ledger(asset_sku);
   CREATE INDEX idx_projects_owner ON projects(owner_ark_id);
   ```

5. **Create Sample Data** (optional)
   Generate INSERT statements for testing:
   ```sql
   INSERT INTO arks (owner_id, ark_type) VALUES
     ('user-1', 'personal'),
     ('user-2', 'team');
   ```

6. **Run Migration**
   If Docker is running:
   ```bash
   psql -h localhost -U synscale -d synscale_dev -f infra/docker/migrations/001_initial_schema.sql
   ```

7. **Verify Schema**
   ```sql
   \dt -- List tables
   \d arks -- Describe arks table
   SELECT * FROM timescaledb_information.hypertables; -- Check hypertables
   ```

## Example Usage

**User**: "Create the database schema for SynScale"

**Expected Actions**:
1. Create migration SQL file
2. Generate ORM models (Prisma + SQLAlchemy)
3. Add indexes and constraints
4. Run migration if database is available
5. Show table structure

**User**: "Add a new table for user preferences"

**Expected Actions**:
1. Create new migration file (002_add_user_preferences.sql)
2. Add corresponding ORM model
3. Update existing models if needed

## Safety Checks

- Never drop tables without explicit user confirmation
- Always create migration files (don't execute SQL directly)
- Backup database before running migrations
- Use transactions for all schema changes

## Success Criteria

- All tables created successfully
- Indexes applied
- TimescaleDB hypertable configured
- Foreign key constraints working
- ORM models generated and synced

## Follow-up Suggestions

After schema creation:
1. "Would you like me to seed the database with test data?"
2. "Should I create the API endpoints for these tables?"
3. "Ready to implement the rights evaluation logic?"

## Advanced Features

### Database Seeding
Create realistic test data:
```sql
-- 10 test Arks
-- 50 asset ledger entries
-- 5 rights templates
-- 20 projects
```

### Migration Management
- Track migration versions
- Support rollback
- Handle schema evolution

### Performance Optimization
- Partition large tables
- Add materialized views for analytics
- Configure TimescaleDB compression
