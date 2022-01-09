const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + "/style.css");
})


app.post("/", function (req, res) {
    var city = req.body.city;
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=60e309490af36918765a48aedcc2f406&units=metric";
    https.get(url, function (response) {
        console.log("statusCode: " + response.statusCode);
        response.on("data", function (data) {
            data = JSON.parse(data);
            if (response.statusCode == 200) {
                var icon = data.weather[0].icon;
                var iconURL = "<img src=\\\"http://openweathermap.org/img/wn/" + icon + "@2x.png\\\" alt=\\\"icon\\\">";
                var desc = "<span>" + data.weather[0].description + "</span>";
                var temp = "<div>Temperature: " + data.main.temp + " °C</div>";
                var wind = "<div>Wind Speed: " + data.wind.speed + " m/s</div>";

                var report = iconURL + desc + temp + wind;
                res.sendFile(__dirname + "/report.html");

                var script = "var x = document.querySelector(\".weather-data\")\;x.innerHTML = " + "\"" + report + "\"" + "\;";

                var fs = require('fs');

                fs.writeFile('script.js', script, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            } else {
                res.sendFile(__dirname + "/report.html");
                var script = "var x = document.querySelector(\".weather-data\")\;x.innerHTML = " + "\"" + "Wrong City Name Entered!" + "\"" + "\;";

                var fs = require('fs');

                fs.writeFile('script.js', script, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });

            }
        })
    })
})


app.get("/script.js", function (req, res) {
    res.sendFile(__dirname + "/script.js");
})

app.get("/bg.jpg", function (req, res) {
    res.sendFile(__dirname + "/bg.jpg");
})

var port = process.env.port || "3000"
app.listen(port, function () {
    console.log("Server Started on port 3000.");
})