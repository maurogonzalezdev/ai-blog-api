import ShortUniqueId, { ShortUniqueIdOptions } from 'short-unique-id';

const options: ShortUniqueIdOptions = {
  debug: false,
  length: 10,
  dictionary: 'alpha_lower',
  counter: 0,
  shuffle: false,
};

export const shortUniqueId = (): string => {
  return new ShortUniqueId(options).randomUUID();
};
