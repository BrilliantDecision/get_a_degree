document.getElementById('generate_button').addEventListener("click", generate_func);
document.getElementById('start_button').addEventListener("click", start_func);
document.getElementById('test_button').addEventListener("click", test_func);
document.getElementById('prev_graph').addEventListener("click", prev_func);
document.getElementById('next_graph').addEventListener("click", next_func);
document.getElementById('prev_chart').addEventListener("click", prev_chart_func);
document.getElementById('next_chart').addEventListener("click", next_chart_func);

function test_func() {
    test_label_line_chart = [];
    test_data_line_chart = [[], [], []];
    algorithms = [
        [0, "Алгоритм отжига", '#dc143c', 0, 0, 0, 0], 
        [0, "Генетический алгоритм", '#20b2aa', 0, 0, 0, 0], 
        [0, "Гибридный алгоритм", '#191970', 0, 0, 0, 0]
      ];
    if(document.getElementById('annealing_check').checked) {
        algorithms[0][0] = 1;
    }
    if(document.getElementById('genetic_check').checked) {
        algorithms[1][0] = 1;
    }
    if(document.getElementById('hybrid_check').checked) {
        algorithms[2][0] = 1;
    }

    let test_count = parseInt(document.getElementById('test_count').value, 10);
    if (algorithms[0][0] + algorithms[1][0] + algorithms[2][0] > 0) {
        for(let i = 0; i < algorithms.length; i++) {
            let test = [];
            if(i == 0 && algorithms[i][0] == 1) {
                for(let j = 0; j < test_count; j++) {
                    test.push(start_anneal());
                }
            }
            else if(i == 1 && algorithms[i][0] == 1) {
                for(let j = 0; j < test_count; j++) {
                    test.push(start_genetic());
                }
            }
            else if(i == 2 && algorithms[i][0] == 1) {
                for(let j = 0; j < test_count; j++) {
                    test.push(start_hybrid());
                }
            }
            if(test.length != 0) {
                algorithms[i][5] = test; 
                let best_len = test[0][0][1];
                let path = [test[0][0][0], test[0][0][1]];
                let av_time = test[0][1];
                let test_line_data = test[0][2];
                for(let j = 1; j < test.length; j++) {
                    if(test[j][0][1] < best_len) {
                        best_len = test[j][0][1];
                        path = [test[j][0][0], test[j][0][1]];
                    }
                    av_time += test[j][1];
                    for(let k = 0; k < test_line_data.length; k++) {
                        test_line_data[k] += test[j][2][k];
                    }
                }
                for(let k = 0; k < test_line_data.length; k++) {
                    test_line_data[k] /= test.length;
                    test_line_data[k] = Math.trunc(test_line_data[k]*1000) / 1000;
                }
                test_data_line_chart[i] = test_line_data;
                algorithms[i][3] = path[0];
                algorithms[i][4] = Math.trunc(path[1]*1000) / 1000;
                algorithms[i][6] = Math.trunc((av_time/test.length)*1000) / 1000;
            }
        }
        for(let i = 0; i < algorithms.length; i++) {
            let sum = 0;
            if(algorithms[i][0] != 0) {
                let test = algorithms[i][5];
                for(let j = 0; j < test.length; j++) {
                    sum += test[j][0][1];
                }
                algorithms[i][5] = Math.trunc((sum/test.length)*1000) / 1000;
            }
        }
        let test_name = document.getElementById('test_name').value;
        if(test_name != '') {
            test_labels.push("Тест " + (test_labels.length + 1).toString() + ', ' + test_name);
        }
        else{
            test_labels.push("Тест " + (test_labels.length + 1).toString());
        }
        // создаём датасет
        if (test_labels.length == 1 || changed_dataset) {
            if(test_name != '') {
                test_labels = ["Тест 1" + ', ' + test_name];
            }
            else{
                test_labels = ["Тест 1"];
            }
                let datasets_len = [];
                let datasets_time = [];
                let dataset_line_chart = [];
                for(let i = 0; i < algorithms.length; i++) {
                    if(algorithms[i][0] == 1) {
                        datasets_len.push({
                            label: algorithms[i][1],
                            data: [algorithms[i][5]],
                            fill: false,
                            borderColor: [algorithms[i][2]],
                            backgroundColor: [algorithms[i][2]],
                            tension: 0.1,
                            borderWidth: 1
                        });
                        datasets_time.push({
                            label: algorithms[i][1],
                            data: [algorithms[i][6]],
                            fill: false,
                            borderColor: [algorithms[i][2]],
                            backgroundColor: [algorithms[i][2]],
                            tension: 0.1,
                            borderWidth: 1
                        });
                        dataset_line_chart.push({
                            label: algorithms[i][1],
                            data: test_data_line_chart[i],
                            fill: false,
                            borderColor: algorithms[i][2],
                            tension: 0.1,
                        });
                    }
                }
                chartInfo[0][2] = datasets_len;
                chartInfo[1][2] = datasets_time;
                chartInfo[2][2] = dataset_line_chart;
                chartInfo[0][3] = test_labels;
                chartInfo[1][3] = test_labels;
                chartInfo[2][3] = test_label_line_chart;
                chart_func()
            }
        else {
            let j = 0;
            for(let i = 0; i < myChart.data.datasets.length; i++) {
                while(algorithms[j][0] == 0) j++;
                chartInfo[0][2][i].data.push(algorithms[j][5]);
                chartInfo[1][2][i].data.push(algorithms[j][6]);
                j++;
            }
            //bar charts
            chartInfo[0][3] = test_labels;
            chartInfo[1][3] = test_labels;

            let dataset_line_chart = [];
            for(let i = 0; i < algorithms.length; i++) {
                if(algorithms[i][0] == 1) {
                    dataset_line_chart.push({
                        label: algorithms[i][1],
                        data: test_data_line_chart[i],
                        fill: false,
                        borderColor: algorithms[i][2],
                        tension: 0.1,
                    });
                }
            }
            //line chart
            chartInfo[2][2] = dataset_line_chart;
            chartInfo[2][3] = test_label_line_chart;

            chart_func();
        }
        after_work();
        first_graph();
    }
    changed_dataset = false;
}

