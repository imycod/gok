const persistence = {
  handler: {
    get(key) {
      return JSON.parse(localStorage.getItem(key));
    },
    set(key, data) {
      JSON.stringify(localStorage.setItem(key, data));
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  }
};
export const storage = {
  get(key) {
    return persistence.handler.get(key);
  },
  set(key, data) {
    persistence.handler.set(key, data);
  },
  remove(key) {
    persistence.handler.remove(key);
  }
};
