const createIisWorker = () => {
    const ifDraw = onCheckIfDraw();

    if (typeof(Worker) !== "undefined") {

        const values = {
            it: onIisIter(),
            bodiesNum: onIisBodies(),
            selectBodiesNum: onIisSelect(),
            clonesNum: onIisClones(),
            alpha: onIisAlpha(),
            nodes: s.graph.nodes(),
            ifDraw
        }

        const w = new Worker("/algorithms/iis/worker.js");
        
        w.addEventListener('message', e => {
            if(e.data.it) {
                setIteration(e.data.it);
            }
            else if(e.data.flag) {
                redrawEdges(e.data.path);
            } else {
                createGraphInfo(e.data.time, 'Алгоритм искусственной имунной системы (CLONALG)', e.data.len);

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