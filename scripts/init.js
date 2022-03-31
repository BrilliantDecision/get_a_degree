const s = new sigma(
  {
    renderer: {
      container: document.getElementById('graph-container'),
      type: 'canvas'
    },
    settings: {
      minEdgeSize: 1,
      maxEdgeSize: 1,
      defaultNodeColor: '#ec5148',
      sideMargin: 0.5,
      clone: false
    }
  }
);

let edgeMatrix, ids;
let menuGraphShift = false;
let menuAlgShift = false;
let eventListenerId;

const annealingTitle = "Алгоритм отжига";
