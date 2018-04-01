export const get = keys =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, resolve)
  });

export const set = object =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.set(object, resolve)
  });
