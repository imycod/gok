const persistence = {
  handler: {
    get(key) {
      return JSON.parse(localStorage.getItem(key));
    },
    set(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
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
  remove(namespace,key) {
    const currentStorage=this.get(namespace)
    Reflect.deleteProperty(currentStorage,key)
    this.set(namespace,currentStorage)
  }
};
