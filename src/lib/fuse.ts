import Fuse from "fuse.js";

export function searchResults<T>(data: T[], keys: string[], query: string): T[] {
  const fuse = new Fuse(data, {
    keys: keys,
  });

  return fuse.search(query).map((result) => result.item);
}
