// Main function algorithm
function start_hybrid() {
    let participants_count = 2;
    let t_max = parseInt(document.getElementById('tMax_hybrid').value, 10);
    let it_per_temp = parseInt(document.getElementById('it_per_temp_hybrid').value, 10);
    let pop_size = parseInt(document.getElementById('pop_size_hybrid').value, 10);
    let it_genetic = parseInt(document.getElementById('it_genetic_hybrid').value, 10);
    let unique_individuals = parseFloat(document.getElementById('unique_individuals_hybrid').value);
    let save_individuals = parseFloat(document.getElementById('save_individuals_hybrid').value);

    // Перекрашиваем рёбра
    let all_nodes = s.graph.nodes();
    let n = all_nodes.length;
    let matrix = create_matrix(n, all_nodes);

    let data_line_chart = [];
    let whole_it;
    let remain;
    let mode10 = false;
    if(Math.trunc(it_genetic / 20) != 0) {
        whole_it = Math.trunc(it_genetic / 20);
        remain = it_genetic % 20;
        mode10 = true;
    }
    if(mode10 && test_label_line_chart.length == 0) {
        test_label_line_chart.push(1);
        for(let i = 1; i <= 20; i++) {
            test_label_line_chart.push(whole_it*i);
        }
        if(remain != 0) {
            test_label_line_chart.push(it_genetic);
        }
    }
    else if(test_label_line_chart.length == 0){
        for(let i = 1; i <= it_genetic; i++) {
            test_label_line_chart.push(i);
        }
    }

    let population = create_population(n, pop_size);
    let init_pop_size = population.length;
    let current_it = 1;
    let current_temp = t_max;
    let bpath = get_best_path(population, init_pop_size);
    let best_path = [bpath[0], bpath[1]]; //путь, длина пути
    redraw_edges(best_path[0], algorithms[1][2]);
    let k = 1;
    let timeInMs = Date.now();
    while(current_it <= it_genetic) {
        let pairs = get_pairs(population, init_pop_size);
        let children = partial_crossover(pairs, population, n);
        neighbour_super_mutate(children, n, current_temp, it_per_temp);
        let new_pop = tournament(participants_count, init_pop_size, children, matrix);

        let path = get_best_path(new_pop, init_pop_size);
        if(best_path[1] > path[1]) {
            best_path = path;
        }
        population = revise(new_pop, init_pop_size, n, unique_individuals, save_individuals);
        // Перекрашиваем эти рёбра
        redraw_edges(path[0], algorithms[2][2]);
        current_temp = t_max/current_it;
        if(mode10) {
            if(current_it == 1) {
                data_line_chart.push(best_path[1]);
            }
            else if(current_it == k*whole_it) {
                k++;
                data_line_chart.push(best_path[1]);
            } else if(current_it == it_genetic) {
                data_line_chart.push(best_path[1]);
            }
        }
        else {
            data_line_chart.push(best_path[1]);
        }
        current_it ++;
    }
    redraw_edges(best_path[0], algorithms[2][2]);
    return [best_path, (Date.now() - timeInMs) / 1000, data_line_chart]; 
    ///////////////////////////////////////////////////////////
}

function neighbour_super_mutate(population, n, current_temp, it_per_temp) {
    for(let j = 0; j < population.length; j++) {
        for(let p = 0; p < it_per_temp; p++) {
            let i = getRndInteger(0, n);
            let k = getRndInteger(0, n);
            let new_path = anneal_swap(population[j], i, k);
            let new_length = get_fitness(new_path, matrix);
            let old_length = get_fitness(population[j], matrix);
            if(new_length < old_length) {
                population[j] = new_path;
            }
            else if(getRndInteger(0, 1001) / 10.0 < 100*Math.exp(-(new_length - old_length) / current_temp)){
                population[j] = new_path;
            }
        }
    }
}