function start_func() {
    pointer_chart = 2;
    test_label_line_chart = [];
    test_data_line_chart = [[], [], []];
    algorithms = [
        [0, "Алгоритм отжига", '#dc143c', 0, 0, 0, 0], 
        [0, "Генетический алгоритм", '#20b2aa', 0, 0, 0, 0], 
        [0, "Гибридный алгоритм", '#191970', 0, 0, 0, 0]
      ];
    if(document.getElementById('annealing_check').checked) {
        algorithms[0][0] = 1;
    }
    if(document.getElementById('genetic_check').checked) {
        algorithms[1][0] = 1;
    }
    if(document.getElementById('hybrid_check').checked) {
        algorithms[2][0] = 1;
    }

    let test_count = parseInt(document.getElementById('test_count').value, 10);
    if (algorithms[0][0] + algorithms[1][0] + algorithms[2][0] > 0) {
        for(let i = 0; i < algorithms.length; i++) {
            let test = [];
            if(i == 0 && algorithms[i][0] == 1) {
                for(let j = 0; j < test_count; j++) {
                    test.push(start_anneal());
                }
            }
            else if(i == 1 && algorithms[i][0] == 1) {
                for(let j = 0; j < test_count; j++) {
                    test.push(start_genetic());
                }
            }
            else if(i == 2 && algorithms[i][0] == 1) {
                for(let j = 0; j < test_count; j++) {
                    test.push(start_hybrid());
                }
            }
            if(test.length != 0) {
                algorithms[i][5] = test; 
                let best_len = test[0][0][1];
                let path = [test[0][0][0], test[0][0][1]];
                let av_time = test[0][1];
                let test_line_data = test[0][2];
                for(let j = 1; j < test.length; j++) {
                    if(test[j][0][1] < best_len) {
                        best_len = test[j][0][1];
                        path = [test[j][0][0], test[j][0][1]];
                    }
                    av_time += test[j][1];
                    for(let k = 0; k < test_line_data.length; k++) {
                        test_line_data[k] += test[j][2][k];
                    }
                }
                for(let k = 0; k < test_line_data.length; k++) {
                    test_line_data[k] /= test.length;
                    test_line_data[k] = Math.trunc(test_line_data[k]*1000) / 1000;
                }
                test_data_line_chart[i] = test_line_data;
                algorithms[i][3] = path[0];
                algorithms[i][4] = Math.trunc(path[1]*1000) / 1000;
                algorithms[i][6] = Math.trunc((av_time/test.length)*1000) / 1000;
            }
        }
        for(let i = 0; i < algorithms.length; i++) {
            let sum = 0;
            if(algorithms[i][0] != 0) {
                let test = algorithms[i][5];
                for(let j = 0; j < test.length; j++) {
                    sum += test[j][0][1];
                }
                algorithms[i][5] = Math.trunc((sum/test.length)*1000) / 1000;
            }
        }
        
        let test_name = document.getElementById('test_name').value;
        if(test_name != '') {
            test_labels.push("Тест " + (test_labels.length + 1).toString() + ', ' + test_name);
        }
        else{
            test_labels.push("Тест " + (test_labels.length + 1).toString());
        }
        // создаём датасет
        if (test_labels.length == 1 || changed_dataset) {
            if(test_name != '') {
                test_labels = ["Тест 1" + ', ' + test_name];
            }
            else{
                test_labels = ["Тест 1"];
            }
                let dataset_line_chart = [];
                for(let i = 0; i < algorithms.length; i++) {
                    if(algorithms[i][0] == 1) {
                        dataset_line_chart.push({
                            label: algorithms[i][1],
                            data: test_data_line_chart[i],
                            fill: false,
                            borderColor: algorithms[i][2],
                            tension: 0.1,
                        });
                    }
                }
                chartInfo[2][2] = dataset_line_chart;
                chartInfo[2][3] = test_label_line_chart;
                chart_func()
            }
        else {
            let dataset_line_chart = [];
            for(let i = 0; i < algorithms.length; i++) {
                if(algorithms[i][0] == 1) {
                    dataset_line_chart.push({
                        label: algorithms[i][1],
                        data: test_data_line_chart[i],
                        fill: false,
                        borderColor: algorithms[i][2],
                        tension: 0.1,
                    });
                }
            }
            //line chart
            chartInfo[2][2] = dataset_line_chart;
            chartInfo[2][3] = test_label_line_chart;
            chart_func();
        }
        after_work();
        first_graph();
    }
    changed_dataset = false;
}

