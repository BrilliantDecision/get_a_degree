importScripts(
    '/scripts/helpers.js',
    '/algorithms/helpers.js',
    '/algorithms/annealing/utils.js',
    '/algorithms/annealing/annealing.js',
);

self.addEventListener('message', e => {
    const values = doAnnealing(e.data);
    self.postMessage(values);
    self.close();
});
