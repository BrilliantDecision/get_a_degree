function redraw_path(path, color) {
    ids = []; // id рёбер
    sources_targets = [] // id вершин
    
    // Получаем id рёбер маршрута
    for(let i = 0; i < path.length - 1; i++) {
        ids.push(edge_matrix[path[i]][path[i + 1]]);
        if(path[i] > path[i + 1]) {
            sources_targets.push(["n" + path[i].toString(), "n" + path[i + 1].toString()]);
        }
        else {
            sources_targets.push(["n" + path[i + 1].toString(), "n" + path[i].toString()]);
        }
    }
    ids.push(edge_matrix[path[path.length - 1]][path[0]]);
    if(path[path.length - 1] > path[0]) {
        sources_targets.push(["n" + path[path.length - 1].toString(), "n" + path[0].toString()]);
    }
    else {
        sources_targets.push(["n" + path[0].toString(), "n" + path[path.length - 1].toString()]);
    }

    // Перекрашиваем эти рёбра
    for(let i = 0; i < ids.length; i++) {
        s.graph.dropEdge(ids[i]);
    }
    for(let i = 0; i < ids.length; i++) {
        s.graph.addEdge({
            "id": ids[i],
            "source": sources_targets[i][0], 
            "target": sources_targets[i][1], 
            "color": color
        });
    }
    s.refresh();
    all_edges = s.graph.edges(ids);
}

// Get rand int
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

function shuffle(old_array) {
    array = [];
    for(let i = 0; i < old_array.length; i++) {
        array.push(old_array[i]);
    }
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}


// Create matrix
function create_matrix(n, all_nodes) {
    matrix = [];
    for(let i = 0; i < n; i++) {
        matrix_line = []
        for(let j = 0; j < i; j++) {
            matrix_line.push(matrix[j][i]);
        }
        matrix_line.push(0);
        for(let j = i + 1; j < n; j++) {
                matrix_line.push(
                Math.sqrt(
                    Math.pow(all_nodes[i].x - all_nodes[j].x, 2) + 
                    Math.pow(all_nodes[i].y - all_nodes[j].y, 2)
                )
            )
        }
        matrix.push(matrix_line);
    }
    return matrix;
}

// Get path length
function get_fitness(individual, matrix) {
    fitness_val = 0;
    for(let i = 0; i < individual.length - 1; i++) 
        fitness_val += matrix[individual[i]][individual[i + 1]]
    fitness_val += matrix[individual[individual.length - 1]][individual[0]]
    return fitness_val;
}

// Случайный путь
function random_path(n) {
    path = [];
    for(let i = 0; i < n; i++){
        path.push(i);
    }
    return shuffle(path);
}