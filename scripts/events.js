const createGraphInfo = (time, title, length) => {
    const graphTitle = document.getElementById('graph-title');
    const graphTime = document.getElementById('graph-time');
    const graphLen = document.getElementById('graph-length');

    appearTitle();
    graphTitle.innerText = `${title}. `;
    graphLen.innerText = `Длина пути: ${length}. `;
    graphTime.innerText = `Время: ${time}c. `;
}

const createTest = () => {
    prepareTest();

    const alg = document.querySelector('input[name="radioAlg"]:checked').value;

    if (alg === 'annealing') {
        createAnnealingWorker();
    }
    else if(alg === 'iis') {
        createIisWorker();
    }
    else if(alg === 'evoDarwin') {
        createEvoDarwinWorker();
    }
    else if(alg === 'evoDeFriz') {
        createEvoDeFrizWorker();
    }
    else if(alg ==='nearest') {
        createNearestWorker();
    }
    else if (alg === '2opt') {
        create2optWorker();
    }
    else if (alg === '3opt') {
        create3optWorker();
    }
}

const generateNodesAndEdges = () => {
    resetGraphIngo();

    const nodesAmount = parseInt(document.getElementById('nodesCount').value, 10);
    const nodes = [];
    const edges = [];

    for(let i = 0; i < nodesAmount; i++) {
        const vertex = "n" + i.toString();

                
        edgeMatrix.push([]);
        nodes.push({ 
            "id": vertex, 
            "label": vertex, 
            "x": Math.random()*getWindowWidth(), 
            "y": Math.random()*getWindowHeight(), 
            "size": 1
        });

        const nodesLen = nodes.length;
        const edgesLen = edges.length;

        for(let j = 0; j < nodesLen; j++) {
            if(i == j) {
                edgeMatrix[i].push(0);
            }
            else {
                edges.push({ 
                    "id": "e" + (edgesLen + j).toString(), 
                    "source": vertex, 
                    "target": "n" + j.toString(), 
                    "hidden": true,
                    "type":'line', 
                    "size":1 
                });
                edgeMatrix[j].push("e" + (edgesLen + j).toString());
                edgeMatrix[i].push("e" + (edgesLen + j).toString());
            }
        }
    }
    // Create a graph object
    const graph = {
        "nodes": nodes,
        "edges": edges
    }
    // Clear previous graph
    s.graph.clear();
    // Load the graph in sigma
    s.graph.read(graph);
    s.refresh();
};
const menuGraphHider = () => {
    const menuGraph = document.querySelector(".menuGraph");
    
    menuGraphShift = !menuGraphShift;
  
    if(menuGraphShift) {
      menuGraph.style.right = "0px";
    } else {
      menuGraph.style.right = "-344px";
    }
}

const changeVertexSize = () => {
    const maxNodeSize = document.getElementById('vertexSize').value;
    s.settings('maxNodeSize', maxNodeSize);
    s.refresh();
}

const changeEdgesSize = () => {
    const maxEdgeSize = document.getElementById('edgeSize').value;
    s.settings('maxEdgeSize', maxEdgeSize);
    s.refresh();
}