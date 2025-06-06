function makeplot_north_south() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv")
        .then(processData);
}

function processData(data) {
    // Nur die gewünschten Regionen auswählen
    const selectedRegions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filteredData = data.filter(row => parseInt(row.Jahr) > 1991);

    const traces = selectedRegions.map(region => ({
        x: filteredData.map(d => d.Jahr),
        y: filteredData.map(d => parseFloat(d[region])),
        type: 'scatter',
        mode: 'lines',
        name: region
    }));

    Plotly.newPlot('north-south', traces, {
        title: 'Temperaturverläufe Deutschland (ab 1992)',
        xaxis: { title: 'Jahr' },
        yaxis: { title: 'Temperatur (°C)' }
    });
}

makeplot_north_south(); // Korrigierter Funktionsaufruf