const optionHiderIis = () => {
    const options = document.getElementById('iisOpt');

    if(options.style.display === "flex") {
        options.style.display = "none";
    } else {
        options.style.display = "flex";
    }
}

const onIisIter = () => {
    const value = document.getElementById('onChangeIisIter').value;
    return +value;
}

const onIisBodies = () => {
    const value = document.getElementById('onChangeIisBodies').value;
    return +value;
}

const onIisSelect = () => {
    const value = document.getElementById('onChangeIisSelect').value;
    return +value;
}

const onIisClones = () => {
    const value = document.getElementById('onChangeIisClones').value;
    return parseFloat(value);
}

const onIisAlpha = () => {
    const value = document.getElementById('onChangeIisAlpha').value;
    return parseFloat(value);
}

const selection = (selectBodiesNum, population, matrix) => {
    population.sort((a,b) => getFitness(b, matrix) - getFitness(a, matrix));
    return population.slice(0, selectBodiesNum);
}

const getClones = (clonesNum, body) => {
    const clonesArray = [];

    for(let i = 0; i < clonesNum; i++) {
        clonesArray.push([...body]);
    }

    return clonesArray;
}

const mutate = (alpha, clone, n, matrix) => {
    // const mutIt = Math.ceil(Math.exp(alpha * getFitness(clone, matrix)));
    const mutIt = 12;

    for(let i = 0; i < mutIt; i++) {
        rand_swap(clone, n);
    }
}

const createClones = (population, clonesNum) => {
    const clones = [];

    for(const body of population) {
        clones.push(getClones(clonesNum, body));
    }

    return clones;
}

const mutateClones = (clones, alpha, n, matrix) => {
    for(const cloneArr of clones) {
        for(const clone of cloneArr) {
            mutate(alpha, clone, n, matrix);
        }
    }
}

const getBestPath = (paths, matrix) => {
    let bestPath = paths[0];

    for(const path of paths) {
        if(getFitness(path, matrix) <= getFitness(bestPath, matrix)) {
            bestPath = [...path];
        }
    }

    return [bestPath, getFitness(bestPath, matrix)];
}

const changeParentIfCloneBest = (population, clones, matrix) => {
    for(let i = 0; i < population.length; i++) {
        const [bestClone, bestCloneLength] = getBestPath(clones[i], matrix);

        if(getFitness(population[i], matrix) > bestCloneLength) {
            population[i] = [...bestClone];
        }
    }
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