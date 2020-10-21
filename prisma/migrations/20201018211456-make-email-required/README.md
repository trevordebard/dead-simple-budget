# Migration `20201018211456-make-email-required`

This migration has been generated at 10/18/2020, 5:14:56 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."users" ALTER COLUMN "email" SET NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201008013634-remove-multiple-budgets-for-users..20201018211456-make-email-required
--- datamodel.dml
+++ datamodel.dml
@@ -1,11 +1,12 @@
 generator client {
-  provider = "prisma-client-js"
+  provider        = "prisma-client-js"
+  previewFeatures = ["atomicNumberOperations"]
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model budget {
   id           Int      @id @default(autoincrement())
@@ -72,9 +73,9 @@
 model user {
   id            Int       @id @default(autoincrement())
   name          String?
-  email         String?   @unique
+  email         String    @unique
   emailVerified DateTime? @map("email_verified")
   image         String?
   createdAt     DateTime  @default(now()) @map("created_at")
   updatedAt     DateTime  @default(now()) @map("updated_at")
```


