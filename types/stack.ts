export interface iCreateStackInput {
  label: string;
  category?: string;
  amount?: number;
}

export interface iUpdateStackInput {
  id: number;
  label: string;
  category?: string;
  amount?: number;
}
