const createEvoKimuraWorker = () => {
    const ifDraw = onCheckIfDraw();

    if (typeof(Worker) !== "undefined") {

        const values = {
            it: onKimuraIter(),
            popSize: onKimuraPopSize(),
            reviseIt: onKimuraReviseIt(),
            mutIt: onKimuraMutIt(),
            uniqueNum: onKimuraUniqueNum(),
            nodes: s.graph.nodes(),
            ifDraw
        }

        const w = new Worker("/algorithms/evoKimura/worker.js");
        
        w.addEventListener('message', e => {
            if(e.data.it) {
                setIteration(e.data.it);
            }
            else if(e.data.flag) {
                redrawEdges(e.data.path);
            } else {
                createGraphInfo(e.data.time, 'Генетический алгоритм (Эволюция Кимуры)', e.data.len);

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