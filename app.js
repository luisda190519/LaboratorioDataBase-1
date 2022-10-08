//Libreries and extension usadas
const express = require("express");
const mustacheExpress = require("mustache-express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { router: deathsRoute } = require("./routes/deathsRoutes");
const { router: casesRoute } = require("./routes/casesRoutes");
const { router: testsRoute } = require("./routes/testsRoutes");
const {router: vaccinationsRoute,} = require("./routes/vaccinationsRoutes");
const general = require("./routes/general");
const app = express();

//Añadiendo el motor de templates para html, el cual es mustache
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "./views");

//Rutas de la pagina
app.use("/", general);
app.use("/deaths", deathsRoute);
app.use("/tests", testsRoute);
app.use("/cases", casesRoute);
app.use("/vaccinations", vaccinationsRoute);

//Configuracion de la app web
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

//Coneccion con la mongodb, la base de datos seleccionada
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
