import { Stack } from '@prisma/client';

export function recalcStackPositions(stacks: Stack[]): Stack[] {
  return stacks.map((stack, index) => {
    return {
      ...stack,
      position: index * 10,
    };
  });
}
