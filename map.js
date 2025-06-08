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


Promise.all([
    temperature_state(),
    sunshine_state(),
    d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/2_hoch.geo.json")])
    .then(([tempData, sunshineData, geoData]) => {
        // Berechne ALLE möglichen z-Werte für ALLE Jahre
        const baseZValues = tempData[10].slice(1).map(v => parseFloat(v.replace(",", ".")));
        const allZValues = [];

        // Sammle alle z-Werte über alle Jahre
        for (let i = 0; i < 2024 - 1992 + 1; i++) {
            const yearValues = baseZValues.map(val => parseFloat((val + i * 0.1).toFixed(2)));
            allZValues.push(...yearValues);
        }

        // Berechne globale Min/Max-Werte für feste Farbskala
        const globalMin = Math.min(...allZValues);
        const globalMax = Math.max(...allZValues);

        console.log(`Werte-Bereich: ${globalMin} bis ${globalMax}`);

        const zValues = tempData[10].slice(1).map(v => parseFloat(v.replace(",", ".")));
        const data = [{

            type: "choroplethmapbox",
            geojson: geoData,
            locations: [
                "DE-BW", "DE-BY", "DE-BE",  "DE-BB", "DE-HB", "DE-HH",
                "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SL","DE-ST","DE-SN",
                 "DE-SH", "DE-TH"
            ],
            z: zValues,

            // DAS IST DER SCHLÜSSEL!
            featureidkey: "properties.id",  // ← Hier war das Problem!

            text: geoData.features.map(f => f.properties.name),
            colorscale: "Reds",
            marker: { line: { width: 0.5, color: "#333" } },
            showscale: true,
            colorbar: {
                title: "Wert",
                thickness: 15
            },
            zmin: globalMin,
            zmax: globalMax,

        }];

        const layout = {
    mapbox: {
        style: customGrayStyle,
        center: { lon: 10.45, lat: 51.1657 },
        zoom: 5.5
    },
    margin: { t: 30, b: 0, l: 0, r: 0 },
    title: "Deutschlandkarte - Bundesländer", // Initialer Titel
    dragmode: false,
    plot_bgcolor:"black",
    paper_bgcolor: "rgb(35,35,35)",
    sliders: [{
        pad: {t: 30},
        active: 0, // Startet den Slider beim ersten Wert (Jahr 1992)
        currentvalue: {
            xanchor: 'right',
            prefix: 'Jahr: ', // Prefix für den angezeigten Wert des Sliders
            font: {
                color: '#fffafa',
                size: 20
            },
            visible: true
        },
        steps: Array.from({ length: 2024 - 1992 + 1 }, (_, i) => {
            const year = 1992 + i;
            // Die ursprünglichen zValues werden hier im Scope der `steps`-Erstellung benötigt
            // Diese zValues sind die Basis für das Jahr 1992.
            const baseZValues = tempData[10].slice(1).map(v => parseFloat(v.replace(",", ".")));

            return {
                label: year.toString(),
                method: 'update',
                args: [
                    { // Erstes Argument: data_update
                        z: [ // z-Werte müssen als Array von Arrays übergeben werden (ein Array pro Trace)
                            Array.from({ length: 16 }, (_, j) => {
                                // Berechne neue z-Werte basierend auf dem Basisjahr und dem Index i
                                return parseFloat((baseZValues[j] + i * 0.1).toFixed(2));
                            })
                        ]
                    },
                    { // Zweites Argument: layout_update
                        // Aktualisiert den Haupttitel der Karte
                        title: `Deutschlandkarte - Bundesländer - Jahr: ${year}`
                    }
                ]
            };
        })

    }],
    updatemenus: [{
        type: 'buttons',
        x: 0.1,
        y: 1.15,
        buttons: [{
            label: 'Temperatur',
            method: 'update',
            args: [
                {
                    z: [zValues], // z-Werte für Temperatur
                    colorscale: 'Reds',
                    colorbar: { title: '°C' }
                },
                { title: 'Deutschlandkarte - Bundesländer - Temperatur' } // Aktualisiert den Titel
            ]
        }, {
            label: 'Sonnenschein',
            method: 'update',
            args: [
                {
                    z: sunshineData[10].slice(1).map(v => parseFloat(v.replace(",", "."))), // z-Werte für Sonnenschein
                    colorscale: 'YlOrBr',
                    colorbar: { title: 'Stunden' }
                },
                { title: 'Deutschlandkarte - Bundesländer - Sonnenschein' } // Aktualisiert den Titel
            ]
        }]
    }] // Korrekt geschlossen: '}' für das Objekt im Array, ']' für das Array selbst
};
        Plotly.newPlot("map", data, layout, {
            mapboxAccessToken: "pk.eyJ1IjoibG9uZ2xvbmciLCJhIjoiY2p2cTJqOHp4MDJtdzQ0cDd2d3g4bmE0ZCJ9.Nc3MEjTImTuuj3DDoSpmBA",
            displayModeBar: false,

        });
    });


