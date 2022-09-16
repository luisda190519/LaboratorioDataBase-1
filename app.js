const express = require("express");
const mustacheExpress = require("mustache-express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const covidDeaths = require("./models/covidDeaths");
const deathsRoute = require("./routes/covidDeathsRoutes");
const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "./views");

app.use("/deaths", deathsRoute);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect(
    "mongodb://localhost:27017/laboratorio_bases_de_datos_test"
  );
}

main().then(() => console.log("Conectado a base de datos"));
main().catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Connected on port 3000");
});
