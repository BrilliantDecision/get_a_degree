const randomSolvesNumber = 1000;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

function shuffle(oldArray) {
    const newArray = [];

    for(let i = 0; i < oldArray.length; i++) {
        newArray.push(oldArray[i]);
    }

    let counter = newArray.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        let temp = newArray[counter];
        newArray[counter] = newArray[index];
        newArray[index] = temp;
    }
    return newArray;
}


function getFitness(nodes, matrix) {
    let fitnessValue = 0;

    for(let i = 0; i < nodes.length - 1; i++) 
    fitnessValue += matrix[nodes[i]][nodes[i + 1]];

    return fitnessValue += matrix[nodes[nodes.length - 1]][nodes[0]];
}

const setRandomSolve = (nodesLen, matrix) => {
    let currentBestPath = generateRandomNodes(nodesLen);
    const randomSolves = [];

    for(let i = 0; i < randomSolvesNumber; i++) {
        randomSolves.push(generateRandomNodes(nodesLen));
    }

    for(let i = 0; i < randomSolvesNumber; i++) {
        if(getFitness(currentBestPath, matrix) > getFitness(randomSolves[i], matrix)) {
            currentBestPath = randomSolves[i];
        }
    }

    return [currentBestPath, getFitness(currentBestPath, matrix)];
}

const generateRandomNodes = nodesLen => {
    const nodes = [];

    for(let i = 0; i < nodesLen; i++){
        nodes.push(i);
    }

    return shuffle(nodes);
}

const getRandPath = (n) => {
    const path = [];

    for(let i = 0; i < n; i++){
        path.push(i);
    }

    return path;
}

function getOptSwap(currentPath, i, k) {
    let  newPath = currentPath.slice(0, i);
    newPath = newPath.concat(currentPath.slice(i, k + 1).reverse());
    
    return newPath.concat(currentPath.slice(k + 1, currentPath.length));
}

function annealSwap(currentPath) {
    const nodesLen = currentPath.length;
    const i = getRndInteger(0, nodesLen);
    const k = getRndInteger(0, nodesLen);

    if (i < k + 1) {
        let newPath = currentPath.slice(0, i);
        newPath = newPath.concat(currentPath.slice(i, k + 1).reverse());
        newPath = newPath.concat(currentPath.slice(k + 1, currentPath.length));
        return newPath;
    }
    else {
        let newPath = currentPath.slice(0, k);
        newPath = newPath.concat(currentPath.slice(k, i + 1).reverse());
        newPath = newPath.concat(currentPath.slice(i + 1, currentPath.length));
        return newPath;
    }
}

function rand_swap(current_path, n) {
    let i = getRndInteger(0, n);
    let k = getRndInteger(0, n);
    let temp = current_path[i];
    current_path[i] = current_path[k];
    current_path[k] = temp;
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

function gen_mutate(population, mut_chance) {
    for(let j = 0; j < population.length; j++) {
        if(getRndInteger(0, 1001) / 10.0 < mut_chance){
            population[j] = annealSwap(population[j]);
        }
    }
}

const inbreeding = (population, matrix) => {
    const pairs = [];

    for(let j = 0; j < population.length; j++) {   
        const i = getRndInteger(0, population.length);

        let leftPath = population[i], rightPath = population[i];
        let iLeft = i - 1, iRight = i + 1;
        const centerFitness = getFitness(population[i], matrix);

        while(iRight < population.length) {
            if(centerFitness !== getFitness(population[iRight], matrix)) {
                rightPath = population[iRight];
                break;
            }

            iRight += 1;
        }
        
        while(iLeft > -1) {
            if(getFitness(population[iLeft], matrix) !== centerFitness) {
                leftPath = population[iLeft];
                break;
            }

            iLeft -= 1;
        }

        const leftFitness = getFitness(leftPath, matrix);
        const rightFitness = getFitness(rightPath, matrix);

        if(leftFitness === centerFitness) {
            pairs.push([i, iRight]);
        }
        else if(rightFitness === centerFitness) {
            pairs.push([i, iLeft]);
        }
        else {
            if(leftFitness - centerFitness > centerFitness - rightFitness) {
                pairs.push([i, iRight]);
            } 
            else {
                pairs.push([i, iLeft]);
            }
        }
    }

    return pairs;
}

const eliteSelection = (population, initPopSize) => {
    return population.slice(0, initPopSize);
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

function get_pairs(population, init_pop_size, matrix) {
    let rand_numbers1 = [];
    let rand_numbers2 = [];
    let pairs = [];
    // Составляем пары
    while(pairs.length == 0) {
        rand_numbers1 = shuffle(generateRandomNodes(init_pop_size));
        rand_numbers2 = shuffle(generateRandomNodes(init_pop_size));
        for(let i = 0; i < init_pop_size; i++) {
            if(getFitness(population[rand_numbers1[i]], matrix) !== getFitness(population[rand_numbers2[i]], matrix))
                pairs.push([rand_numbers1[i], rand_numbers2[i]]);
        }
    }
    return pairs;
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

const roundTime = (time) => {
    return ((Date.now() - time) / 1000).toFixed(2);
}