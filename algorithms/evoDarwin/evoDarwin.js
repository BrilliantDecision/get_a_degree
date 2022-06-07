function doEvoDarwin(values) {
    const {
        it,
        popSize,
        tourParticipants,
        nodes,
        ifDraw
    } = values;

    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    let population = create_population(nodesLen, popSize);
    let initPopSize = population.length;
    let [bestPath, bestLength] = get_best_path(population, initPopSize, matrix); //путь, длина пути
    let currentIt = 1;

    const time = Date.now();
    
    while (currentIt <= it) {
        self.postMessage({
            it: currentIt    
        });
        // let pairs = inbreeding(population, matrix);
        let pairs = get_pairs(population, initPopSize, matrix);
        let children = cycle_crossover(pairs, population, nodesLen);
        gen_mutate(children, 1 - currentIt / it); 
        population = tournament(tourParticipants, initPopSize, children, matrix);
        // children.sort((a,b) => getFitness(b, matrix) - getFitness(a, matrix));
        // population = eliteSelection(children, initPopSize);

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

        currentIt++;
    }

    return { 
        flag: 0,
        time: roundTime(time), 
        len: Math.ceil(bestLength),
        path: bestPath,
    };
}