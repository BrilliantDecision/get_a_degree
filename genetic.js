// Main function algorithm
function start_genetic() {
    let participants_count = 2;
    let pop_size = parseInt(document.getElementById('pop_size').value, 10);
    let mut_chance = parseFloat(document.getElementById('mut_chance').value) * 100;
    let it_genetic = parseInt(document.getElementById('it_genetic').value, 10);
    let unique_individuals = parseFloat(document.getElementById('unique_individuals').value);
    let save_individuals = parseFloat(document.getElementById('save_individuals').value);

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
    let bpath = get_best_path(population, init_pop_size);
    let best_path = [bpath[0], bpath[1]]; //путь, длина пути
    redraw_edges(best_path[0], algorithms[1][2]);
    let k = 1;
    let timeInMs = Date.now();
    while(current_it <= it_genetic) {
        let pairs = get_pairs(population, init_pop_size);
        let children = partial_crossover(pairs, population, n);
        neighbour_mutate(children, n, mut_chance);
        let new_pop = tournament(participants_count, init_pop_size, children, matrix);

        let path = get_best_path(new_pop, init_pop_size);
        if(best_path[1] > path[1]) {
            best_path = path;
        }
        population = revise(new_pop, init_pop_size, n, unique_individuals, save_individuals);
        // Перекрашиваем эти рёбра
        redraw_edges(path[0], algorithms[1][2]);
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
    redraw_edges(best_path[0], algorithms[1][2]);
    return [best_path, (Date.now() - timeInMs) / 1000, data_line_chart]; 
    ///////////////////////////////////////////////////////////
}

// Create population
function create_population(n, pop_size) {
    let population = [];
    let one_population = [];
    for(let i = 0; i < n; i++) {
        one_population.push(i);
    }
    let new_arr = shuffle(one_population);
    population.push(new_arr);
    for(let i = 1; i < pop_size; i++) {
        new_arr = shuffle(one_population);
        population.push(new_arr);
    }
    return population;
}

function revise(population, init_pop_size, n, unique_individuals, save_individuals) {
    let new_pop = [];
    let visited = [];
    let uniques = population.filter(( t={}, a=> !(t[a]=a in t)));
    let bound =  Math.trunc(unique_individuals*init_pop_size); 
    let bound_add = Math.trunc(save_individuals*init_pop_size);
    if(uniques.length < bound) {
        for(let i = 0; i < bound_add; i++) {
            let index = getRndInteger(0, init_pop_size);
            while(visited.includes(index)){
                index = getRndInteger(0, init_pop_size);
            }
            new_pop.push(population[index]);
        }
        while(bound_add < init_pop_size) {
            new_pop.push(random_path(n));
            bound_add++;
        }
        return new_pop;
    }
    return population;
}


// Get length and index of the best path
function get_best_path(population, init_pop_size) {
    let j = 0;
    let best_len = get_fitness(population[0], matrix);
    let len = 0;
    for(let i = 1; i < init_pop_size; i++) {
        len = get_fitness(population[i], matrix);
        if(len < best_len) {
            best_len = len;
            j = i;
        }
    }
    return [population[j], best_len];
}

// Tournament
function tournament(participants_count, init_pop_size, population, matrix) {
    let new_pop = [];
    let pop_size = population.length;
    // Amount of tournaments
    for(let i = 0; i < init_pop_size; i++) {
        let participants = [];
        for(let j = 0; j < participants_count; j++) {
            let participant = getRndInteger(0, pop_size);
            participants.push([get_fitness(population[participant], matrix), participant]);
        }
        // Соритруем участников по длине пути
        participants = participants.sort(function(a, b) {
            return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1;
        });
        new_pop.push(population[participants[0][1]]);
    }
    return new_pop;
}

function get_pairs(population, init_pop_size) {
    let rand_numbers1 = [];
    let rand_numbers2 = [];
    let pairs = [];
    // Составляем пары
    while(pairs.length == 0) {
        rand_numbers1 = shuffle(random_path(init_pop_size));
        rand_numbers2 = shuffle(random_path(init_pop_size));
        for(let i = 0; i < init_pop_size; i++) {
            if(get_fitness(population[rand_numbers1[i]], matrix) != get_fitness(population[rand_numbers2[i]], matrix))
                pairs.push([rand_numbers1[i], rand_numbers2[i]]);
        }
    }
    return pairs;
}

// Упорядоченный оператор кроссинговера
function partial_crossover(pairs, population, chromosome_length) {
    let individuals = [];
    for(let i = 0; i < pairs.length; i++) {
        let parent0 = population[pairs[i][0]];
        let parent1 = population[pairs[i][1]];
        individuals.push(partial_help(parent0, parent1, chromosome_length));
        individuals.push(partial_help(parent1, parent0, chromosome_length));
    }
    return individuals;
}

function partial_help(parent0, parent1, chromosome_length) {
    let o1 = [];
    let position = 0;
    for(let j = 0; j < chromosome_length; j++) {
        o1.push(-1);
    }
    let o = true;
    while(o) {
        if(parent0[position] == parent1[position]) {
            o1[position] = parent0[position];
            position += 1;
            if(position == chromosome_length) o = false;
        }
        else {
            let k = true;
            let visited_list = [parent0[position]];
            o1[position] = parent0[position];
            while(k) {
                visited_list.push(parent1[position]);
                position = parent0.indexOf(parent1[position]);
                o1[position] = parent0[position];
                if(visited_list.includes(parent1[position])) {
                    k = false;
                    for(let z = 0; z < o1.length; z++) {
                        if(o1[z] == -1) {
                            o1[z] = parent1[z];
                        }
                    }
                }
                else if(visited_list.length == chromosome_length) {
                    k = false;
                }
            }
            o = false;
        }
    }
    return o1;
}

// // Оператор случайной мутации - обмен местами двух соседей выбранного гена
function neighbour_mutate(population, n, mut_chance) {
    for(let j = 0; j < population.length; j++) {
        if(getRndInteger(0, 1001) / 10.0 < mut_chance){
            rand_swap(population[j], n);
        }
    }
}
