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

const hideTitle = () => {
    document.querySelector('.title-time-wrapper').style.opacity = "0";
}

const appearTitle = () => {
    document.querySelector('.title-time-wrapper').style.opacity = "1";
}

const hideIt = () => {
    document.querySelector('.iterations').style.opacity = "0";
}

const appearIt = () => {
    document.querySelector('.iterations').style.opacity = "1";
}