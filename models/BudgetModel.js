import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  total: Number,
  toBeBudgeted: Number,
  stack: [{ label: String, value: Number }],
  transactions: [{ description: String, stack: String, date: Date, amount: Number }],
});
export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
