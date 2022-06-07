const doThreeOpt = (values) => {
    const {
        nodes,
        ifDraw
    } = values;
    const nodesLen = nodes.length;
    const matrix = createMatrix(nodesLen, nodes);
    let [path, _] = setRandomSolve(nodesLen, matrix);
    const time = Date.now();

    while (true) {
        let delta = 0;
        const segments = getAllSegments(nodesLen);

        for (let segment of segments) {
            const tempDelta = reverseSegmentIfBetterTour(path, segment, matrix);
            delta += tempDelta;
            console.log(delta);
            
            if(ifDraw && tempDelta < 0) {
                self.postMessage({
                    flag: 1, 
                    path
                });
            }
        }

        if (delta >= 0) {
            break;
        }
    }

    return {
        flag: 0,
        time: roundTime(time),
        len: Math.ceil(getFitness(path, matrix)),
        path: path,
    };
}
