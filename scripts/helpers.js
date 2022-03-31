const redrawEdges = (path) => {
    
    s.graph.edges(ids).forEach(e => {
        e.hidden = true;
    });

    ids.length = 0;
    
    for(let i = 0; i < path.length - 1; i++) {
        ids.push(edgeMatrix[path[i]][path[i + 1]]);
    }

    ids.push(edgeMatrix[path[path.length - 1]][path[0]]);

    s.graph.edges(ids).forEach(e => {
        e.hidden = false;
    });

    s.refresh();
}

const createMatrix = (nodesAmount, nodes) => {
    const matrix = [];
    for(let i = 0; i < nodesAmount; i++) {
        const matrixRow = []
        for(let j = 0; j < i; j++) {
            matrixRow.push(matrix[j][i]);
        }
        matrixRow.push(0);
        for(let j = i + 1; j < nodesAmount; j++) {
                matrixRow.push(
                Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                )
            )
        }
        matrix.push(matrixRow);
    }
    return matrix;
}

const resetGraphIngo = () => {
    hideTitle();
    hideIt();
    edgeMatrix = [];
    ids = [];
}

const prepareTest = () => {
    s.graph.edges().forEach(e => {
        e.hidden = true;
    });
    s.refresh();

    appearIt();
    hideTitle();
}
