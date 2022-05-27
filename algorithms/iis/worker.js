importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/iis/utils.js',
    '/algorithms/iis/iis.js',
);

self.addEventListener('message', e => {
    const values = doIis(e.data);
    self.postMessage(values);
    self.close();
});
