import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
  first?: boolean
  last?: boolean
  before?: boolean
  after?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime'

// Prisma model type definitions
interface PrismaModels {
  budget: Prisma.budget
  stacks: Prisma.stacks
  transactions: Prisma.transactions
  user: Prisma.user
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    budgets: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'total' | 'toBeBudgeted' | 'userId' | 'user' | 'stacks'
      ordering: 'id' | 'total' | 'toBeBudgeted' | 'userId'
    }
    stacks: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'budgetId' | 'label' | 'amount' | 'budget' | 'created_at'
      ordering: 'id' | 'budgetId' | 'label' | 'amount' | 'created_at'
    }
    transactions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'description' | 'stack' | 'amount' | 'type' | 'userId' | 'date' | 'user'
      ordering: 'id' | 'description' | 'stack' | 'amount' | 'type' | 'userId' | 'date'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'email' | 'password' | 'created_at' | 'budget' | 'transactions'
      ordering: 'id' | 'email' | 'password' | 'created_at'
    }
  },
  budget: {
    stacks: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'budgetId' | 'label' | 'amount' | 'budget' | 'created_at'
      ordering: 'id' | 'budgetId' | 'label' | 'amount' | 'created_at'
    }
  }
  stacks: {

  }
  transactions: {

  }
  user: {
    budget: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'total' | 'toBeBudgeted' | 'userId' | 'user' | 'stacks'
      ordering: 'id' | 'total' | 'toBeBudgeted' | 'userId'
    }
    transactions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'description' | 'stack' | 'amount' | 'type' | 'userId' | 'date' | 'user'
      ordering: 'id' | 'description' | 'stack' | 'amount' | 'type' | 'userId' | 'date'
    }
  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    budget: 'budget'
    budgets: 'budget'
    stacks: 'stacks'
    stacks: 'stacks'
    transactions: 'transactions'
    transactions: 'transactions'
    user: 'user'
    users: 'user'
  },
  Mutation: {
    createOnebudget: 'budget'
    updateOnebudget: 'budget'
    updateManybudget: 'BatchPayload'
    deleteOnebudget: 'budget'
    deleteManybudget: 'BatchPayload'
    upsertOnebudget: 'budget'
    createOnestacks: 'stacks'
    updateOnestacks: 'stacks'
    updateManystacks: 'BatchPayload'
    deleteOnestacks: 'stacks'
    deleteManystacks: 'BatchPayload'
    upsertOnestacks: 'stacks'
    createOnetransactions: 'transactions'
    updateOnetransactions: 'transactions'
    updateManytransactions: 'BatchPayload'
    deleteOnetransactions: 'transactions'
    deleteManytransactions: 'BatchPayload'
    upsertOnetransactions: 'transactions'
    createOneuser: 'user'
    updateOneuser: 'user'
    updateManyuser: 'BatchPayload'
    deleteOneuser: 'user'
    deleteManyuser: 'BatchPayload'
    upsertOneuser: 'user'
  },
  budget: {
    id: 'Int'
    total: 'Float'
    toBeBudgeted: 'Float'
    userId: 'Int'
    user: 'user'
    stacks: 'stacks'
  }
  stacks: {
    id: 'Int'
    budgetId: 'Int'
    label: 'String'
    amount: 'Float'
    budget: 'budget'
    created_at: 'DateTime'
  }
  transactions: {
    id: 'Int'
    description: 'String'
    stack: 'String'
    amount: 'Float'
    type: 'String'
    userId: 'Int'
    date: 'DateTime'
    user: 'user'
  }
  user: {
    id: 'Int'
    email: 'String'
    password: 'String'
    created_at: 'DateTime'
    budget: 'budget'
    transactions: 'transactions'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  budget: Typegen.NexusPrismaFields<'budget'>
  stacks: Typegen.NexusPrismaFields<'stacks'>
  transactions: Typegen.NexusPrismaFields<'transactions'>
  user: Typegen.NexusPrismaFields<'user'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  