document.getElementById('start_button').addEventListener("click", start_algorithm);

// Main function algorithm
function start_algorithm(pop_size, participants_count, mut_chance, it) {
    all_nodes = s.graph.nodes();
    n = all_nodes.length;
    matrix = create_matrix(n, all_nodes);
    population = create_population(n, pop_size);
    init_pop_size = population.length;
    current_it = 0;
    best_paths_mas = [];
    while(current_it < it) {
        pairs = tournament(participants_count, init_pop_size, population, matrix);
        new_pop = ordered_cross(pairs, population);
        neighbour_mutate(new_pop, mut_chance);
        elite_selection(elite_percenage, init_pop_size, new_pop, matrix);
        
        current_it += 1;
        mas = get_best_path(new_pop, init_pop_size);
        best_paths_mas.push([mas[0], get_fitness(new_pop[mas[1]], matrix)]); // best length and path
    }
}

// Get rand int
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

function shuffle(array) {
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

// Create population
function create_population(n, pop_size) {
    population = [];
    one_population = [];
    for(let i = 0; i < n; i++) {
        one_population.push(i);
    }
    for(let i = 0; i < pop_size; i++) {
        population.push(one_population);
        one_population = shuffle(one_population);
    }
    return population;
}

// Get path length
function get_fitness(individual, matrix) {
    fitness_val = 0;
    for(let i = 0; i < individual.length - 1; i++) 
        fitness_val += matrix[individual[i]][individual[i + 1]]
    fitness_val += matrix[individual[-1]][individual[0]]
    return fitness_val;
}

// Get length and index of the best path
function get_best_path(population, init_pop_size) {
    j = 0;
    best_len = get_fitness(population[0]);
    for(let i = 1; i < init_pop_size; i++) {
        len = get_fitness(population[i]);
        if(len < best_len) {
            best_len = len;
            j = i;
        }
    }
    return [best_len, j];
}

// Tournament
function tournament(participants_count, init_pop_size, population, matrix) {
    indexes = [];
    pairs = [];
    // Amount of tournaments
    for(let i = 0; i < init_pop_size; i++) {
        participants = [];
        for(let j = 0; j < participants_count; j++) {
            participant = getRndInteger(0, init_pop_size);
            participants.push([get_fitness(population[participant], matrix), participant])
        }
        // Соритруем участников по длине пути
        participants = participants.sort(function(a, b) {
            return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1;
        });
        indexes.push(participants[0][1]);
    }

    // Составляем пары
    rand_numbers = [];
    for(let i = 0; i < init_pop_size; i++)
        rand_numbers.push(getRndInteger(0, init_pop_size));
    for(let i = 0; i < init_pop_size; i++)
        if(indexes[i] != rand_numbers[i])
            pairs.push([indexes[i], rand_numbers[i]]);
    return pairs;
}

// Упорядоченный ОК создать особь
function ordered_cross_create_ind(first, second, population) {
    section = getRndInteger(1, population[0].length) // выбираем точку разреза
    c = population[first].slice(0, section);         // левая часть
    right = population[first].slice(section, population[0].length);      // правая часть

    indexes = []
    for(let i = 0; i < right.length; i++) {
        indexes = [population[second].indexOf(right[i]), right[i]];
    }
    sorted_i = indexes.sort(function(a, b) {
        return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1;
    });
    for(let i = 0; i < sorted_i.length; i++)
        c.push(sorted[i][1]);
    return c;
}

// Упорядоченный оператор кроссинговера
function ordered_cross(pairs, population) {
    individuals = [];
    for(let i = 0; i < pairs.length; i += 2) {
        individuals.push(ordered_cross_create_ind(pairs[i], pairs[i + 1], population));
        individuals.push(ordered_cross_create_ind(pairs[i + 1], pairs[i], population));
    }
    return population.concat(individuals);
}

// Оператор случайной мутации - обмен местами двух соседей выбранного гена
function neighbour_mutate(population, mut_chance) {
    for(let i = 0; i < population.length; i++) {
        if(getRndInteger(0, 101) < mut_chance) {
            g = getRndInteger(0, population[0].length)
            if (g == 0) {
                [population[i][population.length - 1], population[i][1]] = [population[i][1], population[i][population.length - 1]];
            }
            else if (g == population[0].length - 1) {
                [population[i][g - 1], population[i][0]] = [population[i][0], population[i][g - 1]];
            }
            else {
                [population[i][g - 1], population[i][g + 1]] = [population[i][g + 1], population[i][g - 1]]; 
            }
        } 
    }
}

// Элитный отбор
function elite_selection(elite_percenage, init_pop_size, population, matrix) {
    new_pop = [];
    len_and_index = [];
    // Path len and index array
    for(let i = 0; i < population.length; i++) {
        len_and_index.push([get_fitness(population[i], matrix), i]);
    }
    // Sort that array
    len_and_index = len_and_index.sort(function(a, b) {
        return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1;
    });
    // Get indexes from sorted array
    vals = [];
    for(let i = 0; i < population.length; i++) {
        vals.push(len_and_index[i][1]);
    }
    // Get the elite
    elite_count = Math.trunc(init_pop_size * (elite_percenage / 100.0));
    for(let i = 0; i < elite_count; i++) {
        new_pop.push(population[vals[i]]);
    }
    // Get a rest of others with random
    rand_numbers = [];
    for(let i = elite_count; i < init_pop_size; i++) {
        rand_numbers.push(getRndInteger(elite_count, population.length));
    }
    for(let i = 0; i < rand_numbers.length; i++) {
        new_pop.push(population[vals[i]]);
    }
    return new_pop;
}
