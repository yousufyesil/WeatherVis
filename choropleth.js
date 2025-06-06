function get_tm_value() {
    d3.dsv(";", "https://raw.githubusercontent.com/yousufyesil/WeatherVis/refs/heads/main/Data/air_temperature_mean/regional_averages_tm_year.csv")
        .then(preprocessData_tm);
}
function preprocessData_tm(data) {
    // Namen der Regionen anpassen, da Regionen u.a zusammengefasst wurden


}