// ===== KONFIGURATION =====

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

    // Datenquellen
    dataSources: {
        temperature: {
            data: TEMP_DATA,
            title: "Temperatur in Deutschland",
            colorscale: "Thermal",
            unit: "Temperatur (°C)",
            dtick: 0.5
        },
        rain: {
            data: RAIN_10MM,
            title: "Niederschlag in Deutschland",
            colorscale: "Blues",
            unit: "Niederschlag (mm/10)",
            dtick: 3
        },
        sunshine: {
            data: SUNSHINE,
            title: "Sonnenschein in Deutschland",
            colorscale: "YlOrBr",
            unit: "Sonnenstunden",
            dtick: 100
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

// ===== GLOBALER ZUSTAND =====

const state = {
    currentSource: 'temperature',
    currentYearIndex: 0,
    years: TEMP_DATA.map(row => row[0])
};

// ===== HILFSFUNKTIONEN =====

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

// ===== UI-ERSTELLUNG =====

// Erstellt die Colorbar-Konfiguration
function createColorbar(source) {
    return {
        title: {
            text: source.unit,
            font: { color: CONFIG.colors.font }
        },
        thickness: 20,
        len: 0.7,
        x: 0.95,
        xanchor: 'left',
        titleside: 'right',
        tickmode: 'linear',
        tick0: Math.floor(source.min),
        dtick: source.dtick,
        tickfont: { color: CONFIG.colors.font },
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
    return {
        mapbox: {
            style: CONFIG.mapStyle,
            center: CONFIG.mapCenter,
            zoom: CONFIG.mapZoom
        },
        margin: { t: 50, b: 80, l: 10, r: 10 },
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
                args: [

                ]
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

// ===== KARTEN-FUNKTIONEN =====

// Aktualisiert die Karte mit neuen Daten
function updateMap() {
    const source = CONFIG.dataSources[state.currentSource];
    const yearData = getYearData(source.data, state.currentYearIndex);
    const year = state.years[state.currentYearIndex];

    Plotly.update('map',
        {
            z: [yearData],
            zmin: source.min,
            zmax: source.max,
            colorscale: source.colorscale,
            colorbar: createColorbar(source)
        },
        {
            'title.text': `<b>${source.title} - Jahr: ${year}</b>`
        }
    );
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
        updateMap();
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
            updateMap();
        }
    });
}

// ===== INITIALISIERUNG =====

// Hauptfunktion zum Initialisieren der Karte
async function initializeMap() {
    try {
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

    } catch (error) {
        console.error("Fehler beim Laden der Karte:", error);
    }
}

// Starte die Anwendung
initializeMap();