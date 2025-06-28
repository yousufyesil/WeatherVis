//Konfiguration und Daten für die interaktive Karte und Diagramme

const CONFIG = {
    mapboxToken: "pk.eyJ1IjoibG9uZ2xvbmciLCJhIjoiY2p2cTJqOHp4MDJtdzQ0cDd2d3g4bmE0ZCJ9.Nc3MEjTImTuuj3DDoSpmBA",
    mapCenter: { lon: 10.45, lat: 51.1657 },
    mapZoom: 5.5,
    mapStyle: {
        version: 8,
        sources: {},
        layers: [{
            id: "background",
            type: "background",
            paint: { "background-color": "rgba(18, 18, 18, 0.9)" }
        }]
    },

    // Bundesländer Codes für die GeoJSON-Daten
    bundeslaenderCodes: [
        "DE-BW", "DE-BY", "DE-BE", "DE-BB", "DE-HB", "DE-HH",
        "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SL",
        "DE-ST", "DE-SN", "DE-SH", "DE-TH"
    ],


    dataSources: {
        temperature: {
            data: TEMP_DATA,
            title: "Temperatur in Deutschland",
            colorscale: "Reds",
            unit: "Temperatur (°C)",
            dtick: 0.5,
            scatterConfig: {
                yAxisTitle: 'Temperatur (°C)',
                regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
                getX: d => d[0],
                getY: (d, region) => d[{ 'Deutschland': 17, 'Süd_mean': 18, 'Nord_mean': 19 }[region]]
            }
        },
        rain: {
            data: RAIN_10MM,
            title: "Niederschlag in Deutschland",
            colorscale: "Blues",
            unit: "Niederschlag (mm/10)",
            reverseScale: true,
            dtick: 3,
            scatterConfig: {
                yAxisTitle: 'Anzahl Tage',
                regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
                getX: d => d[0],
                getY: (d, region) => d[{ 'Deutschland': 17, 'Süd_mean': 18, 'Nord_mean': 19 }[region]]
            }
        },
        sunshine: {
            data: SUNSHINE,
            title: "Sonnenschein in Deutschland",
            colorscale: "YlOrRd",
            unit: "Sonnenstunden",
            reverseScale: true,
            dtick: 100,
            scatterConfig: {
                yAxisTitle: 'Sonnenscheindauer (Stunden)',
                regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
                getX: d => d[0],
                getY: (d, region) => d[{ 'Deutschland': 17, 'Süd_mean': 19, 'Nord_mean': 18 }[region]]
            }
        }
    },
    colors: { font: '#fffafa', background: 'rgba(18, 18, 18, 0.9)', border: '#333', outline: '#444' }
};

const state = {
    currentSource: 'temperature',
    currentYearIndex: 0,
    years: TEMP_DATA.map(row => row[0])
};

function calculateMinMax(data) {
    let min = Infinity, max = -Infinity;
    data.forEach(row => {
        for (let i = 1; i <= 16; i++) {
            const val = row[i];
            if (val != null && !isNaN(val)) {
                min = Math.min(min, val);
                max = Math.max(max, val);
            }
        }
    });
    return { min, max };
}

function initializeDataRanges() {
    Object.keys(CONFIG.dataSources).forEach(key => {
        const { min, max } = calculateMinMax(CONFIG.dataSources[key].data);
        CONFIG.dataSources[key].min = min;
        CONFIG.dataSources[key].max = max;
    });
}

function updateScatterPlot() {
    const source = CONFIG.dataSources[state.currentSource];
    const { scatterConfig } = source;
    const filteredData = source.data.filter(row => row[0] >= 1991);
    const currentYear = state.years[state.currentYearIndex];

    const regionNames = { 'Deutschland': 'Deutschland', 'Süd_mean': 'Süddeutschland', 'Nord_mean': 'Norddeutschland' };

    const traces = scatterConfig.regions.map(region => {
        const validData = filteredData
            .map(d => ({ x: scatterConfig.getX(d), y: scatterConfig.getY(d, region) }))
            .filter(p => p.y != null && !isNaN(p.y));

        return {
            x: validData.map(d => d.x),
            y: validData.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: regionNames[region],
            line: { width: 2 },
            marker: { size: 4 }
        };
    });

    let yMin = Infinity, yMax = -Infinity;
    filteredData.forEach(d => {
        scatterConfig.regions.forEach(r => {
            const val = scatterConfig.getY(d, r);
            if (val != null && !isNaN(val)) {
                yMin = Math.min(yMin, val);
                yMax = Math.max(yMax, val);
            }
        });
    });

    const range = yMax - yMin;
    traces.push({
        x: [currentYear, currentYear],
        y: [yMin - range * 0.1, yMax + range * 0.1],
        type: 'scatter',
        mode: 'lines',
        name: `Aktuelles Jahr: ${currentYear}`,
        line: { color: 'red', width: 2, dash: 'dash' },
        showlegend: true
    });

    const layout = {
        title: `${source.title} - Zeitverlauf (ab 1991)`,
        paper_bgcolor: CONFIG.colors.background,
        plot_bgcolor: CONFIG.colors.background,
        xaxis: {
            title: 'Jahr',
            fixedrange: true,
            color: CONFIG.colors.font,
            tickmode: 'array',
            tickvals: filteredData.filter((_, i) => i % 2 === 0).map(d => scatterConfig.getX(d))
        },
        yaxis: { title: scatterConfig.yAxisTitle, fixedrange: true, color: CONFIG.colors.font },
        hovermode: 'x unified',
        margin: { t: 50, l: 60, r: 20, b: 50 },
        legend: { orientation: 'h', y: -0.2, font: { color: CONFIG.colors.font } },
        font: { color: CONFIG.colors.font }
    };

    const el = document.getElementById('scatter-plot');
    el?.data ? Plotly.react('scatter-plot', traces, layout) : Plotly.newPlot('scatter-plot', traces, layout, { displayModeBar: false });
}

