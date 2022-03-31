const doAnnealing = (values) => {
    const { it, itPerTemp, tMax, nodes,ifDraw } = values;
    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    let [currentBestPath, currentBestLength] = setRandomSolve(nodesLen, matrix);
    let [challengerPath, challengerLength] = [
        [...currentBestPath], currentBestLength
    ];
    let currentTemp = tMax;

    const time = Date.now();

    for (let i = 1; i <= it; i++) {
        self.postMessage({
            it: i    
        })
        for (let j = 1; j <= itPerTemp; j++) {

            challengerPath = annealSwap(challengerPath);
            challengerLength = getFitness(challengerPath, matrix);

            if (challengerLength < currentBestLength) {
                currentBestPath = challengerPath;
                currentBestLength = challengerLength;
            } else {
                const bound = 100.0 * Math.exp(-(challengerLength - currentBestLength) / currentTemp);

                if (getRndInteger(1, 1001) / 10.0 < bound) {
                    currentBestPath = challengerPath;
                    currentBestLength = challengerLength;

                    if(ifDraw) {
                        self.postMessage({
                            flag: 1, 
                            path: currentBestPath 
                        });
                    }
                } else {
                    challengerPath = currentBestPath;
                }
            }
        }
        currentTemp = tMax / i;
    }

    return { 
        flag: 0,
        time: Math.ceil((Date.now() - time) / 1000), 
        len: Math.ceil(currentBestLength),
        path: currentBestPath,
    };
}