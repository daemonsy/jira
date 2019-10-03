export const get = keys =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, resolve);
  });

export const set = object =>
  new Promise((resolve, reject) => {
    console.log(object);
    chrome.storage.sync.set(object, resolve);
  });

export const addOnChangedListener = listener =>
  chrome.storage.onChanged.addListener(listener);
