const optionHiderAnnealing = () => {
    const options = document.getElementById('annealingOpt');

    if(options.style.display === "flex") {
        options.style.display = "none";
    } else {
        options.style.display = "flex";
    }
}

const onAnnealIter = () => {
    const value = document.getElementById('onChangeAnnealIter').value;
    return +value;
}

const onAnnealIterPerTemp = () => {
    const value = document.getElementById('onChangeAnnealIterPerTemp').value;
    return +value;
}

const onAnnealTemp = () => {
    const value = document.getElementById('onChangeAnnealTemp').value;
    return +value;
}
