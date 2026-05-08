export function updateItemAtIndex<T>(
  items: T[],
  index: number,
  updater: (item: T) => T,
): T[] {
  return items.map((item, itemIndex) =>
    itemIndex === index ? updater(item) : item,
  );
}

export function removeItemAtIndex<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function appendItem<T>(items: T[], item: T): T[] {
  return [...items, item];
}

export function insertItemAfter<T>(items: T[], index: number, item: T): T[] {
  const nextItems = [...items];
  nextItems.splice(index + 1, 0, item);
  return nextItems;
}
