// Helper-Funktion zum Parsen deutscher Dezimalzahlen
function parseGermanFloat(value) {
    return typeof value === 'string'
        ? parseFloat(value.replace(',', '.'))
        : parseFloat(value);
}

// Gemeinsame Layout-Konfiguration für alle Plots
function createBaseLayout(title, yAxisTitle) {
    return {
        title: title,
        paper_bgcolor: 'rgba(18, 18, 18, 0.9)',
        plot_bgcolor: 'rgba(18, 18, 18, 0.9)',
        xaxis: {
            title: 'Jahr',
            fixedrange: true
        },
        yaxis: {
            title: yAxisTitle,
            fixedrange: true
        },
        hovermode: 'x unified',
        margin: { t: 50, l: 60, r: 20, b: 50 },
        legend: {
            orientation: 'h',
            y: -0.2
        },
        font: {
            color: '#fffafa'
        }
    };
}

// Gemeinsame Funktion zum Erstellen von Traces
function createTraces(filteredData, dataConfig) {
    const regionNames = {
        'Deutschland': 'Deutschland',
        'Süd_mean': 'Süddeutschland',
        'Nord_mean': 'Norddeutschland'
    };

    return dataConfig.regions.map(region => ({
        x: filteredData.map(d => dataConfig.getX(d)),
        y: filteredData.map(d => dataConfig.getY(d, region)),
        type: 'scatter',
        mode: 'lines+markers',
        name: regionNames[region] || region
    }));
}

// Temperatur-Plot
function createTemperaturePlot() {
    const filtered = TEMP_DATA.filter(row => row[0] >= 1991);

    const traces = createTraces(filtered, {
        regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
        getX: d => d[0], // Jahr
        getY: (d, region) => {
            const indices = {
                'Deutschland': 15,
                'Süd_mean': 16,
                'Nord_mean': 17
            };
            return d[indices[region]];
        }
    });

    const layout = createBaseLayout(
        'Temperaturverläufe Deutschland (ab 1991)',
        'Temperatur (°C)'
    );

    // Spezielle Anpassung für Jahr-Ticks (nur jedes zweite Jahr)
    layout.xaxis.tickmode = 'array';
    layout.xaxis.tickvals = filtered
        .map((d, i) => i % 2 === 0 ? d[0] : null)
        .filter(v => v !== null);

    Plotly.newPlot('scatter-main', traces, layout);
}

// Sonnenscheindauer-Plot
function createSunshinePlot() {
    const filtered = SUNSHINE.filter(row => parseInt(row.Jahr) >= 1991);

    const traces = createTraces(filtered, {
        regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
        getX: d => d.Jahr,
        getY: (d, region) => parseGermanFloat(d[region])
    });

    const layout = createBaseLayout(
        'Sonnenscheindauer Deutschland (ab 1991)',
        'Sonnenscheindauer (Stunden)'
    );

    // Jahr-Ticks anpassen
    layout.xaxis.tickmode = 'array';
    layout.xaxis.tickvals = filtered
        .map((d, i) => i % 2 === 0 ? d.Jahr : null)
        .filter(v => v !== null);

    Plotly.newPlot('sunshine-plot', traces, layout);
}

// Leichte Regenfalltage-Plot
function createRainPlot() {
    const filtered = RAIN_10MM.filter(row => parseInt(row.Jahr) >= 1991);

    const traces = createTraces(filtered, {
        regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
        getX: d => d.Jahr,
        getY: (d, region) => parseGermanFloat(d[region])
    });

    const layout = createBaseLayout(
        'Leichte Regenfalltage Deutschland (ab 1991)',
        'Anzahl Tage'
    );

    // Jahr-Ticks anpassen
    layout.xaxis.tickmode = 'array';
    layout.xaxis.tickvals = filtered
        .map((d, i) => i % 2 === 0 ? d.Jahr : null)
        .filter(v => v !== null);

    Plotly.newPlot('rain_low-plot', traces, layout);
}

// Initialisierung aller Plots
function initializeAllPlots() {
    createTemperaturePlot();
    // createSunshinePlot();
    // createRainPlot();
}

// Ausführung
initializeAllPlots();