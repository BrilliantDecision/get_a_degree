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
