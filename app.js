const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


app.post("/", function(req, res) {
  const query = req.body.cityName;
  if(query == ""){
    res.redirect("/")
  }else{
  const apiKey = "6af631e5ed2e43c7542066b823ef546a";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  https.get(url, function(response) {

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      if(weatherData.cod == 404 ){
        res.redirect("/404.html")
      }else{
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<head><link rel=preconnect href=https://fonts.gstatic.com><link href=https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap rel=stylesheet><link rel=stylesheet href=dist/style.css><title>Weather app</title></head><body><h1>The temperature in " + query + " is " + temp + " degrees celsius.</h1>" + "<h2>The weather is currently " + description + ".</h2>");
      res.write("<img style=width:150px; src=" + imgURL + ">");
      res.write("<img src=genie.jpg></body>")
      res.write("<form action=/newcity method=post><button type=submit> Want To Check Another City?</button></form>")
      res.send();
    }})
  })
}});

app.post("/newcity",(req,res)=>{
  res.redirect("/")
})




app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})