function updateMap() {
    const source = CONFIG.dataSources[state.currentSource];
    const yearData = [];
    for (let i = 1; i <= 16; i++) yearData.push(source.data[state.currentYearIndex][i]);

    Plotly.update('map',
        {
            z: [yearData],
            zmin: source.min,
            zmax: source.max,
            colorscale: source.colorscale,
            reversescale: source.reverseScale || false,
            'colorbar': {
                title: { text: source.unit, font: { color: CONFIG.colors.font, size: 12 } },
                thickness: 20,
                len: 0.7,
                x: 0.95,
                xanchor: 'left',
                titleside: 'right',
                tickmode: 'linear',
                tick0: Math.floor(source.min),
                dtick: source.dtick,
                tickfont: { color: CONFIG.colors.font, size: 12 },
                tickcolor: CONFIG.colors.font,
                outlinecolor: CONFIG.colors.outline,
                outlinewidth: 1
            }
        },
        {
            'title.text': `<b>${source.title} - Jahr: ${state.years[state.currentYearIndex]}</b>`,
            'margin.r': source === CONFIG.dataSources.rain ? 40 : 10
        },
        [0]
    );
}

function updateBoth() {
    updateMap();
    updateScatterPlot();
}

// Asynchrone Funktion, da die Daten von externen Quellen geladen werden
async function initializeApp() {
    initializeDataRanges();

    // Laden der GeoJSON-Daten
    const geoData = await d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/2_hoch.geo.json");
    const initSrc = CONFIG.dataSources.temperature;

    const yearData = [];
    for (let i = 1; i <= 16; i++) yearData.push(initSrc.data[0][i]);



    await Plotly.newPlot("map", [{
        type: "choroplethmapbox",
        geojson: geoData,
        locations: CONFIG.bundeslaenderCodes,
        z: yearData,
        featureidkey: "properties.id",
        text: geoData.features.map(f => f.properties.name),
        zmin: initSrc.min,
        zmax: initSrc.max,
        colorscale: initSrc.colorscale,
        marker: { line: { width: 0.5, color: CONFIG.colors.border } },
        showscale: true,
        colorbar: {
            title: { text: initSrc.unit, font: { color: CONFIG.colors.font, size: 12 } },
            thickness: 20,
            len: 0.7,
            x: 0.95,
            xanchor: 'left',
            titleside: 'right',
            tickmode: 'linear',
            tick0: Math.floor(initSrc.min),
            dtick: initSrc.dtick,
            tickfont: { color: CONFIG.colors.font, size: 12 },
            tickcolor: CONFIG.colors.font,
            outlinecolor: CONFIG.colors.outline,
            outlinewidth: 1
        }
    }], {
        mapbox: { style: CONFIG.mapStyle, center: CONFIG.mapCenter, zoom: CONFIG.mapZoom },
        margin: { t: 50, b: 80, l: 10, r: 10 },
        title: { text: `<b>${initSrc.title} - Jahr: ${state.years[0]}</b>`, font: { color: CONFIG.colors.font, size: 24 } },
        dragmode: false,
        plot_bgcolor: "black",
        paper_bgcolor: CONFIG.colors.background,
        sliders: [{
            y: 0.1,
            pad: { t: 30 },
            currentvalue: { xanchor: 'right', prefix: 'Jahr: ', font: { color: CONFIG.colors.font, size: 20 } },
            steps: state.years.map(y => ({ label: y.toString(), method: 'skip', args: [] }))
        }],
        updatemenus: [{
            type: 'buttons',
            direction: 'right',
            x: 0.5,
            y: -0.05,
            pad: { l: 10, r: 10, t: 5, b: 5 },
            buttons: [
                { label: 'Temperatur', method: 'skip', args: [] },
                { label: 'Niederschlag', method: 'skip', args: [] },
                { label: 'Sonnenschein', method: 'skip', args: [] }
            ]
        }]
    }, { mapboxAccessToken: CONFIG.mapboxToken, displayModeBar: false, dragMode: false });

    const map = document.getElementById('map');
    map.on('plotly_sliderchange', e => {
        state.currentYearIndex = e.slider.active;
        updateBoth();
    });

    map.on('plotly_buttonclicked', e => {
        const mapping = { 'Temperatur': 'temperature', 'Niederschlag': 'rain', 'Sonnenschein': 'sunshine' };
        if (mapping[e.button.label]) {
            state.currentSource = mapping[e.button.label];
            updateBoth();
        }
    });

    setTimeout(() => {
        const m = map?._fullLayout?.mapbox?._subplot?.map;
        if (m) {
            ['dragPan', 'scrollZoom', 'boxZoom', 'dragRotate', 'doubleClickZoom', 'touchZoomRotate'].forEach(i => m[i].disable());
        }
    }, 300);

    updateScatterPlot();
}

// Initialisierung der Anwendung
initializeApp();