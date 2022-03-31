const onCheckIfDraw = () => {
    return document.querySelector('#ifDraw').checked;
}

const setIteration = (i) => {
    document.querySelector('.iterations').innerText = i;
}