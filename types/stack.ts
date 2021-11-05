import { Stack } from '.prisma/client';

export interface iCreateStackInput {
  label: string;
  amount?: number;
}

export interface iUpdateStackInput {
  id: number;
  label: string;
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
