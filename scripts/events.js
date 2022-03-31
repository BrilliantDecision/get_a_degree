const createGraphInfo = (time, title, length) => {
    const container = document.getElementById('graph-info');
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
            "x": Math.random()*1950, 
            "y": Math.random()*1200, 
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