import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  toBeBudgeted: { type: Number, required: true },
  stacks: [{ label: { type: String, required: true }, value: { type: Number, required: true } }],
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true }, // TODO: Secure passwords
    budget: { type: BudgetSchema, required: true },
  },
  { toJSON: { virtuals: true } }
);

UserSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: '_userId',
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
