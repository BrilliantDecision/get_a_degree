document.getElementById('generate_button').addEventListener("click", generate_func);

function generate_func() {
    var nodes_arr = [];
    var edges_arr = [];
    n = parseInt(document.getElementById('vertex_count').value, 10);
    for(let i = 0; i < n; i++) {
        vertex = "n" + i.toString()
        nodes_arr.push({ 
            "id": vertex, 
            "label": vertex, 
            "x": Math.random()*20, 
            "y": Math.random()*12, 
            "size": 1
        })
        nodes_len = nodes_arr.length;
        edges_len = edges_arr.length;
        for(let j = 0; j < nodes_len - 1; j++) {
            edges_arr.push({ 
                "id": "e" + (edges_len + j).toString(), 
                "source": vertex, 
                "target": "n" + j.toString(), 
                "color": '#11FFFF', 
                "type":'line', 
                "size":1 
            })
        }
    }
    // Create a graph object
    let graph = {
        "nodes": nodes_arr,
        "edges": edges_arr
    }
    // Clear previous graph
    s.graph.clear();
    // Load the graph in sigma
    s.graph.read(graph);
    all_edges_true = document.getElementById('see_all_edges')
    if (all_edges_true.checked == true) s.settings('drawEdges', true);
    else s.settings('drawEdges', false);
    // Ask sigma to draw it
    s.refresh();
};

function see_all_edges() {
    all_edges_true = document.getElementById('see_all_edges')
    if (all_edges_true.checked == true) s.settings('drawEdges', true);
    else s.settings('drawEdges', false);
    // Ask sigma to draw it
    s.refresh();
}


function change_vertex_size() {
    let maxNodeSize = s.settings('maxNodeSize');
    maxNodeSize = document.getElementById('vertex_size').value;
    s.settings('maxNodeSize', maxNodeSize);
    s.refresh();
}

function change_edges_size() {
    let maxEdgeSize = s.settings('maxEdgeSize');
    maxEdgeSize = document.getElementById('edge_size').value;
    s.settings('maxEdgeSize', maxEdgeSize);
    s.refresh();
}
