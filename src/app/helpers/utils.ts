export const wait = (ms: number) => {
  return new Promise(res => setTimeout(res, ms));
};

export const cache = {
  get(key: string) {
    try {
      const value = localStorage.getItem(key);

      return JSON.parse(value) || null;
    } catch (e) {
      return null;
    }
  },
  set(key: string, value: any) {
    try {
      const str = JSON.stringify(value);

      localStorage.setItem(key, str);
    } catch (e) {}
  }
};
