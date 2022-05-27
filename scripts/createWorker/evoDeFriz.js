const createEvoDeFrizWorker = () => {
    const ifDraw = onCheckIfDraw();

    if (typeof(Worker) !== "undefined") {

        const values = {
            it: onDeFrizIter(),
            popSize: onDeFrizPopSize(),
            tourParticipants: onDeFrizTournament(),
            mutChance: onDeFrizMutChance(),
            reviseIt: onDeFrizReviseIt(),
            mutIt: onDeFrizMutIt(),
            nodes: s.graph.nodes(),
            ifDraw
        }

        const w = new Worker("/algorithms/evoDeFriz/worker.js");
        
        w.addEventListener('message', e => {
            if(e.data.it) {
                setIteration(e.data.it);
            }
            else if(e.data.flag) {
                redrawEdges(e.data.path);
            } else {
                createGraphInfo(e.data.time, 'Генетический алгоритм (Эволюция де Фриза)', e.data.len);

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