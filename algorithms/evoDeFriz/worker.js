importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/evoDeFriz/utils.js',
    '/algorithms/evoDeFriz/evoDeFriz.js',
);

self.addEventListener('message', e => {
    const values = doEvoDeFriz(e.data);
    self.postMessage(values);
    self.close();
});
