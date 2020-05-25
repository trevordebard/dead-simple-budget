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

  // When a user is created, send JWT as cookie with the resolver
  // TODO: Check if duplicate user was created before sending back token
  // In other words, prevent duplicate email addresses, and handle case where signup is not successfull
  UserTC.wrapResolverResolve('createOne', next => async rp => {
    rp.beforeRecordMutate = async (doc, { context: { cookie } }) => {
      const token = jwt.sign({ userId: doc._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      cookie('token', token, {
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
  UserTC.addResolver({
    kind: 'query',
    name: 'me',
    type: UserTC.getResolver('findById').getType(),
    resolve: async payload => {
      const {
        context: { userId },
      } = payload;
      console.log(userId);
      if (userId) {
        return UserModel.findById({ _id: userId });
      }
      // TODO: Redirect to login page because user id was not passed through context, so it is probably not set in cookies
      throw new Error('No user found');
    },
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
      console.log(payload);
      const {
        args,
        context: { cookie },
      } = payload;
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
      cookie('token', token, {
        path: '/',
        // this cookie won't be readable by the browser
        httpOnly: true,
        // and won't be usable outside of my domain
        sameSite: 'strict',
      });
      return {
        recordId: user._id,
        record: {
          email: user.email,
          password: user.password,
        },
      };
    },
  });

  // const TransactionTC = composeWithMongoose(Transaction, {});
  schemaComposer.Query.addFields({
    userById: UserTC.getResolver('findById'),
    me: UserTC.getResolver('me'),
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
    transactionCreateOne: TransactionTC.getResolver('createOne'),
    userUpdateById: UserTC.getResolver('updateById'),
    userRemoveById: UserTC.getResolver('removeById'),
    budgetUpdateById: BudgetTC.getResolver('updateById'),
    userLogin: UserTC.getResolver('login', [authMiddleware]),
  });

  // TODO: Build this out to provide actual authentication
  async function authMiddleware(resolve, source, args, context, info) {
    const { cookie } = context;
    // the password is correct, set a cookie on the response
    cookie('session', 'hi', {
      path: '/',
      // this cookie won't be readable by the browser
      httpOnly: true,
      // and won't be usable outside of my domain
      sameSite: 'strict',
    });
    return resolve(source, args, context, info);
    throw new Error('You must be authorized');
  }
  async function hashPassword(resolve, source, args, context, info) {
    const { password } = args.record;
    console.log('password', password);
    const hashedPass = await bcrypt.hash(password, 10);

    args.record.password = hashedPass;
    return resolve(source, args, context, info);
  }
  schema = schemaComposer.buildSchema();
  return schema;
};

export { buildSchema };
