importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/evoDarwin/utils.js',
    '/algorithms/evoDarwin/evoDarwin.js',
);

self.addEventListener('message', e => {
    const values = doEvoDarwin(e.data);
    self.postMessage(values);
    self.close();
});
