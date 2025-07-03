# Analyse und Visualisierung der Wetterentwicklung in der Bundesrepublik Deutschland seit 1991

**Autoren:** M.-Yousuf Yesil, Lukas Lang-Lajendäcker  
**Datum:** Juli 2025

> **Zusammenfassung:**  
> In folgender Belegarbeit werden die Schritte für eine Datenvisualisierung der Wetterdaten von 1991 – 2024 dargestellt. Insbesondere der Vergleich zwischen den einzelnen Bundesländern, sowie die Untersuchung ob es ein Nord-Süd Gefälle gibt, wird in dieser Arbeit hervorgehoben. Für den Vergleich werden die Lufttemperatur, der Niederschlag sowie die Länge der Sonnenstunden verwendet.

---


## 1. Vorverarbeitung

Die Daten werden direkt vom Deutschen Wetterdienst (DWD) [1] bereitgestellt und erhalten u.a. Messdaten für die Lufttemperatur, Feuchtigkeit und Niederschlag für die meisten Bundesländer sowie den Bundesdurchschnitt. Die Daten sind als Textdatei hinterlegt und nach entfernen der Beschreibung und ändern des Dateityps auch in einem validen CSV. Für die weitere Verarbeitung wird hierbei weiterhin das doppelte Spaltenattribut "year" entfernt, da die zugehörigen Daten keine Informationen liefern und ein doppelter Spaltenname zu Konflikten führen kann.

Da einige Bundesländer zusammengefasst sind, werden folgende Spalten neu interpretiert. So wird aus der Spalte Berlin/Brandenburg die Spalte Berlin, wobei die Werte für Brandenburg aus der eigenen Spalte hergenommen werden. Die gleiche Methode wird auf Niedersachsen/Hamburg/Bremen für die Stadt Bremen angewandt. Da für Hamburg selbst keine Messungen existieren, wird zur Berechnung der Wetterwerte folgende Formel angewendet:

$$
W_{\mathrm{Hamburg}} = \frac{W_{\mathrm{Niedersachsen}} + W_{\mathrm{Schleswig\text{-}Holstein}}}{2}
$$

Hierbei sollte allerdings bedacht werden, dass eine hohe Urbanisierung unter anderem Einflüsse auf die Lufttemperatur haben kann. Diese Faktoren können hier allerdings aufgrund fehlender Daten nicht mit einbezogen werden.

Um die Daten netzwerkunabhängig verwenden zu können, werden die Daten im JavaScript eingebettet. Die Daten sind vorverarbeitet und enthalten die Attributwerte im Zeitraum von 1991 - 2024.

---

## 2. Graphische Visualisierung

### 2.1 Choroplethenkarte

Die Choroplethenkarte bietet die Möglichkeit Unterschiede zwischen Bundesländer visuell durch verschiedene Farbwerte zu visualisieren. In dieser spezifischen Visualisierung besteht die Option verschiedene Wetterdaten auf eine einzige Choroplethenkarte darzustellen. Um diese Unterschiede auch visuell darzustellen, werden die verschiedenen Wetterdaten mit individuell zugewiesenen Farben repräsentiert. Die Farbzuordnung erfolgt nach folgendem Schema:

- **Lufttemperatur → Rot**
- **Sonnenstunden → Gelb**
- **Niederschlag → Blau**

Die gewählten Farben orientieren sich an gängigen visuellen Konventionen: Rot steht für Wärme, Gelb für Sonne bzw. Helligkeit und Blau wird häufig mit Wasser bzw. Niederschlag assoziiert. Dadurch lassen sich die Wetterparameter intuitiv voneinander unterscheiden und visuell klar interpretieren.

### 2.2 Liniendiagramm

Um die Entwicklung der jährlichen Messungen zu zeigen, werden die ausgewählte Attributwerte seit 1991 in einem Liniendiagramm ausgegeben, um die bundesweite Entwicklung zu visualisieren.

---

## 3. Untersuchung des Nord-Süd-Gefälles

Zur Untersuchung des Nord-Süd-Gefälles werden die jährlichen Durchschnittstemperaturen separat für nord- und süddeutsche Bundesländer berechnet. Dabei ergibt sich folgende Aufteilung:

- **Norddeutschland:** Mittelwert aus den Bundesländern  
  Mecklenburg-Vorpommern, Schleswig-Holstein, Hamburg, Bremen, Niedersachsen
- **Süddeutschland:** Mittelwert aus den Bundesländern  
  Baden-Württemberg, Bayern

So erhält man pro Jahr jeweils einen gemittelten Temperaturwert für Nord- und Süddeutschland. Diese Werte wurden dann als zusätzliche Attribute der Datenquelle hinzugefügt.

### Temperaturentwicklung seit 1991

*(Hier würde das entsprechende Diagramm eingefügt)*

---

## 4. Dokumentation

Im folgenden Abschnitt wird erläutert, wie diese Belegarbeit technisch aufgebaut ist. Detailliertere Informationen sowie die gesamte Codebasis lassen sich über das referenzierte GitHub Projekt einsehen.

Um aus unseren Daten eine interaktive Darstellung zu generieren, haben wir uns entschieden, die auf d3-basierende Plotly-Bibliothek zu verwenden. Wir haben uns für Plotly aufgrund der vielen Anpassungsmöglichkeiten sowie der einfachen Integrierbarkeit entschieden. Um einen Zugriff auf die Wetterdaten zu ermöglichen, werden die Daten in ein Array umgewandelt und in JavaScript eingebettet. Wir haben uns für diese Lösung entschieden, um eine unabhängige Nutzung der Anwendung ohne Internetverbindung und externe Abhängigkeiten zu ermöglichen. Dies verringert allerdings die Flexibilität und Wartbarkeit der Daten. Eine Alternative wäre, die Wetterdaten direkt aus vom DWD oder aus dem referenzierten Repository zu laden. Dies würde jedoch eine funktionierende Internetverbindung sowie die Verfügbarkeit des Repository voraussetzen, da die meisten Browser aus Sicherheitsgründen keinen direkten lokalen Dateizugriff erlauben.

### 4.1 Projektstruktur

```
WeatherVis/
├── index.html
├── style.css
├── js/
│   ├── plot.js
│   └── data.js
└── README.md
```

### 4.2 Technische Umsetzung

Die Choroplethenkarte und das Liniendiagramm beziehen ihre Daten aus der Datei `data.js`, welche sowohl die Wetterdaten im Zeitraum von 1991 bis 2024 bereitstellt als auch die geoJSON-Werte, welche für die Erzeugung der Karte obligatorisch sind und aus einem öffentlich zugänglichen und unlizenzierten GitHub-Archiv stammen [2]. Die Daten sind in Form der Konstanten `TEMP_DATA`, `RAIN_10MM`, `SUNSHINE` und `GEO_JSON` als Arrays gespeichert und enthalten die Attributwerte der Bundesländer, des Bundesschnitts und den Durchschnittswerten der nördlichen und südlichen Bundesländer im Zeitraum von 1991 - 2024.

Diese Daten werden über die `index.html` an für die `plot.js` übergeben und direkt zugänglich gemacht.

---

## 5. Referenzen


[1] Deutscher Wetterdienst, "Climate data center portal," 2024. Accessed: Jun. 29, 2025.

[2] F. Schwarz, "deutschlandgeojson," 2024. Zugriff: 07.06.2025.