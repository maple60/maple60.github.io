var CHAINCODE_EX = document.getElementById('chaincode_ex');

var data = [{
  x: [0.5, 1.5, 2, 1.5, 0.5, -0.5, -1, -0.5],
  y: [0, -0.5, -1.5, -2.5, -3, -2.5, -1.5, -0.5],
  mode: 'text',
  text: ['a1=0', 'a2=7', 'a3=6', 'a4=5', 'a5=4', 'a6=3', 'a7=2', 'a8=1'],
  textposition: ['top', 'topright', 'left', 'topleft', 'top', 'topright', 'right', 'topleft']
}];

var layout = {
    xaxis: {
        zeroline: false
    },
    yaxis: {
        showline: false,
        zeroline: false,
    },
    annotations: [
        { // a1
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
        { // a2
            x: 2,
            y: -1,
            ax: 1,
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
        { // a3
            x: 2,
            y: -2,
            ax: 2,
            ay: -1,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // a3
            x: 1,
            y: -3,
            ax: 2,
            ay: -2,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // a4
            x: 0,
            y: -3,
            ax: 1,
            ay: -3,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // a5
            x: -1,
            y: -2,
            ax: 0,
            ay: -3,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // a6
            x: -1,
            y: -1,
            ax: -1,
            ay: -2,
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 1,
            arrowwidth: 2,
            arrowcolor: '#636363'
        },
        { // a7
            x: 0,
            y: 0,
            ax: -1,
            ay: -1,
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

Plotly.newPlot(CHAINCODE_EX, data, layout)
