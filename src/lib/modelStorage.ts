// IndexedDB storage for 3D models (handles large files)
const DB_NAME = 'CatiaModelsDB';
const STORE_NAME = 'models';
const DB_VERSION = 1;

interface ModelData {
  id: string;
  dataUrl: string;
  fileType: string;
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveModel = async (dataUrl: string, fileType: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const modelData: ModelData = {
      id: 'current-model',
      dataUrl,
      fileType,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(modelData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save model to IndexedDB:', error);
    throw error;
  }
};

export const loadModel = async (): Promise<{ dataUrl: string; fileType: string } | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get('current-model');
      request.onsuccess = () => {
        const result = request.result as ModelData | undefined;
        if (result) {
          resolve({ dataUrl: result.dataUrl, fileType: result.fileType });
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load model from IndexedDB:', error);
    return null;
  }
};

export const clearModel = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete('current-model');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to clear model from IndexedDB:', error);
    throw error;
  }
};
