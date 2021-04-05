document.getElementById('start_button').addEventListener("click", start_algorithm);

// Main function algorithm
function start_algorithm() {
    // Перекрашиваем рёбра
    for(let i = 0; i < all_edges.length; i++) {
        all_edges[i].color = '#11FFFF';
    }
    all_nodes = s.graph.nodes();
    n = all_nodes.length;
    matrix = create_matrix(n, all_nodes);
    current_it = 0;
    current_best_path = random_path(n);
    current_best_length = get_fitness(current_best_path, matrix);
    redraw_path(current_best_path, '#ec5148');
    paths_mas = [];
    paths_mas.push([current_best_path, current_best_length]);
    let o = true;
    while(o == true) {
        start = true;
        let i = 0;
        while(i < n - 1 && start) {
            let k = i + 1;
            while(k < n - 1 && start) {
                new_path = opt_swap(current_best_path, i, k);
                new_path_length = get_fitness(new_path, matrix);
                if(new_path_length < current_best_length) {
                    current_best_path = new_path;
                    current_best_length = new_path_length;
                    paths_mas.push([current_best_path, current_best_length]);
                    start = false;

                    // Покраска
                    for(let i = 0; i < all_edges.length; i++) {
                        all_edges[i].color = '#11FFFF';
                    }
                    redraw_path(current_best_path, '#ec5148');
                }
                k++;
            }
            i++;
        }
        if(start == true) {
            o = false;
        }
    }
}

// 2opt swap
function opt_swap(current_path, i, k) {
    new_path = current_path.slice(0, i);
    new_path = new_path.concat(current_path.slice(i, k + 1).reverse());
    return new_path.concat(current_path.slice(k + 1, current_path.length));
}