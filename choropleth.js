const stateNames = {
    "DE-BB": "Brandenburg",
    "DE-BE": "Berlin",
    "DE-BW": "Baden-Württemberg",
    "DE-BY": "Bayern",
    "DE-HB": "Bremen",
    "DE-HH": "Hamburg",
    "DE-HE": "Hessen",
    "DE-MV": "Mecklenburg-Vorpommern",
    "DE-NI": "Niedersachsen",
    "DE-NW": "Nordrhein-Westfalen",
    "DE-RP": "Rheinland-Pfalz",
    "DE-SH": "Schleswig-Holstein",
    "DE-SL": "Saarland",
    "DE-SN": "Sachsen",
    "DE-ST": "Sachsen-Anhalt",
    "DE-TH": "Thüringen"
}


function get_tp() {
    // Rückgabe des Promise
    return d3.dsv(
        ";",
        "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv"
    );
}

function sunshine_data() {
    // Rückgabe des Promise
    return d3.dsv(
        ";",
        "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/sunshine_duration/regional_averages_sd_year.csv"
    );
}
function get_rain() {
    // Rückgabe des Promise
    return d3.dsv(
        ";",
        "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/precipGE10mm_days/regional_averages_rrsfs_year.csv"
    );
}

function processData_temp(data) {
    let dataFiltered = data.filter(row => parseInt(row.Jahr) >= 1992);

}



var data = [{
    type: "choroplethmap",
    locations: [
        "DE-BB", "DE-BE", "DE-BW", "DE-BY", "DE-HB", "DE-HH",
        "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SH",
        "DE-SL", "DE-SN", "DE-ST", "DE-TH"
    ],
    z: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    featureidkey: "properties.id",
    geojson: "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/3_mittel.geo.json"
}];

var layout = {
    geo: {
        // Basiskarte komplett ausblenden
        showcoastlines: false,
        showland: false,
        showocean: false,
        showlakes: false,
        showrivers: false,
        showcountries: false,
        showsubunits: false,

        // Automatisch auf Ihre geoJSON-Daten zoomen
        fitbounds: 'geojson',

        // Weißer Hintergrund
        bgcolor: 'white',

        // Optional: Rahmen
        framecolor: '#ddd',
        framewidth: 1
    },

    width: 1000,
    height: 800,
    dragmode: 'pan',

    // Slider mit direkten Dummy-Werten
    sliders: [{
        active: 0,
        currentvalue: {
            prefix: "Jahr: ",
            visible: true,
            xanchor: "right"
        },
        pad: {t: 50},
        steps: Array.from({length: 2024-1992+1}, (_, i) => {
            const year = 1992 + i;
            return {
                label: year.toString(),
                method: "update",
                args: [
                    // Einfache Dummy-Werte: Jahr beeinflusst die Werte
                    {z: [[10 + i*0.1, 12 + i*0.1, 8 + i*0.1, 15 + i*0.1, 11 + i*0.1, 13 + i*0.1, 9 + i*0.1, 14 + i*0.1, 10 + i*0.1, 12 + i*0.1, 7 + i*0.1, 16 + i*0.1, 11 + i*0.1, 13 + i*0.1, 8 + i*0.1, 15 + i*0.1]]},
                    {} // Keine Layout-Änderungen
                ]
            };
        })
    }],

    // Buttons für verschiedene Metriken
    updatemenus: [{
        pad: {t: 60, r: 30},
        type: 'buttons',
        xanchor: 'left',
        yanchor: 'top',
        x: 0,
        y: 1.15,
        direction: 'right',
        buttons: [{
            label: 'Temperatur',
            method: 'update',
            args: [
                {
                    z: [[10, 12, 8, 15, 11, 13, 9, 14, 10, 12, 7, 16, 11, 13, 8, 15]], // 16 Dummy-Werte für alle Bundesländer
                    colorscale: 'Reds',
                    colorbar: {title: '°C'}
                }
            ]
        }, {
            label: 'Sonnenstunden',
            method: 'update',
            args: [
                {
                    z: [[1650, 1700, 1800, 1750, 1600, 1850, 1700, 1650, 1800, 1750, 1600, 1900, 1650, 1700, 1800, 1750]],
                    colorscale: 'Oranges',
                    colorbar: {title: 'Stunden'}
                }
            ]
        }, {
            label: 'Niederschlag',
            method: 'update',
            args: [
                {
                    z: [[650, 700, 550, 800, 600, 750, 700, 650, 550, 800, 600, 900, 650, 700, 550, 800]],
                    colorscale: 'Blues',
                    colorbar: {title: 'mm'}
                }
            ]
        }]
    }]
};

var config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false
};

Plotly.newPlot('map', data, layout, config);
