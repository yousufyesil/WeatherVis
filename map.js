const customGrayStyle = {
    version: 8,
    sources: {},
    layers: [
        {
            id: "background",
            type: "background",
            paint: {
                "background-color": "rgb(35,35,35)"
            }
        }
    ]
};

Promise.all([
    temperature_state(),
    sunshine_state(),
    d3.json("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/2_hoch.geo.json")
])
    .then(([tempData, sunshineData, geoData]) => {
        const baseZTemp = tempData[10].slice(1).map(v => parseFloat(v.replace(",", ".")));
        const baseZSun = sunshineData[10].slice(1).map(v => parseFloat(v.replace(",", ".")));

        const years = Array.from({ length: 2024 - 1992 + 1 }, (_, i) => 1992 + i);

        const allTempZ = years.map(i => baseZTemp.map(val => parseFloat((val + i * 0.1).toFixed(2))));
        const allSunZ = years.map(i => baseZSun.map(val => parseFloat((val + i * 0.05).toFixed(2))));

        const globalTempMin = Math.min(...allTempZ.flat());
        const globalTempMax = Math.max(...allTempZ.flat());
        const globalSunMin = Math.min(...allSunZ.flat());
        const globalSunMax = Math.max(...allSunZ.flat());

        const data = [
            {
                type: "choroplethmapbox",
                geojson: geoData,
                locations: [
                    "DE-BW", "DE-BY", "DE-BE",  "DE-BB", "DE-HB", "DE-HH",
                    "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SL",
                    "DE-ST", "DE-SN", "DE-SH", "DE-TH"
                ],
                z: allTempZ[0],
                featureidkey: "properties.id",
                text: geoData.features.map(f => f.properties.name),
                colorscale: "Reds",
                marker: { line: { width: 0.5, color: "#333" } },
                showscale: true,
                colorbar: { title: "Temperatur (°C)", thickness: 15 },
                zmin: globalTempMin,
                zmax: globalTempMax,
                visible: true,
                name: "Temperatur"
            },
            {
                type: "choroplethmapbox",
                geojson: geoData,
                locations: [
                    "DE-BW", "DE-BY", "DE-BE",  "DE-BB", "DE-HB", "DE-HH",
                    "DE-HE", "DE-MV", "DE-NI", "DE-NW", "DE-RP", "DE-SL",
                    "DE-ST", "DE-SN", "DE-SH", "DE-TH"
                ],
                z: allSunZ[0],
                featureidkey: "properties.id",
                text: geoData.features.map(f => f.properties.name),
                colorscale: "Yellows",
                marker: { line: { width: 0.5, color: "#333" } },
                showscale: true,
                colorbar: { title: "Sonnenstunden", thickness: 15 },
                zmin: globalSunMin,
                zmax: globalSunMax,
                visible: false,
                name: "Sonnenschein"
            }
        ];

        const layout = {
            mapbox: {
                style: customGrayStyle,
                center: { lon: 10.45, lat: 51.1657 },
                zoom: 5.5
            },
            margin: { t: 30, b: 0, l: 0, r: 0 },
            title: "Deutschlandkarte - Bundesländer",
            dragmode: false,
            plot_bgcolor: "black",
            paper_bgcolor: "rgb(35,35,35)",
            sliders: [{
                pad: { t: 30 },
                active: 0,
                currentvalue: {
                    xanchor: 'right',
                    prefix: 'Jahr: ',
                    font: {
                        color: '#fffafa',
                        size: 20
                    },
                    visible: true
                },
                steps: years.map((year, i) => {
                    return {
                        label: year.toString(),
                        method: 'restyle',
                        args: [
                            {
                                z: [allTempZ[i], allSunZ[i]]
                            }
                        ]
                    };
                })
            }],
            updatemenus: [{
                type: 'buttons',
                xanchor: 'left',
                yanchor: 'down',
                x: 0.1,
                y: 1.15,
                buttons: [
                    {
                        label: 'Temperatur',
                        method: 'restyle',
                        args: ["visible", [true, false]]
                    },
                    {
                        label: 'Sonnenschein',
                        method: 'restyle',
                        args: ["visible", [false, true]]
                    }
                ]
            }]
        };

        Plotly.newPlot("map", data, layout, {
            mapboxAccessToken: "pk.eyJ1IjoibG9uZ2xvbmciLCJhIjoiY2p2cTJqOHp4MDJtdzQ0cDd2d3g4bmE0ZCJ9.Nc3MEjTImTuuj3DDoSpmBA",
            displayModeBar: false
        });
    });