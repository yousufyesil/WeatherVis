const CONFIG = {
    // Mapbox-Einstellungen
    mapboxToken: "pk.eyJ1IjoibG9uZ2xvbmciLCJhIjoiY2p2cTJqOHp4MDJtdzQ0cDd2d3g4bmE0ZCJ9.Nc3MEjTImTuuj3DDoSpmBA",
    mapCenter: { lon: 10.45, lat: 51.1657 },
    mapZoom: 5.5,
    mapStyle: {
        version: 8,
        sources: {},
        layers: [{
            id: "background",
            type: "background",
            paint: {
                "background-color": "rgba(18, 18, 18, 0.9)"
            }
        }]
    },

    // Bundesländer ISO-Codes
    bundeslaenderCodes: [
        "DE-BW", "DE-BY", "DE-BE", "DE-BB", "DE-HB", "DE-HH",
        "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SL",
        "DE-ST", "DE-SN", "DE-SH", "DE-TH"
    ],


    // Datenquellen (erweitert für Scatter-Plots)
    dataSources: {
        temperature: {
            data: TEMP_DATA,
            title: "Temperatur in Deutschland",
            colorscale: "Reds",  // Gelb → Orange → Rot
            unit: "Temperatur (°C)",
            dtick: 0.5,
            scatterConfig: {
                yAxisTitle: 'Temperatur (°C)',
                regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
                getX: d => d[0], // Jahr
                getY: (d, region) => {
                    const indices = {
                        'Deutschland': 17,
                        'Süd_mean': 18,
                        'Nord_mean': 19
                    };
                    return d[indices[region]];
                }
            }
        },
        rain: {
            data: RAIN_10MM,
            title: "Niederschlag in Deutschland",
            colorscale: "Blues",
            unit: "Niederschlag (mm/10)",
            reverseScale: true,  // <-- HINZUFÜGEN
            dtick: 3,
            scatterConfig: {
                yAxisTitle: 'Anzahl Tage',
                regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
                getX: d => d[0], // Jahr ist der erste Wert im Array
                getY: (d, region) => {
                    // Debug-Ausgabe nur beim ersten Aufruf
                    if (typeof window.rainDebugLogged === 'undefined') {
                        console.log('Rain data sample:', d);
                        console.log('Array length:', d.length);
                        window.rainDebugLogged = true;
                    }

                    // Für rain data: Array-Indizes verwenden wie bei temperature
                    const indices = {
                        'Deutschland': 17,  // Spalte 18
                        'Süd_mean': 18,     // Spalte 20
                        'Nord_mean': 19     // Spalte 19
                    };

                    const value = d[indices[region]];

                    if (value !== undefined && value !== null && !isNaN(value)) {
                        return parseFloat(value);
                    }

                    console.warn(`Kein Wert für ${region} in rain data gefunden. Index: ${indices[region]}, Wert: ${value}`);
                    return null;
                }
            }
        },
        sunshine: {
            data: SUNSHINE,
            title: "Sonnenschein in Deutschland",
            colorscale: "YlOrRd",  // Gelb → Orange → Braun
            unit: "Sonnenstunden",
            reverseScale: true,
            dtick: 100,
            scatterConfig: {
                yAxisTitle: 'Sonnenscheindauer (Stunden)',
                regions: ['Deutschland', 'Süd_mean', 'Nord_mean'],
                getX: d => d[0], // Jahr ist der erste Wert im Array
                getY: (d, region) => {
                    // Debug-Ausgabe nur beim ersten Aufruf
                    if (typeof window.sunshineDebugLogged === 'undefined') {
                        console.log('Sunshine data sample:', d);
                        console.log('Array length:', d.length);
                        window.sunshineDebugLogged = true;
                    }

                    // Für sunshine data: Array-Indizes verwenden wie bei temperature
                    const indices = {
                        'Deutschland': 17,  // Spalte 18
                        'Süd_mean': 19,     // Spalte 20
                        'Nord_mean': 18     // Spalte 19
                    };

                    const value = d[indices[region]];

                    if (value !== undefined && value !== null && !isNaN(value)) {
                        return parseFloat(value);
                    }

                    console.warn(`Kein Wert für ${region} in sunshine data gefunden. Index: ${indices[region]}, Wert: ${value}`);
                    return null;
                }
            }
        }
    },

    // Farben und Styling
    colors: {
        font: '#fffafa',
        background: 'rgba(18, 18, 18, 0.9)',
        border: '#333',
        outline: '#444'
    }
};
//
//TODO : Deutschland Daten von SW
// ===== GLOBALER ZUSTAND =====

