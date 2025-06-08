const customGrayStyle = {
    "version": 8,
    "sources": {},
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "rgb(35,35,35)"  // Dein Wunsch-Grau!
            }
        }
    ]
};



d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/2_hoch.geo.json")
    .then(geoData => {
        const data = [{

            type: "choroplethmapbox",
            geojson: geoData,
            locations: [
                "DE-BW", "DE-BY", "DE-BE",  "DE-BB", "DE-HB", "DE-HH",
                "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SL","DE-ST","DE-SN",
                 "DE-SH", "DE-TH"
            ],
            z: [8.94, 8.93, 8.22, 7.44, 8.27, 8.42, 8.8, 8.8, 9.01, 8.69, 8.63, 8.46, 9.11, 8.16, 8.8, 7.67],

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
                style: customGrayStyle,          // <-- leerer Basemap-Style
                center: { lon: 10.45, lat: 51.1657 },
                zoom: 5.5
            },
            margin: { t: 30, b: 0, l: 0, r: 0 },
            title: "Deutschlandkarte - Bundesländer",
            // Keine Verschieben der Karte
            dragmode: false,
            plot_bgcolor:"black",
            paper_bgcolor: "rgb(35,35,35)",
            sliders: [{
                pad: {t: 30},
                currentvalue: {
                    xanchor: 'right',
                    prefix: '',
                    font: {
                        color: '#fffafa',
                        size: 20
                    }
                },
                steps: Array.from({ length: 2024 - 1992 + 1 }, (_, i) => {
                    const year = 1992 + i;
                    return {
                        label: year.toString(),
                        method: 'update',
                        args: [{}, { title: `Jahr: ${year}` }]
                    };
                })
            }]
// Transparenter Hintergrund
        };

        Plotly.newPlot("map", data, layout, {
            mapboxAccessToken: "pk.eyJ1IjoibG9uZ2xvbmciLCJhIjoiY2p2cTJqOHp4MDJtdzQ0cDd2d3g4bmE0ZCJ9.Nc3MEjTImTuuj3DDoSpmBA",
            displayModeBar: false,

        });
    });


