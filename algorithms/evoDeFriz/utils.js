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

const onDeFrizReviseIt = () => {
    const value = document.getElementById('onChangeDeFrizReviseIt').value;
    return +value;
}

const onDeFrizMutIt = () => {
    const value = document.getElementById('onChangeDeFrizMutIt').value;
    return +value;
}

const onDeFrizUniqueNum = () => {
    const value = document.getElementById('onChangeDeFrizUniqueNum').value;
    return parseFloat(value);
}

function superMutate(mutIt, population) {
    for(let j = 0; j < mutIt; j++) {
        for(let i = 0; i < population.length; i++) {
            population[i] = annealSwap(population[i]);
        }
    }
}

function revise(population, uniqueNum, mutIt) {
    const tempPopulation = population.map((v) => JSON.stringify(v));
    let uniques = tempPopulation.filter(( t={}, a=> !(t[a]=a in t)));
    let bound =  Math.trunc(uniqueNum * population.length); 
    if(uniques.length < bound) {
        superMutate(mutIt, population);
    }
}
