const createAnnealingWorker = () => {
    const ifDraw = onCheckIfDraw();

    if (typeof(Worker) !== "undefined") {

        const values = {
            it: onAnnealIter(),
            itPerTemp: onAnnealIterPerTemp(),
            tMax: onAnnealTemp(),
            nodes: s.graph.nodes(),
            ifDraw
        }

        const w = new Worker("/algorithms/annealing/worker.js");
        
        w.addEventListener('message', e => {
            if(e.data.it) {
                setIteration(e.data.it);
            }
            else if(e.data.flag) {
                redrawEdges(e.data.path);
            } else {
                createGraphInfo(e.data.time, annealingTitle, e.data.len);

                if(!ifDraw) {
                    redrawEdges(e.data.path);
                }
            }
        });

        w.postMessage(values);
      } else {
        alert("Sorry! No Web Worker support.");
    }
}