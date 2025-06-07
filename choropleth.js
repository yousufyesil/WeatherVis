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

function get_sd() {
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
    geo: {  // ✅ Korrektur: "geo" statt "map"
        center: {
            lon: 10.4515,
            lat: 51.3657
        },
        zoom: 15,
        fixedrange: true
    },
    width: 1200,
    height: 800,
    dragmode: false,

    // ✅ Slider hinzugefügt
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
                    Array.from({length: 16}, (_, j) => j + 1), // Dummy data for z values
                ]
            };
        })
    }]
};

var config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false
};

Plotly.newPlot('map', data, layout, config);