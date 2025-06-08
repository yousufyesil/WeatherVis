# Wetterdaten Analyse

**Autor:** Muhammad-Yousuf Yesil  
**Datum:** Juni 2025

> **Abstract:**  
> In folgender Belegarbeit werden die Schritte für eine Datenvisualisierung der Wetterdaten von 1991 – 2024 dargestellt. Insbesondere der Vergleich zwischen den einzelnen Bundesländern, sowie die Untersuchung, ob es ein Nord-Süd-Gefälle gibt, wird in dieser Arbeit hervorgehoben.

---

## 1. Vorverarbeitung

Die Daten werden direkt vom Deutschen Wetterdienst (DWD) bereitgestellt und enthalten u. a. Messdaten für die Lufttemperatur, Feuchtigkeit und Niederschlag für die meisten Bundesländer sowie den Bundesdurchschnitt. Die Rohdaten liegen als Textdatei vor und wurden nach Entfernen der Beschreibung und Ändern des Dateityps in ein gültiges CSV-Format überführt. Für die weitere Verarbeitung wird das doppelte Spaltenattribut **„year“** entfernt, da diese Spalte keine zusätzlichen Informationen liefert und ein doppelter Spaltenname zu Konflikten führen kann.

Da einige Bundesländer in den Rohdaten zusammengefasst sind, werden folgende Spalten neu interpretiert:

- Aus der Spalte **Berlin/Brandenburg** wird die Spalte **Berlin**, wobei die Werte für Brandenburg aus der separaten Brandenburg-Spalte hergenommen werden.
- Die gleiche Methode wird auf **Niedersachsen/Hamburg/Bremen** angewandt, um die Daten für **Bremen** zu extrahieren.

Da für Hamburg selbst keine Messungen existieren, wird zur Berechnung der Wetterwerte folgende Formel angewendet:

$$
W_{\mathrm{Hamburg}} \;=\; \frac{W_{\mathrm{Niedersachsen}} \;+\; W_{\mathrm{Schleswig\text{-}Holstein}}}{2}.
$$

Hierbei sollte allerdings bedacht werden, dass eine hohe Urbanisierung unter anderem Einflüsse auf die Lufttemperatur haben kann. Diese Faktoren können hier jedoch nicht berücksichtigt werden.

Um die Daten geräteunabhängig zugänglich zu machen, werden sie gemeinsam mit dem restlichen Quellcode in ein öffentliches Git-Repository hochgeladen. Mit der Verwendung von **d3.js** werden die Daten dann als valide CSV-Datei von einem Skript geladen. Diese Methode der Zugänglichkeit bietet zwar den Vorteil, dass die Daten in der Entwicklung leichter zugänglich sind, allerdings wird dafür eine Internetverbindung vorausgesetzt. Wir haben uns dennoch dafür entschieden, da der Zugriff auf lokale Dateien mit JavaScript aus Sicherheitsgründen standardmäßig nicht möglich ist und dadurch der Zugang insgesamt verbessert wird. Als Alternative könnte man die Daten manuell hochladen oder sie als Array direkt in JavaScript einpflegen.

---

## 2. Choroplethenkarte für Wetterentwicklungen

Die Choroplethenkarte bietet die Möglichkeit, Unterschiede zwischen Bundesländern visuell durch verschiedene Farbwerte zu visualisieren. In dieser spezifischen Visualisierung besteht die Option, verschiedene Wetterdaten auf einer einzigen Karte darzustellen. Um diese Unterschiede auch visuell hervorzuheben, werden die verschiedenen Wetterdaten mit individuell zugewiesenen Farben repräsentiert. Die Farbzuordnung erfolgt nach folgendem Schema:

- **Lufttemperatur → Rot**
- **Sonnenstunden → Gelb**
- **Niederschlag → Blau**

Die gewählten Farben orientieren sich an gängigen visuellen Konventionen:  
Rot steht für Wärme, Gelb für Sonne bzw. Helligkeit und Blau wird häufig mit Wasser bzw. Niederschlag assoziiert. Dadurch lassen sich die Wetterparameter intuitiv voneinander unterscheiden und visuell klar interpretieren.

---

## 3. Wetterentwicklung in Deutschland seit 1991

*(In diesem Abschnitt wird später beschrieben, wie sich die Temperaturen und Niederschläge in Deutschland insgesamt von 1991 bis 2024 entwickelt haben.)*

---

## 4. Vergleich der Wetterentwicklung zwischen den Bundesländern seit 1991

*(Hier wird dargestellt, wie sich die einzelnen Bundesländer hinsichtlich Temperatur und Niederschlag über die Jahre unterscheiden.)*

---

## 5. Untersuchung des Nord-Süd-Gefälles

Zur Untersuchung des Nord-Süd-Gefälles werden die jährlichen Durchschnittstemperaturen separat für nord- und süddeutsche Bundesländer berechnet. Dabei ergibt sich:

- **Norddeutschland:** Mittelwert aus den Bundesländern  
  Mecklenburg-Vorpommern, Schleswig-Holstein, Hamburg, Brandenburg, Berlin, Sachsen-Anhalt, Bremen, Niedersachsen, Nordrhein-Westfalen.
- **Süddeutschland:** Mittelwert aus den Bundesländern  
  Sachsen, Saarland, Rheinland-Pfalz, Hessen, Thüringen, Baden-Württemberg, Bayern.

So erhält man für jedes Jahr jeweils einen gemittelten Temperaturwert für Nord- und Süddeutschland. Diese Werte wurden dann als zusätzliche Attribute der Datenquelle hinzugefügt. Der Wert der Stadtstaaten wurde gegebenenfalls mit dem umliegenden Bundesland vereinigt, um keine doppelte Gewichtung zu verursachen.

### Temperaturentwicklung seit 1991

![Temperaturentwicklung Nord-Süd](temp_noso.png)

### Niederschlagsentwicklung seit 1991

![Niederschlagsentwicklung Nord-Süd](sd_noso.png)