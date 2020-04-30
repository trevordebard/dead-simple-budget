import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  total: Number,
  toBeBudgeted: Number,
  budget: [{ category: String, value: Number }],
  transactions: [{ label: String, category: String, date: Date, amount: Number }],
});
export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
