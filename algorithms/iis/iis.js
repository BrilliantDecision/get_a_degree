function doIis(values) {
    const {
        it,
        bodiesNum,
        clonesNum,
        nodes,
        ifDraw
    } = values;

    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    



    let currentIt = 1;
    const time = Date.now();
    
    while (currentIt <= it) {
        self.postMessage({
            it: currentIt    
        });

        

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

        currentIt++;
    }

    return { 
        flag: 0,
        time: roundTime(time), 
        len: Math.ceil(bestLength),
        path: bestPath,
    };
}
