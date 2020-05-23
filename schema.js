import composeWithMongoose from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import TransactionModel from './models/TransactionModel';
import UserModel from './models/UserModel';
import BudgetModel from './models/BudgetModel';

const buildSchema = () => {
  let schema = {};
  // Check if schema has been built
  if (schemaComposer.has('User')) {
    console.log('Schema exists');
    return schemaComposer.buildSchema();
  }
  console.log('Building schema');
  const UserTC = composeWithMongoose(UserModel, {});
  const TransactionTC = composeWithMongoose(TransactionModel, {});
  const BudgetTC = composeWithMongoose(BudgetModel, {});
  UserTC.addRelation('transactions', {
    resolver: () => TransactionTC.getResolver('findMany'),
    prepareArgs: {
      _userId: source => source._id || [],
    },
    projection: {
      transactions: true,
    },
  });
  UserTC.addRelation('budget', {
    resolver: () => BudgetTC.getResolver('findOne'),
    prepareArgs: {
      _userId: source => source._id || [],
    },
    projection: {
      budget: true,
    },
  });

  // const TransactionTC = composeWithMongoose(Transaction, {});
  schemaComposer.Query.addFields({
    userById: UserTC.getResolver('findById'),
    userOne: UserTC.getResolver('findOne', [authMiddleware]),
    userPagination: UserTC.getResolver('pagination'),
    transactionById: TransactionTC.getResolver('findById'),
    transactionOne: TransactionTC.getResolver('findOne'),
    transactionMany: TransactionTC.getResolver('findMany', [authMiddleware]),
    transactionCount: TransactionTC.getResolver('count'),
    transactionPagination: TransactionTC.getResolver('pagination'),
    budgetById: BudgetTC.getResolver('findById'),
    budgetOne: BudgetTC.getResolver('findOne'),
    budgetMany: BudgetTC.getResolver('findMany'),
    budgetCount: BudgetTC.getResolver('count'),
    budgetPagination: BudgetTC.getResolver('pagination'),
  });

  schemaComposer.Mutation.addFields({
    userCreateOne: UserTC.getResolver('createOne'),
    budgetCreateOne: BudgetTC.getResolver('createOne'),
    transactionCreateOne: TransactionTC.getResolver('createOne'),
    userCreateMany: UserTC.getResolver('createMany'),
    userUpdateById: UserTC.getResolver('updateById'),
    userUpdateOne: UserTC.getResolver('updateOne'),
    userUpdateMany: UserTC.getResolver('updateMany'),
    userRemoveById: UserTC.getResolver('removeById'),
    userRemoveOne: UserTC.getResolver('removeOne'),
    userRemoveMany: UserTC.getResolver('removeMany'),
    budgetUpdateById: BudgetTC.getResolver('updateById'),
  });
  async function authMiddleware(resolve, source, args, context, info) {
    const { cookie } = context;
    console.log(context);
    // the password is correct, set a cookie on the response
    cookie('session', 'yellow', {
      // cookie is valid for all subpaths of my domain
      path: '/',
      // this cookie won't be readable by the browser
      httpOnly: true,
      // and won't be usable outside of my domain
      sameSite: 'strict',
    });
    return resolve(source, args, context, info);
    throw new Error('You must be authorized');
  }
  schema = schemaComposer.buildSchema();
  return schema;
};

export { buildSchema };
