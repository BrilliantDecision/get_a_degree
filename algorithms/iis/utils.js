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

const onIisClones = () => {
    const value = document.getElementById('onChangeIisClones').value;
    return parseFloat(value);
}

const selection = (selectBodiesNum, population, matrix) => {
    population.sort((a,b) => getFitness(b, matrix) - getFitness(a, matrix));
    return population.slice(0, selectBodiesNum);
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

const createFirstIisPopulation = (options) => {
    const [popSize, matrix, posNum, maxPopSize, liveTime] = options;
    const startVertex = getRndInteger(0, matrix.length);
    const clonePositions = getRandCreateClonePositions(matrix.length, posNum);
    const clonesNum = getClonesNum(maxPopSize, popSize);
    const population = [];
    let randVertexes = getRandPath(matrix.length);
    let nextVertexes = [];

    randVertexes.sort((a,b) => matrix[startVertex][a] - matrix[startVertex][b]);
    randVertexes = randVertexes.filter((v) => v !== startVertex);
    nextVertexes = randVertexes.slice(0, popSize);

    for(let i = 0; i < nextVertexes.length; i++) {
        const allowVertexes = randVertexes.filter((v) => v !== nextVertexes[i]);
        const leukocyte = new Leukocyte(liveTime);
        leukocyte.initializeAllow(allowVertexes);
        leukocyte.addToPath(startVertex);
        leukocyte.setNext(nextVertexes[i]);
        population.push(leukocyte);
    }

    while(true) {
        if(population[0].getAllow().length === 0) {
            break;
        }

        for(const e of population) {
            e.addToPath(e.getNext());

            if(clonePositions.includes(e.getNext())) {
                e.addToClones(...createClones(clonesNum, e.getPath()));
            }

            e.createNext(matrix);
        }
    }
}

const getRandCreateClonePositions = (pathLength, posNum) => {
    const positions = [];

    for(let i = 0; i < posNum; i++) {
        const pos = getRndInteger(0, pathLength);

        if(!positions.includes(pos)) {
            positions.push(pos);
        }
    }

    return positions;
}

const createClones = (clonesNum, e) => {
    const clones = [];

    for(let i = 0; i < clonesNum; i++) {
        clones.push([...e]);
    }

    return clones;
}

const getClonesNum = (maxPopSize, popSize) => {
    if(maxPopSize < popSize) {
        console.log('maxPopSize < popSize');
        return 0;
    }

    return Math.ceil(Math.log2(maxPopSize / popSize));
}