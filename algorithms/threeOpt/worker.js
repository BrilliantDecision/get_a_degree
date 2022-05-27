importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/threeOpt/utils.js',
    '/algorithms/threeOpt/3opt.js',
);

self.addEventListener('message', e => {
    const values = doThreeOpt(e.data);
    self.postMessage(values);
    self.close();
});
