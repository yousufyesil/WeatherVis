function makeplot_north_south() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv")
        .then(processData);
}
function processData(data) {
    const selectedRegions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filteredData = data.filter(row => parseInt(row.Jahr) >= 1991);

    selectedRegions.forEach(region => {
        const x = filteredData.map(d => d.Jahr);
        const y = filteredData.map(d => parseFloat(d[region]));

        console.log(`\nRegion: ${region}`);
        x.forEach((jahr, i) => {
            console.log(`(${jahr}, ${y[i]})`);
        });
    });

    const traces = selectedRegions.map(region => ({
        x: filteredData.map(d => d.Jahr),
        y: filteredData.map(d => parseFloat(d[region])),
        type: 'scatter',
        mode: 'lines',
        name: region

    }));

    Plotly.newPlot('north-south', traces, {
        title: 'Temperaturverläufe Deutschland (ab 1992)',
        xaxis: {
            title: 'Jahr',
            tickmode: 'array',
            tickvals: filteredData.map(d => d.Jahr).filter((_, i) => i % 2 === 0)
        },
        yaxis: { title: 'Temperatur (°C)' }
    });
}
makeplot_north_south(); // Korrigierter Funktionsaufruf