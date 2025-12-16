class StorageManager {
  async save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async remove(key) {
    localStorage.removeItem(key);
  }
}

export default StorageManager;
