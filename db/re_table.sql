--Delete Tables
DROP TABLE IF EXISTS Companies;
DROP TABLE IF EXISTS Policies;
DROP TABLE IF EXISTS Claims;
DROP TABLE IF EXISTS Underwriting;
DROP TABLE IF EXISTS Financials;
DROP TABLE IF EXISTS Risks;
DROP TABLE IF EXISTS Operations;
DROP TABLE IF EXISTS StockData;

SELECT "Table: Companies";
CREATE TABLE IF NOT EXISTS Companies (
	pk INTEGER PRIMARY KEY, 
	company_name VARCHAR(255),
	type VARCHAR(100)
);

SELECT 'Table: Policies';
CREATE TABLE Policies (
	pk INTEGER PRIMARY KEY,
	company_id INTEGER NOT NULL,
    coverage_amount DECIMAL(10, 2),
    region VARCHAR(50),
	FOREIGN KEY(company_id) REFERENCES Companies(pk)
);

SELECT 'Table: Claims';
CREATE TABLE Claims (
    pk INTEGER PRIMARY KEY,
	policy_id INTEGER NOT NULL,
    claim_amount DECIMAL(10, 2),
    claim_type VARCHAR(50),
	FOREIGN KEY(policy_id) REFERENCES Policies(pk)
);

SELECT 'Table: Underwriting';
CREATE TABLE Underwriting (
    pk INTEGER PRIMARY KEY,
	policy_id INTEGER,
    premium DECIMAL(10, 2),
    loss_ratio DECIMAL(5, 2),
    policyholder_type VARCHAR(50),
	FOREIGN KEY(policy_id) REFERENCES Policies(pk)
);

SELECT 'Table: Financials';
CREATE TABLE Financials (
    pk INTEGER PRIMARY KEY,
	company_id INTEGER,
	year INTEGER,
    total_assets DECIMAL(15, 2),
    total_liabilities DECIMAL(15, 2),
    net_income DECIMAL(15, 2),
	FOREIGN KEY(company_id) REFERENCES Companies(pk)
);

SELECT 'Table: Risks';
CREATE TABLE Risks (
    pk INTEGER PRIMARY KEY,
    risk_description TEXT
);

SELECT 'Table: Operations';
CREATE TABLE Operations (
    pk INTEGER PRIMARY KEY,
    company_id INTEGER,
	distribution_channel VARCHAR(50),
    customer_retention_rate DECIMAL(5, 2),
    market_share_rank INTEGER,
	FOREIGN KEY(company_id) REFERENCES Companies(pk)
);
	
SELECT 'Table: Stocks';
CREATE TABLE StockData( 
	pk INTEGER PRIMARY KEY,
	company_id INTEGER,
	date DATE,
	closePrice REAL,
	FOREIGN KEY(company_id) REFERENCES Companies(pk)
);
