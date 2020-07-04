import composeWithMongoose from 'graphql-compose-mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
  // Make _userId optional so that mutation will not fail immediately if graphql query does not include value
  // Value will be retrieved from context in resolver
  // Mongoose still will require _userId, thus query will fail if user is not logged in
  TransactionTC.getResolver('createOne')
    .getArgTC('record')
    .makeOptional(['_userId']);
  TransactionTC.wrapResolverResolve('createOne', next => async rp => {
    rp.beforeRecordMutate = async (doc, { context }) => {
      doc._userId = context.userId;
      return doc;
    };
    return next(rp);
  });

  UserTC.addRelation('transactions', {
    resolver: () => TransactionTC.getResolver('findMany'),
    prepareArgs: {
      filter: source => ({
        _userId: source.id,
      }),
    },
    projection: {
      transactions: true,
    },
  });
  UserTC.addRelation('budget', {
    resolver: () => BudgetTC.getResolver('findOne'),
    prepareArgs: {
      filter: source => ({
        _userId: source.id,
      }),
    },
    projection: {
      budget: true,
    },
  });

  // When a user is created, send JWT as cookie with the resolver
  // TODO: Check if duplicate user was created before sending back token
  // In other words, prevent duplicate email addresses, and handle case where signup is not successfull
  UserTC.wrapResolverResolve('createOne', next => async rp => {
    rp.beforeRecordMutate = async (doc, { context }) => {
      const token = jwt.sign({ userId: doc._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      context.res.cookie('token', token, {
        path: '/',
        // this cookie won't be readable by the browser
        httpOnly: true,
        // and won't be usable outside of my domain
        sameSite: 'strict',
      });
      return doc;
    };
    return next(rp);
  });
  BudgetTC.addFields({
    toBeBudgeted: {
      type: 'Float',
    },
    stackLabels: {
      type: '[String]',
    },
  });
  BudgetTC.addResolver({
    name: 'updateStack',
    type: BudgetTC,
    kind: 'mutation',
    args: { budgetId: 'MongoID!', label: 'String!', value: 'Float!' },
    resolve: async ({ args }) => {
      const user = await BudgetModel.update(
        { _id: args.budgetId, 'stacks.label': args.label },
        { $set: { 'stacks.$.value': args.value } }
      );
      if (!user) return null; // or gracefully return an error etc...
      return BudgetModel.findOne({ _id: args.budgetId }); // return the record
    },
  });
  BudgetTC.addResolver({
    name: 'pushToStacks',
    type: BudgetTC,
    kind: 'mutation',
    args: { budgetId: 'MongoID!', newStackLabel: 'String!', newStackValue: 'Float' },
    resolve: async ({ args }) => {
      const user = await BudgetModel.update(
        { _id: args.budgetId },
        { $push: { stacks: { label: args.newStackLabel, value: args.newStackValue || 0 } } }
      );
      if (!user) return null; // or gracefully return an error etc...
      return BudgetModel.findOne({ _id: args.budgetId }); // return the record
    },
  });

  BudgetTC.addResolver({
    name: 'removeStack',
    type: BudgetTC,
    kind: 'mutation',
    args: { budgetId: 'MongoID!', label: 'String!' },
    resolve: async ({ args }) => {
      const user = await BudgetModel.update({ _id: args.budgetId }, { $pull: { stacks: { label: args.label } } });
      if (!user) return null; // or gracefully return an error etc...
      return BudgetModel.findOne({ _id: args.budgetId }); // return the record
    },
  });

  UserTC.addResolver({
    kind: 'query',
    name: 'me',
    type: UserTC.getResolver('findById').getType(),
    resolve: async payload => {
      const {
        context: { userId },
      } = payload;
      if (userId) {
        return UserModel.findById({ _id: userId });
      }
      // TODO: Redirect to login page because user id was not passed through context, so it is probably not set in cookies
      throw new Error('No user found');
    },
  });

  UserTC.addResolver({
    kind: 'mutation',
    name: 'logout',
    type: UserTC.getResolver('updateById').getType(),
    resolve: ({ context }) =>
      context.res.cookie('token', '', {
        path: '/',
        // this cookie won't be readable by the browser
        httpOnly: true,
        // and won't be usable outside of my domain
        sameSite: 'strict',
      }),
  });

  UserTC.addResolver({
    kind: 'mutation',
    name: 'login',
    args: {
      email: 'String!',
      password: 'String!',
    },
    type: UserTC.getResolver('updateById').getType(),
    resolve: async payload => {
      const { args, context } = payload;
      let user = null;
      user = await UserModel.findOne({ email: args.email });
      if (!user) {
        throw new Error('User does not exist.');
      }
      const passwordMatches = await bcrypt.compare(args.password, user.password);
      if (!passwordMatches) {
        throw new Error('User not found!');
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      context.res.cookie('token', token, {
        path: '/',
        // this cookie won't be readable by the browser
        httpOnly: true,
        // and won't be usable outside of my domain
        sameSite: 'strict',
      });
      return {
        recordId: user._id,
        record: {
          ...user,
        },
      };
    },
  });

  // const TransactionTC = composeWithMongoose(Transaction, {});
  schemaComposer.Query.addFields({
    userById: UserTC.getResolver('findById'),
    me: UserTC.getResolver('me', [authMiddleware]),
    userOne: UserTC.getResolver('findOne', [authMiddleware]),
    userPagination: UserTC.getResolver('pagination'),
    transactionById: TransactionTC.getResolver('findById'),
    transactionOne: TransactionTC.getResolver('findOne'),
    transactionMany: TransactionTC.getResolver('findMany'),
    transactionPagination: TransactionTC.getResolver('pagination'),
    budgetById: BudgetTC.getResolver('findById'),
    budgetOne: BudgetTC.getResolver('findOne'),
    budgetPagination: BudgetTC.getResolver('pagination'),
  });

  schemaComposer.Mutation.addFields({
    userCreateOne: UserTC.getResolver('createOne', [authMiddleware, hashPassword]),
    budgetCreateOne: BudgetTC.getResolver('createOne'),
    transactionCreateOne: TransactionTC.getResolver('createOne', [authMiddleware]),
    transactionUpdateById: TransactionTC.getResolver('updateById', [authMiddleware]),
    userUpdateById: UserTC.getResolver('updateById'),
    userRemoveById: UserTC.getResolver('removeById'),
    budgetUpdateById: BudgetTC.getResolver('updateById'),
    userLogin: UserTC.getResolver('login'),
    userLogout: UserTC.getResolver('logout'),
    budgetUpdateStack: BudgetTC.getResolver('updateStack'),
    budgetPushToStacks: BudgetTC.getResolver('pushToStacks'),
    budgetRemoveStack: BudgetTC.getResolver('removeStack'),
  });

  async function authMiddleware(resolve, source, args, context, info) {
    const { token } = context.req.cookies;
    if (token) {
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        context.userId = data.userId;
      } catch (e) {
        console.error('USER ATTEMPTED TO SUPPLY INVALID TOKEN');
        throw new Error('USER ATTEMPTED TO SUPPLY INVALID TOKEN');
      }
    } else {
      throw new Error('No token provided');
    }
    return resolve(source, args, context, info);
  }
  async function hashPassword(resolve, source, args, context, info) {
    const { password } = args.record;
    const hashedPass = await bcrypt.hash(password, 10);

    args.record.password = hashedPass;
    return resolve(source, args, context, info);
  }
  schema = schemaComposer.buildSchema();
  return schema;
};

export { buildSchema };
