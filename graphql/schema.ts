import { schema, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';

use(prisma({ features: { crud: true } }));

schema.objectType({
  name: "user",
  definition(t) {
    t.model.id();
    t.model.created_at();
    t.model.email();
    t.model.password();
    t.model.budget();
    t.model.transactions();
  }
})

schema.objectType({
  name: "budget",
  definition(t) {
    t.model.id()
    t.model.toBeBudgeted()
    t.model.total()
    t.model.userId()
  }
})
schema.objectType({
  name: "transactions",
  definition(t) {
    t.model.amount()
    t.model.description()
    t.model.id()
    t.model.stack()
    t.model.type()
    t.model.userId()
  }
})

schema.queryType({
  definition(t) {
    t.crud.user();
    t.crud.budget();
    t.crud.transactions();
    t.crud.users();
    t.crud.budgets();
  }
})
