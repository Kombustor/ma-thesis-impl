export function unique<T extends PropertyKey>(
  arr: T[],
  cb?: (item: T) => void
) {
  const seen: Record<T, boolean> = {} as Record<T, boolean>;
  return arr.filter((item) => {
    if (seen.hasOwnProperty(item)) {
      cb && cb(item);
      return false;
    } else return (seen[item] = true);
  });
}
