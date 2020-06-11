import mongoose from 'mongoose';
import { sumStacks } from '../lib/budgetUtils';

const BudgetSchema = new mongoose.Schema(
  {
    total: { type: Number, required: true },
    // toBeBudgeted: { type: Number, required: true },
    stacks: [{ label: { type: String, required: true }, value: { type: Number, required: true } }],
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
BudgetSchema.virtual('toBeBudgeted').get(function() {
  let moneyAllocated = 0;
  try {
    moneyAllocated = this.stacks.reduce(sumStacks, 0);
  } catch (e) {
    console.error('Unable to calculate to be budgeted');
    return null;
  }
  return this.total - moneyAllocated;
});
BudgetSchema.virtual('stackLabels').get(function() {
  const stackLabels = [];
  this.stacks.forEach(el => stackLabels.push(el.label));
  return stackLabels;
});
export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
