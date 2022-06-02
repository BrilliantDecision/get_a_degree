function doIis(values) {
    const {
        it,
        bodiesNum,
        selectBodiesNum,
        clonesNum,
        alpha,
        nodes,
        ifDraw
    } = values;

    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    let population = create_population(nodesLen, bodiesNum);
    let [bestPath, bestLength] = get_best_path(population, bodiesNum, matrix); //путь, длина пути
    let currentIt = 1;

    const incomePopSize = bodiesNum - selectBodiesNum;
    const time = Date.now();
    
    while (currentIt <= it) {
        self.postMessage({
            it: currentIt    
        });
        population = selection(selectBodiesNum, population, matrix);
        
        const clones = createClones(population, clonesNum);
        mutateClones(clones, alpha, nodesLen, matrix);
        changeParentIfCloneBest(population, clones, matrix);

        const [currentPath, currentLength] = getBestPath(population, matrix); 
        
        if (bestLength > currentLength) {
            bestPath = [...currentPath];
            bestLength = currentLength;

            if(ifDraw) {
                self.postMessage({
                    flag: 1, 
                    path: bestPath,
                });
            }
        }

        population = [...population, ...create_population(nodesLen, incomePopSize)];
        currentIt++;
    }

    return { 
        flag: 0,
        time: Math.ceil((Date.now() - time) / 1000), 
        len: Math.ceil(bestLength),
        path: bestPath,
    };
}
