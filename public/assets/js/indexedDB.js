/* eslint-disable linebreak-style */
// Function to Use Indexed DB depending on method - get, add, delete, clear
export function useIndexedDb(databaseName, storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);
    let db;
    let tx;
    let store;

    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore(storeName, { autoIncrement: true });
    };

    request.onerror = function (e) {
      console.log('There was an error');
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log('error');
      };
      if (method === 'add') {
        store.add(object);
      } else if (method === 'get') {
        const all = store.getAll();
        all.onsuccess = function () {
          resolve(all.result);
        };
      } else if (method === 'delete') {
        store.delete(object._id);
      } else if (method === 'clear') {
        store.clear();
        tx.oncomplete = function () {
          db.close();
        };
      }
    };
  });
}

// Check IndexedDB database and save data to server DB.
export function checkDatabase() {
  useIndexedDb('budget', 'pending', 'get', {}).then((result) => {
    if (result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          useIndexedDb('budget', 'pending', 'clear', {})
        });
    }
  });
}
