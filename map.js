d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/2_hoch.geo.json")
    .then(geoData => {
        const data = [{

            type: "choroplethmapbox",
            geojson: geoData,
            locations: [
                "DE-BB", "DE-BE", "DE-BW", "DE-BY", "DE-HB", "DE-HH",
                "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SH",
                "DE-SL", "DE-SN", "DE-ST", "DE-TH"
            ],
            z: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],

            // DAS IST DER SCHLÜSSEL!
            featureidkey: "properties.id",  // ← Hier war das Problem!

            text: geoData.features.map(f => f.properties.name),
            colorscale: "Blues",
            marker: { line: { width: 0.5, color: "#333" } },
            showscale: false,
            colorbar: {
                title: "Wert",
                thickness: 15
            }

        }];

        const layout = {

            mapbox: {
                style: "white-bg",          // <-- leerer Basemap-Style
                center: { lon: 10.45, lat: 51.1657 },
                zoom: 5
            },
            margin: { t: 30, b: 0, l: 0, r: 0 },
            title: "Deutschlandkarte - Bundesländer",
            // Keine Verschieben der Karte
            dragmode: false,
        };

        Plotly.newPlot("map", data, layout, {
            mapboxAccessToken: "pk.eyJ1IjoibG9uZ2xvbmciLCJhIjoiY2p2cTJqOHp4MDJtdzQ0cDd2d3g4bmE0ZCJ9.Nc3MEjTImTuuj3DDoSpmBA",
            displayModeBar: false // Diese Zeile blendet die Modusleiste aus

        });
    });