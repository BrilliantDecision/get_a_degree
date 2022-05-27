importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/twoOpt/2opt.js',
);

self.addEventListener('message', e => {
    const values = doTwoOpt(e.data);
    self.postMessage(values);
    self.close();
});
