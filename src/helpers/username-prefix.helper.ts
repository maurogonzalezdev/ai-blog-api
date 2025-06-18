const prefixes: string[] = [
  'tech',
  'dev',
  'pro',
  'code',
  'byte',
  'sys',
  'web',
  'lab',
];

export const usernamePrefix = (): string => {
  return prefixes[Math.floor(Math.random() * prefixes.length)];
};
