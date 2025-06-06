function makeplot() {
    d3.csv("https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv", function(data){ processData(data) } );

}

function processData(allRows) {

    console.log(allRows);
    var x = [], y = [], standard_deviation = [];

    for (var i=0; i<allRows.length; i++) {
        row = allRows[i];
        x.push( row['AAPL_x'] );
        y.push( row['AAPL_y'] );
    }
    console.log( 'X',x, 'Y',y, 'SD',standard_deviation );
    makePlotly( x, y, standard_deviation );
}

function makePlotly( x, y, standard_deviation ){
    var plotDiv = document.getElementById("plot");
    var traces = [{
        x: x,
        y: y
    }];

    Plotly.newPlot('myDiv', traces, {
        title: {
            text: 'Plotting CSV data from AJAX call'
        }
    });
}
makeplot();
