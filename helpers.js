function redraw_edges(path, color) {
    for(let i = 0; i < all_edges.length; i++) {
        all_edges[i].color = '#11FFFF';
        if(document.getElementById('see_all_edges').checked == false)
            all_edges[i].hidden = true;
    }
    let ids = []; // id рёбер
    
    // Получаем id рёбер маршрута
    for(let i = 0; i < path.length - 1; i++) {
        ids.push(edge_matrix[path[i]][path[i + 1]]);
    }
    ids.push(edge_matrix[path[path.length - 1]][path[0]]);

    let vertrexes = []; // список вершин для каждого ребра (source, target)
    let vertex;
    for(let i = 0; i < ids.length; i++) {
        vertex = s.graph.edges(ids[i]);
        vertrexes.push([vertex.source, vertex.target]);
    }
    // Перекрашиваем эти рёбра
    for(let i = 0; i < ids.length; i++) {
        s.graph.dropEdge(ids[i]);
    }
    // Перекрашиваем эти рёбра
    for(let i = 0; i < ids.length; i++) {
        s.graph.addEdge({
            "id": ids[i],
            "source": vertrexes[i][0], 
            "target": vertrexes[i][1], 
            "color": color,
            "hidden": false,
            "type":'line', 
            "size":s.settings('maxEdgeSize')
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
    let path = [];
    for(let i = 0; i < n; i++){
        path.push(i);
    }
    return shuffle(path);
}

// 2opt swap
function opt_swap(current_path, i, k) {
    new_path = current_path.slice(0, i);
    new_path = new_path.concat(current_path.slice(i, k + 1).reverse());
    return new_path.concat(current_path.slice(k + 1, current_path.length));
}

function anneal_swap(current_path, i, k) {
    if (i <= k) {
        new_path = current_path.slice(0, i);
        new_path = new_path.concat(current_path.slice(i, k + 1).reverse());
        return new_path.concat(current_path.slice(k + 1, current_path.length));
    }
    else {
        new_path = current_path.slice(0, k);
        new_path = new_path.concat(current_path.slice(k, i + 1).reverse());
        return new_path.concat(current_path.slice(i + 1, current_path.length));
    }
}

function rand_swap(current_path, n) {
    let i = getRndInteger(0, n);
    let k = getRndInteger(0, n);
    let temp = current_path[i];
    current_path[i] = current_path[k];
    current_path[k] = temp;
}


function updateData(label, data, i) {
    myLineChart.data.labels.push(label);
    myLineChart.data.datasets[i].push(data);
    myLineChart.update();
}

function change_checkbox() {
    changed_dataset = true;
}

function get_time(av_time) {
    return 'Время: ' + av_time + ' c.';
}

function see_all() {
    let all_true = document.getElementById('see_all')
    let all_edges_true = document.getElementById('see_all_edges');
    if (all_true.checked == true && all_edges_true.checked == false) {
        s.settings('drawEdges', true);
        s.graph.edges().forEach(function(edge) {
            if(!all_edges.includes(edge))
                edge.hidden = true;
          });
        s.settings('drawNodes', true);
        s.settings('drawLabels', true);
    }
    else if(all_true.checked == true  && all_edges_true.checked == true) {
        s.settings('drawEdges', true);
        s.graph.edges().forEach(function(edge) {
            edge.hidden = false;
          });
        s.settings('drawNodes', true);
        s.settings('drawLabels', true);
    }
    else if(all_true.checked == false){
        s.settings('drawEdges', false);
        s.settings('drawNodes', false);
        s.settings('drawLabels', false);
    }
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
    s.settings('minEdgeSize', maxEdgeSize);
    s.refresh();
}

function after_work() {
    let bottom_infos = document.getElementsByClassName('bottom_info');
    for(let i = 0; i < bottom_infos.length; i++) {
        bottom_infos[i].style.display = 'flex';
    }
}

function before_work() {
    let bottom_infos = document.getElementsByClassName('bottom_info');
    for(let i = 0; i < bottom_infos.length; i++) {
        bottom_infos[i].style.display = 'none';
    }
}

function change_type(newType) {
    let ctx = document.getElementById('myChart');
  
    // Remove the old chart and all its event handles
    if (myChart) {
      myChart.destroy();
    }
  
    // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
    let temp = jQuery.extend(true, {}, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        }
      });
    temp.type = newType;
    myChart = new Chart(ctx, temp);
  };