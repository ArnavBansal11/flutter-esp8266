export const env = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
};
