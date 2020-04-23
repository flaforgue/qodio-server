export default (arr: { id: string }[], id: string): { id: string }[] => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1);
    }
  }
};
