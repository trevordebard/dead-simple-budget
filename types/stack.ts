import { Stack } from '.prisma/client';

export interface iCreateStackInput {
  label: string;
  amount?: number;
}

export interface iUpdateStackInput {
  id: number;
  label: string;
  stackCategoryId?: number;
  amount?: number;
}

export interface iGetStacksOptions {
  organizeBy?: 'category';
}

export interface iCategorizedStack {
  id: number;
  category: string;
  stacks: Stack[];
}

export interface iUpdateStackCategoryInput {
  id: number;
  category?: string;
  stackOrder?: number[];
}

export interface iCreateStackCategoryInput {
  category: string;
}
