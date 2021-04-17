// Main function algorithm
function start_anneal() {
    let t_max = parseInt(document.getElementById('tMax').value, 10);
    let it = parseInt(document.getElementById('it_anneal').value, 10);
    let it_per_temp = parseInt(document.getElementById('it_per_temp').value, 10);
    // Перекрашиваем рёбра
    let all_nodes = s.graph.nodes();
    let n = all_nodes.length;
    let matrix = create_matrix(n, all_nodes);

    let data_line_chart = [];
    let whole_it;
    let remain;
    let mode10 = false;
    if(Math.trunc(it / 20) != 0) {
        whole_it = Math.trunc(it / 20);
        remain = it % 20;
        mode10 = true;
    }
    if(mode10 && test_label_line_chart.length == 0) {
        test_label_line_chart.push(1);
        for(let i = 1; i <= 20; i++) {
            test_label_line_chart.push(whole_it*i);
        }
        if(remain != 0) {
            test_label_line_chart.push(it);
        }
    }
    else if(test_label_line_chart.length == 0){
        for(let i = 1; i <= it; i++) {
            test_label_line_chart.push(i);
        }
    }

    let current_temp = t_max;
    let current_best_path = random_path(n);
    let random_solves = [];
    for(let i = 0; i < 1000; i++) {
        random_solves.push(random_path(n));
    }
    for(let i = 0; i < 1000; i++) {
        if(get_fitness(current_best_path, matrix) > get_fitness(random_solves[i], matrix)) {
            current_best_path = random_solves[i];
        }
    }
    let current_best_length = get_fitness(current_best_path, matrix);
    let challenger_path = current_best_path.slice(0, current_best_path.length);
    let challenger_length = current_best_length;
    redraw_edges(current_best_path, algorithms[0][2]);
    let best_path = [current_best_path, current_best_length];
    let j = 1;
    let k = 1;
    let timeInMs = Date.now();
    do {
        for(let i = 0; i < it_per_temp; i++) {    
            challenger_path = anneal_swap(challenger_path, getRndInteger(0, n), getRndInteger(0, n));
            challenger_length = get_fitness(challenger_path, matrix);
            if (challenger_length < current_best_length) {
                current_best_path = challenger_path;
                current_best_length = challenger_length;
            }
            else {
                let az = Math.exp(-(challenger_length - current_best_length) / current_temp);
                if (getRndInteger(1, 1001) / 10.0 < 100.0 * az) {
                    current_best_path = challenger_path;
                    current_best_length = challenger_length;
                }
                else challenger_path = current_best_path;
            }
            // Покраска
            redraw_edges(current_best_path, algorithms[0][2]);
            if(best_path[1] > current_best_length) {
                best_path[0] = current_best_path;
                best_path[1] = current_best_length;
            }
        }
        if(mode10) {
            if(j == 1) {
                data_line_chart.push(current_best_length);
            }
            else if(j == k*whole_it) {
                k++;
                data_line_chart.push(current_best_length);
            } else if(j == it) {
                data_line_chart.push(current_best_length);
            }
        }
        else {
            data_line_chart.push(current_best_length);
        }
        j ++;
        current_temp = t_max / j;
    } while(j <= it);
    return [best_path, (Date.now() - timeInMs) / 1000, data_line_chart]; // путь и время
}
///////////
