const optionHiderEvoDeFriz = () => {
    const options = document.getElementById('evoDeFrizOpt');

    if(options.style.display === "flex") {
        options.style.display = "none";
    } else {
        options.style.display = "flex";
    }
}

const onDeFrizIter = () => {
    const value = document.getElementById('onChangeDeFrizIter').value;
    return +value;
}

const onDeFrizPopSize = () => {
    const value = document.getElementById('onChangeDeFrizPopSize').value;
    return +value;
}

const onDeFrizTournament = () => {
    const value = document.getElementById('onChangeDeFrizTournament').value;
    return +value;
}

const onDeFrizMutChance = () => {
    const value = document.getElementById('onChangeDeFrizMutChance').value;
    return parseFloat(value);
}

const onDeFrizReviseIt = () => {
    const value = document.getElementById('onChangeDeFrizReviseIt').value;
    return +value;
}

const onDeFrizMutIt = () => {
    const value = document.getElementById('onChangeDeFrizMutIt').value;
    return +value;
}

function revise(n, mutIt, participants_count, init_pop_size, population, matrix) {
    let revisePop = tournament(participants_count, init_pop_size, population, matrix);
    superMutate(n, revisePop, mutIt);
    let newComePop = create_population(n, init_pop_size);
    const newPop = [...revisePop, ...newComePop];
    return newPop;
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


// function super_mutate(population, n, current_temp, it_per_temp) {
//     for(let j = 0; j < population.length; j++) {
//         for(let p = 0; p < it_per_temp; p++) {
//             let i = getRndInteger(0, n);
//             let k = getRndInteger(0, n);
//             let new_path = anneal_swap(population[j], i, k);
//             let new_length = getFitness(new_path, matrix);
//             let old_length = getFitness(population[j], matrix);
//             if(new_length < old_length) {
//                 population[j] = new_path;
//             }
//             else if(getRndInteger(0, 1001) / 10.0 < 100*Math.exp(-(new_length - old_length) / current_temp)){
//                 population[j] = new_path;
//             }
//         }
//     }
// }

function superMutate(n, population, mutIt) {
    for(let j = 0; j < mutIt; j++) {
        for(let i = 0; i < population.length; i++) {
            rand_swap(population[i], n);
        }
    }
}
