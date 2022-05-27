const onCheckIfDraw = () => {
    return document.querySelector('#ifDraw').checked;
}

const setIteration = (i) => {
    document.querySelector('.iterations').innerText = i;
}

const optionHiderGenetic = () => {
    const options = document.querySelector('.hideGenetic');

    if(options.style.display === "flex") {
        options.style.display = "none";
    } else {
        options.style.display = "flex";
    }
}