import { Budget, User } from ".prisma/client";

export type AuthenticatedUser = (User & {
  Budget: Budget;
})