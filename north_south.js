// Gemeinsame Helper-Funktion zum Parsen deutscher Dezimalzahlen
function parseGermanFloat(value) {
    if (typeof value === 'string') {
        return parseFloat(value.replace(',', '.'));
    }
    return parseFloat(value);
}

// Temperatur-Plot
function makeplot_north_south_temp() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv")
        .then(processData_temp)
        .catch(err => console.error("Error loading temperature CSV:", err));
}

function processData_temp(data) {
    const regions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filtered = data.filter(row => parseInt(row.Jahr) >= 1991);

    const traces = regions.map(region => ({
        x: filtered.map(d => d.Jahr),
        y: filtered.map(d => parseGermanFloat(d[region])),
        type: 'scatter',
        mode: 'lines+markers',
        name: region === 'Deutschland'   ? 'Deutschland' :
            region === 'Süd_mean'       ? 'Süddeutschland' :
                'Norddeutschland'
    }));

    const layout = {
        title: 'Temperaturverläufe Deutschland (ab 1991)',
        xaxis: {
            title: 'Jahr',
            tickmode: 'array',
            tickvals: filtered.map((d, i) => i % 2 === 0 ? d.Jahr : null)
                .filter(v => v !== null),
            fixedrange: true
        },
        yaxis: {
            title: 'Temperatur (°C)',
            fixedrange: true
        },
        hovermode: 'x unified',
        margin: { t: 50, l: 60, r: 20, b: 50 },
        legend: {
            orientation: "h",
            y : -0.2,
        }

    };

    Plotly.newPlot('temperature-plot', traces, layout);
}

// Sonnenscheindauer-Plot
function makeplot_north_south_sunshine() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/14806abf41806b882d43eb9b6064e4dbf8c8fe99/Data/sunshine_duration/regional_averages_sd_year.csv")
        .then(processData_sunshine)
        .catch(err => console.error("Error loading sunshine CSV:", err));
}

function processData_sunshine(data) {
    const regions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filtered = data.filter(row => parseInt(row.Jahr) >= 1991);

    const traces = regions.map(region => ({
        x: filtered.map(d => d.Jahr),
        y: filtered.map(d => parseGermanFloat(d[region])),
        type: 'scatter',
        mode: 'lines+markers',
        name: region === 'Deutschland'   ? 'Deutschland' :
            region === 'Süd_mean'       ? 'Süddeutschland' :
                'Norddeutschland'
    }));

    const layout = {
        title: 'Sonnenscheindauer Deutschland (ab 1991)',
        xaxis: {
            title: 'Jahr',
            tickmode: 'array',
            tickvals: filtered.map((d, i) => i % 2 === 0 ? d.Jahr : null)
                .filter(v => v !== null),
            fixedrange: true
        },
        yaxis: {
            title: 'Sonnenscheindauer (Stunden)',
            fixedrange: true
        },
        hovermode: 'x unified',
        margin: { t: 50, l: 60, r: 20, b: 50 },
        legend: {
            orientation: "h",
            y : -0.2,
        }
    };

    Plotly.newPlot('sunshine-plot', traces, layout);
}

// Leichter Regenfall-Plot
function makeplot_north_south_rrsfs() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/67ca10c57fc8b04c5e6101ba607608d2846783ff/Data/precipGE10mm_days/regional_averages_rrsfs_year.csv")
        .then(processData_rrsfs)
        .catch(err => console.error("Error loading rain CSV:", err));
}

function processData_rrsfs(data) {
    const regions = ['Deutschland', 'Süd_mean', 'Nord_mean'];
    const filtered = data.filter(row => parseInt(row.Jahr) >= 1991);

    const traces = regions.map(region => ({
        x: filtered.map(d => d.Jahr),
        y: filtered.map(d => parseGermanFloat(d[region])),
        type: 'scatter',
        mode: 'lines+markers',
        name: region === 'Deutschland'   ? 'Deutschland' :
            region === 'Süd_mean'       ? 'Süddeutschland' :
                'Norddeutschland'
    }));

    const layout = {
        title: 'Leichte Regenfalltage Deutschland (ab 1991)',
        xaxis: {
            title: 'Jahr',
            tickmode: 'array',
            tickvals: filtered.map((d, i) => i % 2 === 0 ? d.Jahr : null)
                .filter(v => v !== null),
            fixedrange: true
        },
        yaxis: {
            title: 'Anzahl Tage',
            fixedrange: true

        },
        hovermode: 'x unified',
        margin: { t: 50, l: 60, r: 20, b: 50 },
        legend: {
            orientation: "h",
            y : -0.2,
        }
    };

    Plotly.newPlot('rain_low-plot', traces, layout);
}

// Funktionsaufrufe
makeplot_north_south_temp();
makeplot_north_south_sunshine();
makeplot_north_south_rrsfs();