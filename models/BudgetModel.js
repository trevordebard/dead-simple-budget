import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  stack: { type: String, required: true },
  date: Date,
  amount: { type: Number, required: true },
});

const BudgetSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  toBeBudgeted: { type: Number, required: true },
  stacks: [{ label: { type: String, required: true }, value: { type: Number, required: true } }],
  transactions: {
    required: true,
    validate: [value => value.length > 0, 'Transactions array cannot be empty'],
    type: [TransactionSchema],
  },
});
export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
