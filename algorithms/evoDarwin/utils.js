const optionHiderEvoDarwin = () => {
    const options = document.getElementById('evoDarwinOpt');

    if(options.style.display === "flex") {
        options.style.display = "none";
    } else {
        options.style.display = "flex";
    }
}

const onDarwinIter = () => {
    const value = document.getElementById('onChangeDarwinIter').value;
    return +value;
}

const onDarwinPopSize = () => {
    const value = document.getElementById('onChangeDarwinPopSize').value;
    return +value;
}

const onDarwinTournament = () => {
    const value = document.getElementById('onChangeDarwinTournament').value;
    return +value;
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
