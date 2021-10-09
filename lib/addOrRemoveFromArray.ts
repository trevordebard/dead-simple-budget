export function addOrRemoveFromArray(arr: any[], value: string | number): string[] | number[] {
  let newArr = [];
  const index = arr.indexOf(value);
  if (index === -1) {
    newArr = [...arr, value];
  } else {
    newArr = arr.filter(i => i !== value);
  }
  return newArr;
}
