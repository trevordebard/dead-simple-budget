import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  stack: { type: String, required: true },
  date: Date,
  amount: { type: Number, required: true },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
