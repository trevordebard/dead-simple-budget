import mongoose from 'mongoose';
// Register models in case they have not been registered
import './models/UserModel';
import './models/TransactionModel';

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
};
export default connect;
