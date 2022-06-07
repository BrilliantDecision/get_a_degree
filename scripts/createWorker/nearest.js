const createNearestWorker = () => {
    const ifDraw = onCheckIfDraw();

    if (typeof(Worker) !== "undefined") {

        const values = {
            nodes: s.graph.nodes(),
            ifDraw
        }

        const w = new Worker("/algorithms/nearest/worker.js");
        
        w.addEventListener('message', e => {
            if(e.data.it) {
                setIteration(e.data.it);
            }
            else if(e.data.flag) {
                redrawEdges(e.data.path);
            } else {
                createGraphInfo(e.data.time, 'Алгоритм ближайшего соседа', e.data.len);

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
