export type KeyMap<TKey extends number | string, TValue> = {
  [prop in TKey]: TValue;
};
