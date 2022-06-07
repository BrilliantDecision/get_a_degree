const doTwoOpt = (values) => {
    const { nodes, ifDraw } = values;
    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    let [currentBestPath, currentBestLength] = setRandomSolve(nodesLen, matrix);
    let o = true;

    const time = Date.now();
    
    while(o) {
        let start = true;
        let i = 0;
        
        while(i < nodesLen - 1 && start) {
            let k = i + 1;

            while(k < nodesLen - 1 && start) {
                const newPath = getOptSwap(currentBestPath, i, k);
                const newLength = getFitness(newPath, matrix);

                if(newLength < currentBestLength) {
                    currentBestPath = newPath;
                    currentBestLength = newLength;
                    start = false;

                    if(ifDraw) {
                        self.postMessage({
                            flag: 1, 
                            path: currentBestPath 
                        });
                    }
                }
                k++;
            }
            i++;
        }
        if(start) {
            o = false;
        }
    }
    
    return { 
        flag: 0,
        time: roundTime(time), 
        len: Math.ceil(currentBestLength),
        path: currentBestPath,
    };
}
