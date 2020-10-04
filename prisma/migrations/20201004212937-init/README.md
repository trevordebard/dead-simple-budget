# Migration `20201004212937-init`

This migration has been generated at 10/4/2020, 5:29:37 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."budget" (
"id" SERIAL,
"total" Decimal(65,30)   DEFAULT 0,
"toBeBudgeted" Decimal(65,30)   ,
"userId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."stacks" (
"id" SERIAL,
"budgetId" integer   NOT NULL ,
"label" text   NOT NULL ,
"amount" Decimal(65,30)   NOT NULL DEFAULT 0,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."transactions" (
"id" SERIAL,
"description" text   NOT NULL ,
"stack" text   NOT NULL ,
"amount" Decimal(65,30)   NOT NULL ,
"type" text   NOT NULL ,
"userId" integer   NOT NULL ,
"date" timestamp(3)   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."accounts" (
"id" SERIAL,
"compound_id" text   NOT NULL ,
"user_id" integer   NOT NULL ,
"provider_type" text   NOT NULL ,
"provider_id" text   NOT NULL ,
"provider_account_id" text   NOT NULL ,
"refresh_token" text   ,
"access_token" text   ,
"access_token_expires" timestamp(3)   ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."sessions" (
"id" SERIAL,
"user_id" integer   NOT NULL ,
"expires" timestamp(3)   NOT NULL ,
"session_token" text   NOT NULL ,
"access_token" text   NOT NULL ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."users" (
"id" SERIAL,
"name" text   ,
"email" text   ,
"email_verified" timestamp(3)   ,
"image" text   ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."verification_requests" (
"id" SERIAL,
"identifier" text   NOT NULL ,
"token" text   NOT NULL ,
"expires" timestamp(3)   NOT NULL ,
"created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updated_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "budgetId_label_idx" ON "public"."stacks"("budgetId", "label")

CREATE UNIQUE INDEX "accounts.compound_id_unique" ON "public"."accounts"("compound_id")

CREATE INDEX "providerAccountId" ON "public"."accounts"("provider_account_id")

CREATE INDEX "providerId" ON "public"."accounts"("provider_id")

CREATE INDEX "userId" ON "public"."accounts"("user_id")

CREATE UNIQUE INDEX "sessions.session_token_unique" ON "public"."sessions"("session_token")

CREATE UNIQUE INDEX "sessions.access_token_unique" ON "public"."sessions"("access_token")

CREATE UNIQUE INDEX "users.email_unique" ON "public"."users"("email")

CREATE UNIQUE INDEX "verification_requests.token_unique" ON "public"."verification_requests"("token")

ALTER TABLE "public"."budget" ADD FOREIGN KEY ("userId")REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."stacks" ADD FOREIGN KEY ("budgetId")REFERENCES "public"."budget"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."transactions" ADD FOREIGN KEY ("userId")REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201004212937-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,96 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model budget {
+  id           Int      @id @default(autoincrement())
+  total        Float?   @default(0)
+  toBeBudgeted Float?
+  userId       Int
+  user         User     @relation(fields: [userId], references: [id])
+  stacks       stacks[]
+}
+
+model stacks {
+  id         Int      @id @default(autoincrement())
+  budgetId   Int
+  label      String
+  amount     Float    @default(0)
+  created_at DateTime @default(now())
+  budget     budget   @relation(fields: [budgetId], references: [id])
+
+  @@unique([budgetId, label], name: "budgetId_label_idx")
+}
+
+model transactions {
+  id          Int      @id @default(autoincrement())
+  description String
+  stack       String
+  amount      Float
+  type        String
+  userId      Int
+  date        DateTime
+  user        User     @relation(fields: [userId], references: [id])
+
+}
+
+model Account {
+  id                 Int       @id @default(autoincrement())
+  compoundId         String    @unique @map("compound_id")
+  userId             Int       @map("user_id")
+  providerType       String    @map("provider_type")
+  providerId         String    @map("provider_id")
+  providerAccountId  String    @map("provider_account_id")
+  refreshToken       String?   @map("refresh_token")
+  accessToken        String?   @map("access_token")
+  accessTokenExpires DateTime? @map("access_token_expires")
+  createdAt          DateTime  @default(now()) @map("created_at")
+  updatedAt          DateTime  @default(now()) @map("updated_at")
+
+  @@index([providerAccountId], name: "providerAccountId")
+  @@index([providerId], name: "providerId")
+  @@index([userId], name: "userId")
+  @@map("accounts")
+}
+
+model Session {
+  id           Int      @id @default(autoincrement())
+  userId       Int      @map("user_id")
+  expires      DateTime
+  sessionToken String   @unique @map("session_token")
+  accessToken  String   @unique @map("access_token")
+  createdAt    DateTime @default(now()) @map("created_at")
+  updatedAt    DateTime @default(now()) @map("updated_at")
+
+  @@map("sessions")
+}
+
+model User {
+  id            Int       @id @default(autoincrement())
+  name          String?
+  email         String?   @unique
+  emailVerified DateTime? @map("email_verified")
+  image         String?
+  createdAt     DateTime  @default(now()) @map("created_at")
+  updatedAt     DateTime  @default(now()) @map("updated_at")
+
+  transactions transactions[]
+  @@map("users")
+  budget budget[]
+}
+
+model VerificationRequest {
+  id         Int      @id @default(autoincrement())
+  identifier String
+  token      String   @unique
+  expires    DateTime
+  createdAt  DateTime @default(now()) @map("created_at")
+  updatedAt  DateTime @default(now()) @map("updated_at")
+
+  @@map("verification_requests")
+}
```


