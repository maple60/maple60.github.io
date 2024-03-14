var CHAINCODE = document.getElementById('chaincode');

var data = [{
  x: [1, 1, 0, -1, -1, -1, 0, 1],
  y: [0, 1, 1, 1, 0, -1, -1, -1],
  mode: 'text',
  text: ['0', '1', '2', '3', '4', '5', '6', '7'],
  textposition: ['right', 'topright', 'top', 'topleft', 'left', 'bottomleft', 'bottom', 'bottomright']
}];

var layout = {
    xaxis: {
        zeroline: false,
        showticklabels: false
    },
    yaxis: {
        showline: false,
        showgrid: true,
        zeroline: false,
        showticklabels: false
    },
    annotations: [
        { // 0
            x: 1,
            y: 0,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 1
            x: 1,
            y: 1,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 2
            x: 0,
            y: 1,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 3
            x: -1,
            y: 1,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 4
            x: -1,
            y: 0,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 5
            x: -1,
            y: -1,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 6
            x: 0,
            y: -1,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // 7
            x: 1,
            y: -1,
            ax: 0,
            ay: 0,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        }
    ]
};

Plotly.newPlot(CHAINCODE, data, layout)
