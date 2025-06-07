var data = [{
    type: "choroplethmap",
    locations: [
        "DE-BB",  // Brandenburg
        "DE-BE",  // Berlin
        "DE-BW",  // Baden-Württemberg
        "DE-BY",  // Bayern
        "DE-HB",  // Bremen
        "DE-HH",  // Hamburg
        "DE-HE",  // Hessen
        "DE-MV",  // Mecklenburg-Vorpommern
        "DE-NI",  // Niedersachsen
        "DE-NW",  // Nordrhein-Westfalen
        "DE-RP",  // Rheinland-Pfalz
        "DE-SH",  // Schleswig-Holstein
        "DE-SL",  // Saarland
        "DE-SN",  // Sachsen
        "DE-ST",  // Sachsen-Anhalt
        "DE-TH"   // Thüringen
    ],
    z: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], // Beispielwerte für die Z-Achse
    featureidkey: "properties.id",
    geojson: "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/3_mittel.geo.json"
}];

var layout = {
    map: {
        center: {
            lon: 10.4515,
            lat: 51.3657
        },
        zoom: 5.1,
        fixedrange: true  // Verschieben und Zoomen deaktiviert
    },
    width: 1200,
    height: 800,
    dragmode: false  // Zusätzlich: Drag-Modus komplett deaktivieren
};

var config = {
    responsive: true,
    displayModeBar: false,  // Modusleiste ausblenden
    staticPlot: false  // Interaktivität deaktivieren
}



Plotly.newPlot('map', data, layout, config);