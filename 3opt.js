// Main function algorithm
function start_three_opt(color) {
    // Перекрашиваем рёбра
    for(let i = 0; i < all_edges.length; i++) {
        all_edges[i].color = '#11FFFF';
        all_edges[i].hidden = true;
    }
    all_nodes = s.graph.nodes();
    n = all_nodes.length;
    matrix = create_matrix(n, all_nodes);

    new_path = [];
    current_best_path = random_path(n);
    random_solves = [];
    for(let i = 0; i < 1000; i++) {
        random_solves.push(random_path(n));
    }
    for(let i = 0; i < 1000; i++) {
        if(get_fitness(current_best_path, matrix) > get_fitness(random_solves[i], matrix)) {
            current_best_path = random_solves[i];
        }
    }
    current_best_length = get_fitness(current_best_path, matrix);
    redraw_path(current_best_path, color);
    paths_mas = [];
    paths_mas.push(current_best_length);
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
                    start = false;

                    // Покраска
                    for(let i = 0; i < all_edges.length; i++) {
                        all_edges[i].color = '#11FFFF';
                        all_edges[i].hidden = true;
                    }
                    redraw_path(current_best_path, color);
                    paths_mas.push(current_best_length);
                }
                k++;
            }
            i++;
        }
        if(start == true) {
            o = false;
        }
    }
    return paths_mas;
}
