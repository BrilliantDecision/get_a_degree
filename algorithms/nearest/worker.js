importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/nearest/nearest.js',
);

self.addEventListener('message', e => {
    const values = doNearest(e.data);
    self.postMessage(values);
    self.close();
});
