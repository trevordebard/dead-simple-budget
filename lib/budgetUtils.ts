import { Stack } from '.prisma/client';

export function getStackLabels(stacks: Stack[]) {
  const stackLabels = [];
  stacks.forEach(el => stackLabels.push(el.label));
  return stackLabels;
}
