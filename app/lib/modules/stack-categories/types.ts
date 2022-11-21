import { Stack, StackCategory } from '@prisma/client';

export type tCategorizedStacks = (StackCategory & {
  Stack: Stack[];
})[];
