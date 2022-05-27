function doEvoDeFriz(values) {
    const {
        it,
        popSize,
        tourParticipants,
        mutChance,
        reviseIt,
        mutIt,
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
        gen_mutate(children, nodesLen, mutChance);
        population = tournament(tourParticipants, initPopSize, children, matrix);

        const [currentPath, currentLength] = get_best_path(population, initPopSize, matrix);
        
        if (bestLength > currentLength) {
            bestPath = currentPath;
            bestLength = currentLength;
            reviseCurrentIt = 1;

            if(ifDraw) {
                self.postMessage({
                    flag: 1, 
                    path: bestPath,
                });
            }
        } 
        else {
            reviseCurrentIt++;
        }

        if(reviseCurrentIt > reviseIt) {
            population = revise(nodesLen, mutIt, tourParticipants, initPopSize / 2, population, matrix);
            reviseCurrentIt = 1;
        }

        currentIt++;
    }

    return { 
        flag: 0,
        time: Math.ceil((Date.now() - time) / 1000), 
        len: Math.ceil(bestLength),
        path: bestPath,
    };
}
