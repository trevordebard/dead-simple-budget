import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

UserSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: '_userId',
});
UserSchema.virtual('budget', {
  ref: 'Budget',
  localField: '_id',
  foreignField: '_userId',
  justOne: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
