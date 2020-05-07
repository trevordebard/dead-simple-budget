import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  toBeBudgeted: { type: Number, required: true },
  stacks: [{ label: { type: String, required: true }, value: { type: Number, required: true } }],
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});
export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
