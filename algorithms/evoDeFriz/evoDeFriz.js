function doEvoDeFriz(values) {
    const {
        it,
        popSize,
        tourParticipants,
        reviseIt,
        mutIt,
        uniqueNum,
        nodes,
        ifDraw
    } = values;

    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    let population = create_population(nodesLen, popSize);
    let initPopSize = population.length;
    let [bestPath, bestLength] = get_best_path(population, initPopSize, matrix); //путь, длина пути
    let currentIt = 1;
    let reviseCurrentIt = 1;

    const time = Date.now();
    
    while (currentIt <= it) {
        self.postMessage({
            it: currentIt    
        });
        let pairs = get_pairs(population, initPopSize, matrix);
        let children = cycle_crossover(pairs, population, nodesLen);
        gen_mutate(children, 1 - currentIt / it); 
        population = tournament(tourParticipants, initPopSize, children, matrix);

        const [currentPath, currentLength] = get_best_path(population, initPopSize, matrix);
        
        if (bestLength > currentLength) {
            bestPath = currentPath;
            bestLength = currentLength;

            if(ifDraw) {
                self.postMessage({
                    flag: 1, 
                    path: bestPath,
                });
            }
        } 

        if(reviseCurrentIt > reviseIt) {
            revise(population, uniqueNum, mutIt);
            reviseCurrentIt = 1;
        }

        currentIt++;
        reviseCurrentIt ++;
    }

    return { 
        flag: 0,
        time: roundTime(time), 
        len: Math.ceil(bestLength),
        path: bestPath,
    };
}
