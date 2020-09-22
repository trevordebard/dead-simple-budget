# Migration `20200922022857-add-stack-timestamp`

This migration has been generated at 9/21/2020, 10:28:57 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."stacks" ADD COLUMN "created_at" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP

ALTER INDEX "public"."user_email_key" RENAME TO "user.email_unique"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200922022857-add-stack-timestamp
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,47 @@
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
+  id           Int      @default(autoincrement()) @id
+  total        Float?   @default(dbgenerated())
+  toBeBudgeted Float?
+  userId       Int?
+  user         user?    @relation(fields: [userId], references: [id])
+  stacks       stacks[]
+}
+
+model stacks {
+  id         Int      @default(autoincrement()) @id
+  budgetId   Int
+  label      String
+  amount     Float    @default(dbgenerated())
+  budget     budget   @relation(fields: [budgetId], references: [id])
+  created_at DateTime @default(now())
+  @@unique([budgetId, label], name: "budgetId_label_idx")
+}
+
+model transactions {
+  id          Int      @default(autoincrement()) @id
+  description String
+  stack       String
+  amount      Float
+  type        String
+  userId      Int
+  date        DateTime
+  user        user     @relation(fields: [userId], references: [id])
+}
+
+model user {
+  id           Int            @default(autoincrement()) @id
+  email        String         @unique
+  password     String
+  created_at   DateTime?      @default(now())
+  budget       budget[]
+  transactions transactions[]
+}
```


