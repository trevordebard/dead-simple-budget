# Migration `20201004221005-lowercase-names-for-prisma-plugin-errors`

This migration has been generated at 10/4/2020, 6:10:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201004212937-init..20201004221005-lowercase-names-for-prisma-plugin-errors
--- datamodel.dml
+++ datamodel.dml
@@ -3,17 +3,17 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model budget {
   id           Int      @id @default(autoincrement())
   total        Float?   @default(0)
   toBeBudgeted Float?
   userId       Int
-  user         User     @relation(fields: [userId], references: [id])
+  user         user     @relation(fields: [userId], references: [id])
   stacks       stacks[]
 }
 model stacks {
@@ -34,13 +34,13 @@
   amount      Float
   type        String
   userId      Int
   date        DateTime
-  user        User     @relation(fields: [userId], references: [id])
+  user        user     @relation(fields: [userId], references: [id])
 }
-model Account {
+model account {
   id                 Int       @id @default(autoincrement())
   compoundId         String    @unique @map("compound_id")
   userId             Int       @map("user_id")
   providerType       String    @map("provider_type")
@@ -69,9 +69,9 @@
   @@map("sessions")
 }
-model User {
+model user {
   id            Int       @id @default(autoincrement())
   name          String?
   email         String?   @unique
   emailVerified DateTime? @map("email_verified")
@@ -79,10 +79,10 @@
   createdAt     DateTime  @default(now()) @map("created_at")
   updatedAt     DateTime  @default(now()) @map("updated_at")
   transactions transactions[]
+  budget       budget[]
   @@map("users")
-  budget budget[]
 }
 model VerificationRequest {
   id         Int      @id @default(autoincrement())
```


