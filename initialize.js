// Initialise sigma:
var s = new sigma(
  {
    renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
    },
    settings: {
      minEdgeSize: 0.1,
      defaultNodeColor: '#ec5148',
      sideMargin: 0.5,
    }
  }
);

var edge_matrix = []; // Матрица вершин, в ячейках id рёбер
var all_edges = []; // id рёбер конечного пути
