var s = new sigma(
  {
    renderer: {
      container: document.getElementById('container'),
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

var edge_matrix = []; // Матрица вершин, в ячейках id рёбер
var all_edges = []; // id рёбер конечного пути
var pointer_alg = 0; // указывает на результат работы того или иного алгоритма (сначала 0)
var pointer_chart = 0; // указывает на тот или иной график
 // доступные алгоритмы (отжатые галочки) - 
 // храним: названия, цвета, и активированы ли 
 // (за это отвечает 0 - не активен, 1 - активен)
 // 3 - лучшие маршруты
 // 4 - их длины
 // 5 - средняя длина за запуски
 // 6 - среднее время за запуски
var algorithms = [
  [0, "Алгоритм отжига", '#dc143c', 0, 0, 0, 0], 
  [0, "Генетический алгоритм", '#20b2aa', 0, 0, 0, 0], 
  [0, "Гибридный алгоритм", '#191970', 0, 0, 0, 0]
];
var changed_dataset = false;
var test_labels = [];
var test_label_line_chart = [];
var test_data_line_chart = [[], [], []];
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: []
    }
  });

  var chartInfo = [
    [
      'bar', 
      {
        scales: {
            x: {
                title: {
                color: 'red',
                display: true,
                text: 'Тесты'
                }
            },
            y: {
                title: {
                color: 'red',
                display: true,
                text: 'Значение целевой функции'
                }
            }
        }
      },
      0,  //datasets
      0   //labels
    ], 
    [
      'bar',
      {
        scales: {
            x: {
                title: {
                color: 'red',
                display: true,
                text: 'Тесты'
                }
            },
            y: {
                title: {
                color: 'red',
                display: true,
                text: 'Время работы алгоритмов'
                }
            }
        }
      },
      0,  //datasets
      0   //labels
    ],
    [
      'line', 
      {
        scales: {
            x: {
                title: {
                color: 'red',
                display: true,
                text: 'Итерации'
                }
            },
            y: {
                title: {
                color: 'red',
                display: true,
                text: 'Значение целевой функции'
                }
            }
        }
      },
      0,  //datasets
      0   //labels
    ]
  ];
