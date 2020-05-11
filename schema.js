import composeWithMongoose from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import TransactionModel from './models/TransactionModel';
import UserModel from './models/UserModel';

let schema = {};
const buildSchema = async () => {
  // Check if schema has been built
  if (schemaComposer.has('User')) {
    console.log('Schema exists');
    return schemaComposer.buildSchema();
  }
  console.log('Building schema');
  const UserTC = composeWithMongoose(UserModel, {});
  const TransactionTC = composeWithMongoose(TransactionModel, {});
  UserTC.addRelation('transactions', {
    resolver: () => TransactionTC.getResolver('findMany'),
    prepareArgs: {
      _userId: source => source._id || [],
    },
    projection: {
      transactions: true,
    },
  });

  // const TransactionTC = composeWithMongoose(Transaction, {});
  schemaComposer.Query.addFields({
    userById: UserTC.getResolver('findById'),
    userOne: UserTC.getResolver('findOne'),
    userPagination: UserTC.getResolver('pagination'),
    transactionById: TransactionTC.getResolver('findById'),
    transactionOne: TransactionTC.getResolver('findOne'),
    transactionMany: TransactionTC.getResolver('findMany'),
    transactionCount: TransactionTC.getResolver('count'),
    transactionPagination: TransactionTC.getResolver('pagination'),
  });

  schemaComposer.Mutation.addFields({
    userCreateOne: UserTC.getResolver('createOne'),
    userCreateMany: UserTC.getResolver('createMany'),
    userUpdateById: UserTC.getResolver('updateById'),
    userUpdateOne: UserTC.getResolver('updateOne'),
    userUpdateMany: UserTC.getResolver('updateMany'),
    userRemoveById: UserTC.getResolver('removeById'),
    userRemoveOne: UserTC.getResolver('removeOne'),
    userRemoveMany: UserTC.getResolver('removeMany'),
  });
  schema = schemaComposer.buildSchema();
  return schema;
};
export default { buildSchema };