function generate_func() {
    before_work();
    test_labels.length = 0;
    test_label_line_chart = [];
    test_data_line_chart = [[], [], []];
    edge_matrix = [];
    let n_ugol = document.getElementById('n_ugol');
    if(n_ugol.checked) {
        generate_circle_func();
    }
    else {
        generate_just_func();
    }
}

function generate_just_func() {
    let nodes_arr = [];
    let edges_arr = [];
    n = parseInt(document.getElementById('vertex_count').value, 10);
    for(let i = 0; i < n; i++) {
        edge_matrix.push([]);
        vertex = "n" + i.toString()
        nodes_arr.push({ 
            "id": vertex, 
            "label": vertex, 
            "x": Math.random()*2000, 
            "y": Math.random()*1400, 
            "size": 1
        });
        nodes_len = nodes_arr.length;
        edges_len = edges_arr.length;
        for(let j = 0; j < nodes_len; j++) {
            if(i == j) {
                edge_matrix[i].push(0);
            }
            else {
                edges_arr.push({ 
                    "id": "e" + (edges_len + j).toString(), 
                    "source": vertex, 
                    "target": "n" + j.toString(), 
                    "color": '#11FFFF', 
                    "type":'line', 
                    "size":1 
                });
                edge_matrix[j].push("e" + (edges_len + j).toString());
                edge_matrix[i].push("e" + (edges_len + j).toString());
            }
        }
    }
    // Create a graph object
    let graph = {
        "nodes": nodes_arr,
        "edges": edges_arr
    }
    // Clear previous graph
    s.graph.clear();
    // Load the graph in sigma
    s.graph.read(graph);
    see_all();
};

