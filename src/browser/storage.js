import getBrowser from './get-browser';

export const get = keys =>
  new Promise((resolve, reject) => {
    const browser = getBrowser();
    if (!browser.storage) return resolve({});

    browser.storage.sync.get(keys, resolve);
  });

export const set = object =>
  new Promise((resolve, reject) => {
    const browser = getBrowser();
    if (!browser.storage) return resolve();

    browser.storage.sync.set(object, resolve);
  });

export const addOnChangedListener = listener => {
  const browser = getBrowser();
  if (!browser.storage) {
    return null;
  }
  browser.storage.onChanged.addListener(listener);
};
