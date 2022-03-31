const startTwoOpt = () => {
    const nodes = s.graph.nodes();
    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);
    const setOfRandomNodes = [];
    let currentBestPath = generateRandomNodes(nodesLen);

    for(let i = 0; i < 1000; i++) {
        setOfRandomNodes.push(generateRandomNodes(nodesLen));

        if(getFitness(currentBestPath, matrix) > getFitness(setOfRandomNodes[i], matrix)) {
            currentBestPath = setOfRandomNodes[i];
        }
    }

    let currentBestLen = getFitness(currentBestPath, matrix);
    let o = true;
    const timeInMs = Date.now();
    
    while(o == true) {
        let start = true;
        let i = 0;
        
        while(i < nodesLen - 1 && start) {
            let k = i + 1;

            while(k < nodesLen - 1 && start) {
                const newPath = getOptSwap(currentBestPath, i, k);
                const newLen = getFitness(newPath, matrix);

                if(newLen < currentBestLen) {
                    currentBestPath = newPath;
                    currentBestLen = newLen;
                    start = false;
                    redrawEdges(currentBestPath);
                }
                k++;
            }
            i++;
        }
        if(start == true) {
            o = false;
        }
    }
    return [currentBestPath,  (Date.now() - timeInMs) / 1000, currentBestLen];
}
