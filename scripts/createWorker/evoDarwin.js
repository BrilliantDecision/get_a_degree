const createEvoDarwinWorker = () => {
    const ifDraw = onCheckIfDraw();

    if (typeof(Worker) !== "undefined") {

        const values = {
            it: onDarwinIter(),
            popSize: onDarwinPopSize(),
            tourParticipants: onDarwinTournament(),
            mutChance: onDarwinMutChance(),
            nodes: s.graph.nodes(),
            ifDraw
        }

        const w = new Worker("/algorithms/evoDarwin/worker.js");
        
        w.addEventListener('message', e => {
            if(e.data.it) {
                setIteration(e.data.it);
            }
            else if(e.data.flag) {
                redrawEdges(e.data.path);
            } else {
                createGraphInfo(e.data.time, 'Генетический алгоритм (Эволюция Дарвина)', e.data.len);

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