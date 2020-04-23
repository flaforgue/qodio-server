export default (arr: { id: string }[], id: string): boolean => {
  return arr.some((elem) => elem.id === id);
};