const state = {
    currentSource: 'temperature',
    currentYearIndex: 0,
    years: TEMP_DATA.map(row => row[0])
};

// ===== HILFSFUNKTIONEN =====

// Helper-Funktion zum Parsen deutscher Dezimalzahlen
function parseGermanFloat(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    return typeof value === 'string'
        ? parseFloat(value.replace(',', '.'))
        : parseFloat(value);
}

// Berechnet Min/Max-Werte für einen Datensatz
function calculateMinMax(data) {
    let min = Infinity;
    let max = -Infinity;

    data.forEach(row => {
        // Spalten 1-16 enthalten die Bundesländer-Daten
        for (let i = 1; i <= 16; i++) {
            const value = row[i];
            if (value !== undefined && value !== null && !isNaN(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
    });

    return { min, max };
}

// Extrahiert Daten für ein bestimmtes Jahr
function getYearData(dataset, yearIndex) {
    const yearData = [];
    for (let i = 1; i <= 16; i++) {
        yearData.push(dataset[yearIndex][i]);
    }
    return yearData;
}

// Initialisiert Min/Max für alle Datenquellen
function initializeDataRanges() {
    Object.keys(CONFIG.dataSources).forEach(key => {
        const source = CONFIG.dataSources[key];
        const { min, max } = calculateMinMax(source.data);
        source.min = min;
        source.max = max;
    });
}

// ===== SCATTER-PLOT-FUNKTIONEN =====

// Gemeinsame Layout-Konfiguration für Scatter-Plots
function createScatterLayout(title, yAxisTitle) {
    return {
        title: title,
        paper_bgcolor: 'rgba(18, 18, 18, 0.9)',
        plot_bgcolor: 'rgba(18, 18, 18, 0.9)',
        xaxis: {
            title: 'Jahr',
            fixedrange: true,
            color: CONFIG.colors.font
        },
        yaxis: {
            title: yAxisTitle,
            fixedrange: true,
            color: CONFIG.colors.font
        },
        hovermode: 'x unified',
        margin: { t: 50, l: 60, r: 20, b: 50 },
        legend: {
            orientation: 'h',
            y: -0.2,
            font: { color: CONFIG.colors.font }
        },
        font: {
            color: CONFIG.colors.font
        }
    };
}

// Erstellt Traces für Scatter-Plots
function createScatterTraces(filteredData, scatterConfig, currentYear = null) {
    // Debug: Datenstruktur untersuchen
    if (filteredData.length > 0) {
        console.log(`Erstelle Scatter-Traces für ${state.currentSource}`);
        console.log('Erste Datenzeile:', filteredData[0]);
        console.log('Anzahl Datenzeilen:', filteredData.length);
    }

    const regionNames = {
        'Deutschland': 'Deutschland',
        'Süd_mean': 'Süddeutschland',
        'Nord_mean': 'Norddeutschland'
    };

    const traces = scatterConfig.regions.map(region => {
        const xData = filteredData.map(d => scatterConfig.getX(d));
        const yData = filteredData.map(d => scatterConfig.getY(d, region));

        // Filtere null-Werte heraus
        const validData = xData.map((x, i) => ({ x, y: yData[i] }))
            .filter(point => point.y !== null && point.y !== undefined && !isNaN(point.y));

        if (validData.length === 0) {
            console.error(`Keine gültigen Daten für ${region} gefunden!`);
        } else {
            console.log(`${region}: ${validData.length} gültige Datenpunkte gefunden`);
        }

        return {
            x: validData.map(d => d.x),
            y: validData.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: regionNames[region] || region,
            line: { width: 2 },
            marker: { size: 4 }
        };
    });

    // Füge eine vertikale Linie für das aktuelle Jahr hinzu, falls angegeben
    if (currentYear !== null) {
        const yRange = getYRangeForData(filteredData, scatterConfig);
        if (yRange.min !== Infinity && yRange.max !== -Infinity) {
            traces.push({
                x: [currentYear, currentYear],
                y: [yRange.min, yRange.max],
                type: 'scatter',
                mode: 'lines',
                name: `Aktuelles Jahr: ${currentYear}`,
                line: {
                    color: 'red',
                    width: 2,
                    dash: 'dash'
                },
                showlegend: true
            });
        }
    }

    return traces;
}

// Hilfsfunktion um Y-Bereich für Daten zu berechnen
function getYRangeForData(filteredData, scatterConfig) {
    let min = Infinity;
    let max = -Infinity;

    filteredData.forEach(d => {
        scatterConfig.regions.forEach(region => {
            const value = scatterConfig.getY(d, region);
            if (value !== undefined && value !== null && !isNaN(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        });
    });

    // Etwas Puffer hinzufügen
    const range = max - min;
    return {
        min: min - range * 0.1,
        max: max + range * 0.1
    };
}

// Filtert Daten ab 1991 für Scatter-Plots
function filterDataFrom1991(data, isTemperatureData = false) {
    // Alle Datentypen verwenden jetzt das Array-Format
    return data.filter(row => row[0] >= 1991);
}

// Erstellt oder aktualisiert Scatter-Plot für aktuelle Datenquelle
function updateScatterPlot() {
    const source = CONFIG.dataSources[state.currentSource];
    const scatterConfig = source.scatterConfig;

    if (!scatterConfig) {
        console.warn(`Keine Scatter-Konfiguration für ${state.currentSource} gefunden`);
        return;
    }

    console.log(`Aktualisiere Scatter-Plot für ${state.currentSource}`);

    const isTemperatureData = state.currentSource === 'temperature';
    const filteredData = filterDataFrom1991(source.data, isTemperatureData);

    console.log(`Gefilterte Daten (ab 1991): ${filteredData.length} Einträge`);

    // Aktuelles Jahr aus State ermitteln
    const currentYear = state.years[state.currentYearIndex];

    const traces = createScatterTraces(filteredData, scatterConfig, currentYear);
    const layout = createScatterLayout(
        `${source.title} - Zeitverlauf (ab 1991)`,
        scatterConfig.yAxisTitle
    );

    // Jahr-Ticks anpassen (nur jedes zweite Jahr)
    layout.xaxis.tickmode = 'array';
    layout.xaxis.tickvals = filteredData
        .map((d, i) => i % 2 === 0 ? scatterConfig.getX(d) : null)
        .filter(v => v !== null);

    // Prüfe ob Plot bereits existiert
    const scatterElement = document.getElementById('scatter-plot');
    if (scatterElement && scatterElement.data) {
        Plotly.react('scatter-plot', traces, layout);
    } else {
        Plotly.newPlot('scatter-plot', traces, layout, {
            displayModeBar: false
        });
    }
}

// ===== KARTEN-FUNKTIONEN =====

// Erstellt die Colorbar-Konfiguration
function createColorbar(source) {
    // Dynamische Anpassung basierend auf der Datenquelle
    let xPosition = 0.95;
    let thickness = 20;
    let tickFontSize = 12;

    // Spezielle Anpassungen für rain-Daten
    if (source === CONFIG.dataSources.rain) {
        xPosition = 0.95;     // Weiter links positionieren
        thickness = 20;       // Schmaler machen
        tickFontSize = 12;    // Kleinere Schrift
    }

    return {
        title: {
            text: source.unit,
            font: { color: CONFIG.colors.font, size: 12 }
        },
        thickness: thickness,
        len: 0.7,
        x: xPosition,
        xanchor: 'left',
        titleside: 'right',
        tickmode: 'linear',
        tick0: Math.floor(source.min),
        dtick: source.dtick,
        tickfont: {
            color: CONFIG.colors.font,
            size: tickFontSize
        },
        tickcolor: CONFIG.colors.font,
        outlinecolor: CONFIG.colors.outline,
        outlinewidth: 1
    };
}

// Erstellt die Plotly-Daten für die Karte
function createMapData(geoData, source, yearIndex) {
    return [{
        type: "choroplethmapbox",
        geojson: geoData,
        locations: CONFIG.bundeslaenderCodes,
        z: getYearData(source.data, yearIndex),
        featureidkey: "properties.id",
        text: geoData.features.map(f => f.properties.name),
        zmin: source.min,
        zmax: source.max,
        colorscale: source.colorscale,
        reversescale: source.reverseScale || false,  // <-- HIER HINZUFÜGEN
        marker: {
            line: {
                width: 0.5,
                color: CONFIG.colors.border
            }
        },
        showscale: true,
        colorbar: createColorbar(source)
    }];
}

// Erstellt das Layout für die Karte
function createLayout(source, year) {
    // Dynamische Margins basierend auf Datenquelle
    let rightMargin = 10;
    if (source === CONFIG.dataSources.rain) {
        rightMargin = 40;  // Mehr Platz rechts für die rain-Colorbar
    }

    return {
        mapbox: {
            style: CONFIG.mapStyle,
            center: CONFIG.mapCenter,
            zoom: CONFIG.mapZoom
        },
        margin: { t: 50, b: 80, l: 10, r: rightMargin },
        title: {
            text: `<b>${source.title} - Jahr: ${year}</b>`,
            font: { color: CONFIG.colors.font, size: 24 }
        },
        dragmode: false,
        plot_bgcolor: "black",
        paper_bgcolor: CONFIG.colors.background,

        // Jahres-Slider
        sliders: [{
            y: 0.1,
            pad: { t: 30 },
            currentvalue: {
                xanchor: 'right',
                prefix: 'Jahr: ',
                font: {
                    color: CONFIG.colors.font,
                    size: 20
                },
            },
            steps: state.years.map(year => ({
                label: year.toString(),
                method: 'skip',
                args: []
            }))
        }],

        // Datenquellen-Buttons
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
    };
}

// Aktualisiert die Karte mit neuen Daten
function updateMap() {
    const source = CONFIG.dataSources[state.currentSource];
    const yearData = getYearData(source.data, state.currentYearIndex);
    const year = state.years[state.currentYearIndex];

    // Dynamische Margin-Berechnung für Update
    let rightMargin = 10;
    if (source === CONFIG.dataSources.rain) {
        rightMargin = 40;
    }

    Plotly.update('map',
        {
            z: [yearData],
            zmin: source.min,
            zmax: source.max,
            colorscale: source.colorscale,
            reversescale: source.reverseScale || false,  // <-- AUCH HIER HINZUFÜGEN
            autocolorscale: false,
            'colorbar': createColorbar(source)
        },
        {
            'title.text': `<b>${source.title} - Jahr: ${year}</b>`,
            'margin.r': rightMargin  // Margin auch beim Update anpassen
        },
        [0]
    );
}

// Aktualisiert sowohl Karte als auch Scatter-Plot
function updateBothVisualizations() {
    updateMap();
    updateScatterPlot();
}

// Deaktiviert alle Karten-Interaktionen
function disableMapInteractions() {
    setTimeout(() => {
        const gd = document.getElementById('map');
        const mapboxMap = gd?._fullLayout?.mapbox?._subplot?.map;

        if (mapboxMap) {
            mapboxMap.dragPan.disable();
            mapboxMap.scrollZoom.disable();
            mapboxMap.boxZoom.disable();
            mapboxMap.dragRotate.disable();
            mapboxMap.doubleClickZoom.disable();
            mapboxMap.touchZoomRotate.disable();
        }
    }, 300);
}

// Setup Event-Handler für Slider und Buttons
function setupEventHandlers() {
    const mapElement = document.getElementById('map');

    // Slider-Events
    mapElement.on('plotly_sliderchange', (eventData) => {
        state.currentYearIndex = eventData.slider.active;
        updateBothVisualizations();
    });

    // Button-Events
    mapElement.on('plotly_buttonclicked', (eventData) => {
        const buttonLabel = eventData.button.label;

        const sourceMapping = {
            'Temperatur': 'temperature',
            'Niederschlag': 'rain',
            'Sonnenschein': 'sunshine'
        };

        if (sourceMapping[buttonLabel]) {
            state.currentSource = sourceMapping[buttonLabel];
            updateBothVisualizations();
        }
    });
}

// ===== INITIALISIERUNG =====

// Hauptfunktion zum Initialisieren der Anwendung
async function initializeApp() {
    try {
        // Debug: Datenstrukturen überprüfen
        console.log('=== Datenstruktur-Check ===');
        console.log('Temperature data sample:', TEMP_DATA[0]);
        console.log('Rain data sample:', RAIN_10MM[0]);
        console.log('Sunshine data sample:', SUNSHINE[0]);

        // Datenbereichere vorberechnen
        initializeDataRanges();

        // GeoJSON laden
        const geoData = await d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/2_hoch.geo.json");

        // Initiale Datenquelle
        const initialSource = CONFIG.dataSources.temperature;

        // Plotly-Konfiguration
        const plotlyConfig = {
            mapboxAccessToken: CONFIG.mapboxToken,
            displayModeBar: false,
            dragMode: false
        };

        // Karte erstellen
        const data = createMapData(geoData, initialSource, 0);
        const layout = createLayout(initialSource, state.years[0]);

        await Plotly.newPlot("map", data, layout, plotlyConfig);

        // Event-Handler einrichten
        setupEventHandlers();

        // Interaktionen deaktivieren
        disableMapInteractions();

        // Scatter-Plot initialisieren
        updateScatterPlot();

        console.log("Anwendung erfolgreich initialisiert!");

    } catch (error) {
        console.error("Fehler beim Laden der Anwendung:", error);
    }
}

// Starte die Anwendung
initializeApp();