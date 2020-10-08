# Migration `20201008013634-remove-multiple-budgets-for-users`

This migration has been generated at 10/7/2020, 9:36:34 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE UNIQUE INDEX "budget_userId_unique" ON "public"."budget"("userId")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201004221005-lowercase-names-for-prisma-plugin-errors..20201008013634-remove-multiple-budgets-for-users
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model budget {
   id           Int      @id @default(autoincrement())
@@ -79,9 +79,9 @@
   createdAt     DateTime  @default(now()) @map("created_at")
   updatedAt     DateTime  @default(now()) @map("updated_at")
   transactions transactions[]
-  budget       budget[]
+  budget       budget
   @@map("users")
 }
 model VerificationRequest {
```


