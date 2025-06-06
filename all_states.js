function makeplot() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv")
        .then(processData);
}

function processData(data) {
    // Hier ist data verfügbar!
    const regions = Object.keys(data[0]).filter(key => key !== 'Jahr' && key !== '');
    const filteredData = data.filter(row => parseInt(row.Jahr) > 1991);

    const traces = regions.map(region => ({
        x: filteredData.map(d => d.Jahr),
        y: filteredData.map(d => parseFloat(d[region])),
        type: 'scatter',
        mode: 'lines',
        name: region
    }));

    Plotly.newPlot('plot', traces, {
        title: 'Temperaturverläufe Deutschland (ab 1992)',
        xaxis: { title: 'Jahr' },

        yaxis: { title: 'Temperatur (°C)' }
    });
}

makeplot();




