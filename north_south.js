// Temperatur-Plot Funktion
function makeplot_north_south_temp() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv")
        .then(processData_temp);
}

function processData_temp(data) {
    const selectedRegions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filteredData = data.filter(row => parseInt(row.Jahr) >= 1991);

    // Funktion zum korrekten Parsen deutscher Dezimalzahlen
    function parseGermanFloat(value) {
        if (typeof value === 'string') {
            // Komma durch Punkt ersetzen für deutsche Dezimalnotation
            return parseFloat(value.replace(',', '.'));
        }
        return parseFloat(value);
    }

    // Debug-Ausgabe
    selectedRegions.forEach(region => {
        const x = filteredData.map(d => d.Jahr);
        const y = filteredData.map(d => parseGermanFloat(d[region]));

        console.log(`\nRegion: ${region}`);
        const zeile = x.map((jahr, i) => `(${jahr}, ${y[i]})`).join('');
        console.log(zeile);
    });

    // Traces für Plotly erstellen
    const traces = selectedRegions.map(region => ({
        x: filteredData.map(d => d.Jahr),
        y: filteredData.map(d => parseGermanFloat(d[region])),
        type: 'scatter',
        mode: 'lines+markers',
        name: region === 'Deutschland' ? 'Deutschland' :
            region === 'Süd_mean' ? 'Süddeutschland' : 'Norddeutschland'
    }));

    // Plot erstellen
    Plotly.newPlot('temperature-plot', traces, {
        title: 'Temperaturverläufe Deutschland (ab 1991)',
        xaxis: {
            title: 'Jahr',
            tickmode: 'array',
            tickvals: filteredData.map(d => d.Jahr).filter((_, i) => i % 2 === 0)
        },
        yaxis: {
            title: 'Temperatur (°C)'
        },
        layout: {
            hovermode: 'x unified'
        }
    });
}

// Sonnenscheindauer-Plot Funktion
function makeplot_north_south_sunshine() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/14806abf41806b882d43eb9b6064e4dbf8c8fe99/Data/sunshine_duration/regional_averages_sd_year.csv")
        .then(processData_sunshine);
}

function processData_sunshine(data) {
    const selectedRegions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filteredData = data.filter(row => parseInt(row.Jahr) >= 1991);

    // Funktion zum korrekten Parsen deutscher Dezimalzahlen
    function parseGermanFloat(value) {
        if (typeof value === 'string') {
            // Komma durch Punkt ersetzen für deutsche Dezimalnotation
            return parseFloat(value.replace(',', '.'));
        }
        return parseFloat(value);
    }

    // Debug-Ausgabe
    selectedRegions.forEach(region => {
        const x = filteredData.map(d => d.Jahr);
        const y = filteredData.map(d => parseGermanFloat(d[region]));

        console.log(`\nSonnenschein Region: ${region}`);
        const zeile = x.map((jahr, i) => `(${jahr}, ${y[i]})`).join('');
        console.log(zeile);
    });

    // Traces für Plotly erstellen
    const traces = selectedRegions.map(region => ({
        x: filteredData.map(d => d.Jahr),
        y: filteredData.map(d => parseGermanFloat(d[region])),
        type: 'scatter',
        mode: 'lines+markers',
        name: region === 'Deutschland' ? 'Deutschland' :
            region === 'Süd_mean' ? 'Süddeutschland' : 'Norddeutschland'
    }));

    // Plot erstellen
    Plotly.newPlot('sunshine-plot', traces, {
        title: 'Sonnenscheindauer Deutschland (ab 1991)',
        xaxis: {
            title: 'Jahr',
            tickmode: 'array',
            tickvals: filteredData.map(d => d.Jahr).filter((_, i) => i % 2 === 0)
        },
        yaxis: {
            title: 'Sonnenscheindauer (Stunden)'
        },
        layout: {
            hovermode: 'x unified'
        }
    });
}

// Funktionsaufrufe
makeplot_north_south_temp();
makeplot_north_south_sunshine();