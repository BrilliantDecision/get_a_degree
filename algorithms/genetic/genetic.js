// Main function algorithm
function start_genetic() {
    let participants_count = 2;
    let pop_size = 800
    let mut_chance = 0.001;
    let it_genetic = 800;

    const nodes = s.graph.nodes();
    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);

    let population = create_population(nodesLen, pop_size);
    let init_pop_size = population.length;
    let current_it = 1;
    let bpath = get_best_path(population, init_pop_size, matrix);
    let best_path = [bpath[0], bpath[1]]; //путь, длина пути

    let timeInMs = Date.now();
    while(current_it <= it_genetic) {
        let pairs = get_pairs(population, init_pop_size, matrix);
        let children = cycle_crossover(pairs, population, nodesLen);
        gen_mutate(children, nodesLen, mut_chance);
        population = tournament(participants_count, init_pop_size, children, matrix);

        let path = get_best_path(population, init_pop_size, matrix);
        if(best_path[1] > path[1]) {
            best_path = path;
        }

        current_it ++;
    }

    return [best_path[0], (Date.now() - timeInMs) / 1000, best_path[1]]; 
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

function revise(population, init_pop_size, n, unique_individuals, current_temp, it_per_temp) {
    let uniques = population.filter(( t={}, a=> !(t[a]=a in t)));
    let bound =  Math.trunc(unique_individuals*init_pop_size); 
    if(uniques.length < bound) {
        super_mutate(population, n, current_temp, it_per_temp);
    }
    return population;
}


// Get length and index of the best path
function get_best_path(population, init_pop_size, matrix) {
    let j = 0;
    let best_len = getFitness(population[0], matrix);
    let len = 0;
    for(let i = 1; i < init_pop_size; i++) {
        len = getFitness(population[i], matrix);
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
            participants.push([getFitness(population[participant], matrix), participant]);
        }
        // Соритруем участников по длине пути
        participants = participants.sort(function(a, b) {
            return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1;
        });
        new_pop.push(population[participants[0][1]]);
    }
    return new_pop;
}

function get_pairs(population, init_pop_size, matrix) {
    let rand_numbers1 = [];
    let rand_numbers2 = [];
    let pairs = [];
    // Составляем пары
    while(pairs.length == 0) {
        rand_numbers1 = shuffle(generateRandomNodes(init_pop_size));
        rand_numbers2 = shuffle(generateRandomNodes(init_pop_size));
        for(let i = 0; i < init_pop_size; i++) {
            if(getFitness(population[rand_numbers1[i]], matrix) != getFitness(population[rand_numbers2[i]], matrix))
                pairs.push([rand_numbers1[i], rand_numbers2[i]]);
        }
    }
    return pairs;
}

// Упорядоченный оператор кроссинговера
function cycle_crossover(pairs, population, chromosome_length) {
    let individuals = [];
    for(let i = 0; i < pairs.length; i++) {
        let parent0 = population[pairs[i][0]];
        let parent1 = population[pairs[i][1]];
        individuals.push(cycle_help(parent0, parent1, chromosome_length));
        individuals.push(cycle_help(parent1, parent0, chromosome_length));
    }
    return individuals;
}

function cycle_help(parent0, parent1, chromosome_length) {
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

// Оператор случайной мутации - обмен местами двух соседей выбранного гена
function gen_mutate(population, n, mut_chance) {
    for(let j = 0; j < population.length; j++) {
        if(getRndInteger(0, 1001) / 10.0 < mut_chance){
            rand_swap(population[j], n);
        }
    }
}


function super_mutate(population, n, current_temp, it_per_temp) {
    for(let j = 0; j < population.length; j++) {
        for(let p = 0; p < it_per_temp; p++) {
            let i = getRndInteger(0, n);
            let k = getRndInteger(0, n);
            let new_path = anneal_swap(population[j], i, k);
            let new_length = getFitness(new_path, matrix);
            let old_length = getFitness(population[j], matrix);
            if(new_length < old_length) {
                population[j] = new_path;
            }
            else if(getRndInteger(0, 1001) / 10.0 < 100*Math.exp(-(new_length - old_length) / current_temp)){
                population[j] = new_path;
            }
        }
    }
}