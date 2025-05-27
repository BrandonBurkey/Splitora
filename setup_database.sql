-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create SubscriptionGroup table
CREATE TABLE IF NOT EXISTS "SubscriptionGroup" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "maxMembers" INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'active',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "hostId" TEXT NOT NULL REFERENCES "User"(id),
    "remainingSpaces" INTEGER DEFAULT 0,
    location TEXT NOT NULL
);

-- Create SubscriptionMember table
CREATE TABLE IF NOT EXISTS "SubscriptionMember" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"(id),
    "groupId" TEXT NOT NULL REFERENCES "SubscriptionGroup"(id),
    share DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'active',
    "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "groupId")
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
    id TEXT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL REFERENCES "User"(id),
    "groupId" TEXT NOT NULL REFERENCES "SubscriptionGroup"(id)
);

-- Create Activity table
CREATE TABLE IF NOT EXISTS "Activity" (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL REFERENCES "User"(id),
    "groupId" TEXT REFERENCES "SubscriptionGroup"(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscription_group_host ON "SubscriptionGroup"("hostId");
CREATE INDEX IF NOT EXISTS idx_subscription_member_user ON "SubscriptionMember"("userId");
CREATE INDEX IF NOT EXISTS idx_subscription_member_group ON "SubscriptionMember"("groupId");
CREATE INDEX IF NOT EXISTS idx_payment_user ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS idx_payment_group ON "Payment"("groupId");
CREATE INDEX IF NOT EXISTS idx_activity_user ON "Activity"("userId");
CREATE INDEX IF NOT EXISTS idx_activity_group ON "Activity"("groupId");

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_group_updated_at
    BEFORE UPDATE ON "SubscriptionGroup"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at
    BEFORE UPDATE ON "Payment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 