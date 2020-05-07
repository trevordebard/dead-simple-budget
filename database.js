import mongoose from 'mongoose';
// Register models in case they have not been registered
// import './models/UserModel';
import './models/TransactionModel';
// import './models/BudgetModel';
import Budget from './models/BudgetModel';
import User from './models/UserModel';

console.log('db');
const connection = {};

const connect = async () => {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.isConnected = db.connections[0].readyState;

  // const bud = {
  //   total: 5000,
  //   toBeBudgeted: 4900,
  //   stacks: [{ label: 'Rent', value: 100 }],
  //   _userId: '5eaf5db927c42a6f3714db5d',
  // };
  // console.log(await Budget.create(bud));
};
export default connect;