function generate_circle_func() {
    let nodes_arr = [];
    let edges_arr = [];
    let n = parseInt(document.getElementById('vertex_count').value, 10);

    let interval=(Math.PI*2)/n; 
    let centerX=1500;
    let centerY=1500;
    let radius=1000;  

    for(let i = 0; i < n; i++) {
        let desiredRadianAngleOnCircle = interval*i;
        edge_matrix.push([]);
        vertex = "n" + i.toString()
        nodes_arr.push({ 
            "id": vertex, 
            "label": vertex, 
            "x": centerX+radius*Math.cos(desiredRadianAngleOnCircle), 
            "y": centerY+radius*Math.sin(desiredRadianAngleOnCircle), 
            "size": 1
        });
        nodes_len = nodes_arr.length;
        edges_len = edges_arr.length;
        for(let j = 0; j < nodes_len; j++) {
            if(i == j) {
                edge_matrix[i].push(0);
            }
            else {
                edges_arr.push({ 
                    "id": "e" + (edges_len + j).toString(), 
                    "source": vertex, 
                    "target": "n" + j.toString(), 
                    "color": '#11FFFF', 
                    "type":'line', 
                    "size":1 
                });
                edge_matrix[j].push("e" + (edges_len + j).toString());
                edge_matrix[i].push("e" + (edges_len + j).toString());
            }
        }
    }
    // Create a graph object
    let graph = {
        "nodes": nodes_arr,
        "edges": edges_arr
    }
    // Clear previous graph
    s.graph.clear();
    // Load the graph in sigma
    s.graph.read(graph);
    see_all();
};

function prev_func() {
    let indexes = [];
    for(let i = 0; i < algorithms.length; i++) {
        if(algorithms[i][0] != 0) indexes.push(i);
    }
    pointer_alg--;
    if(pointer_alg < 0) pointer_alg = indexes.length - 1;
    graph_func(indexes);
}

function next_func() {
    let indexes = [];
    for(let i = 0; i < algorithms.length; i++) {
        if(algorithms[i][0] != 0) indexes.push(i);
    }
    pointer_alg++;
    if(pointer_alg > indexes.length - 1) pointer_alg = 0;
    graph_func(indexes);
}

function graph_func(indexes) {
    let alg = algorithms[indexes[pointer_alg]];
    redraw_edges(alg[3], alg[2]);
    let p = document.getElementById('graph_info');
    p.innerText = alg[1] + ',   Лучшая длина пути: ' + alg[4] + ',   Среднее время: ' + alg[6] + ' c.';
}

function first_graph() {
    pointer_alg = 0;
    let indexes = [];
    for(let i = 0; i < algorithms.length; i++) {
        if(algorithms[i][0] != 0) indexes.push(i);
    }
    let alg = algorithms[indexes[pointer_alg]];
    redraw_edges(alg[3], alg[2]);
    let p = document.getElementById('graph_info');
    p.innerText = alg[1] + ',   Лучшая длина пути: ' + alg[4] + ',   Среднее время: ' + alg[6] + ' c.';
}

function prev_chart_func() {
    pointer_chart--;
    if(pointer_chart < 0) pointer_chart = chartInfo.length - 1;
    chart_func();
}

function next_chart_func() {
    pointer_chart++;
    if(pointer_chart > chartInfo.length - 1) pointer_chart = 0;
    chart_func();
}

function chart_func() {
    change_type(chartInfo[pointer_chart][0]);
    myChart.options = chartInfo[pointer_chart][1];
    myChart.data.datasets = chartInfo[pointer_chart][2];
    myChart.data.labels = chartInfo[pointer_chart][3];
    myChart.update();
    let p = document.getElementById('chart_info');
    if(pointer_chart == 0) {
        p.innerText = 'График зависимости целевой функции от параметров алгоритма';
    }
    else if(pointer_chart == 1) {
        p.innerText = 'График зависимости времени выполнения от параметров алгоритма';
    }
    else if(pointer_chart == 2) {
        p.innerText = 'График зависимости целевой функции от числа итераций';
    }
}
