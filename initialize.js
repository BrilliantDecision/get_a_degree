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
