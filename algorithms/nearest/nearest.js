const doNearest = (values) => {
    const { nodes, ifDraw } = values;
    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes); 
    const time = Date.now();
    let bestPath = generateRandomNodes(nodesLen);
    const vertexes = [];

    for(let i = 0; i < bestPath.length; i++) {
        vertexes.push(i);
    }
    
    for(let i = 0; i < vertexes.length; i++) {
        self.postMessage({
            it: i + 1    
        });
        
        const path = [vertexes[i]];
        const allowNodes = [...vertexes];
        allowNodes.splice(i, 1);
        let previousVertex = path[0];

        while(allowNodes.length !== 0) {
            const vertexAndLengths =[];

            for(const allow of allowNodes) {
                vertexAndLengths.push([allow, matrix[previousVertex][allow]]);
            }
    
            vertexAndLengths.sort((a,b) => a[1] - b[1]);
            path.push(vertexAndLengths[0][0]);
            previousVertex = vertexAndLengths[0][0];
            allowNodes.splice(allowNodes.findIndex((v) => v === vertexAndLengths[0][0]), 1);
        }

        if(getFitness(bestPath, matrix) > getFitness(path, matrix)) {
            bestPath = path;

            if(ifDraw) {
                self.postMessage({
                    flag: 1, 
                    path: bestPath 
                });
            }
        }
    }
    
    return { 
        flag: 0,
        time: roundTime(time), 
        len: Math.ceil(getFitness(bestPath, matrix)),
        path: bestPath,
    };
}
