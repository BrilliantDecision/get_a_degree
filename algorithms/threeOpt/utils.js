
const getAllSegments = (n) => {
    const segments = [];

    for (let i = 0; i < n; i++) {
        for (let j = i + 2; j < n; j++) {
            for (let k = j + 2; k < n + (i > 0); k++) {
                segments.push([i, j, k])
            }
        }
    }

    return segments;
}

const reverseSegmentIfBetterTour = (tour, segment, matrix) => {
    const [i, j, k] = segment;
    let A;
    
    if (i === 0) {
        A = tour[tour.length - 1];
    } 
    else {
        A = tour[i - 1];
    }

    let B = tour[i],
        C = tour[j - 1],
        D = tour[j],
        E = tour[k - 1],
        F = tour[k % tour.length];

    const d0 = matrix[A][B] + matrix[C][D] + matrix[E][F];
    const d1 = matrix[A][C] + matrix[B][D] + matrix[E][F];
    const d2 = matrix[A][B] + matrix[C][E] + matrix[D][F];
    const d3 = matrix[A][D] + matrix[E][B] + matrix[C][F];
    const d4 = matrix[F][B] + matrix[C][D] + matrix[E][A];

    if (d0 > d1) {
        tour.splice(i, j - i, ...(tour.slice(i, j).reverse()))
        return -d0 + d1;
    } 
    else if (d0 > d2) {
        tour.splice(j, k - j, ...(tour.slice(j, k).reverse()))
        return -d0 + d2;
    } 
    else if (d0 > d4) {
        tour.splice(i, k - i, ...(tour.slice(i, k).reverse()))
        return -d0 + d4;
    } 
    else if (d0 > d3) {
        const temp = [...(tour.slice(j, k)), ...(tour.slice(i, j))];
        tour.splice(i, k - i, ...temp)
        return -d0 + d3;
    } 

    return 0;
}
