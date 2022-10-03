const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");
const covidDeaths = require("../models/covidDeaths");
const covidCases = require("../models/covidCases");
const covidTests = require("../models/covidTests");
const CovidVaccinations = require("../models/covidVaccinations");
const covidVaccinations = require("../models/covidVaccinations");

//Coneccion a la base de datos
async function main() {
  await mongoose.connect(
    "mongodb://localhost:27017/laboratorio_bases_de_datos_test"
  );
}
main().then(() => {
  console.log("Conectado");
  deleteAll();
});

main().catch((err) => console.log(err));

//Llenamos la base de datos con los datos del informe de covid 19
const seedDB = async (row) => {
  for (i = 6; i <= 51; i++) {
    if (row[i] === "") {
      row[i] = 0;
    }
  }

  const deaths = new covidDeaths({
    isoCode: row[0],
    continent: row[1],
    country: row[2],
    date: row[3],
    totalDeaths: row[7],
    newDeaths: row[8],
    population: row[48],
    medianAge: row[50],
  });

  const cases = new covidCases({
    isoCode: row[0],
    continent: row[1],
    country: row[2],
    date: row[3],
    newCases: row[5],
    totalCases: row[4],
    population: row[48],
    medianAge: row[50],
  });

  const tests = new covidTests({
    isoCode: row[0],
    continent: row[1],
    country: row[2],
    date: row[3],
    totalTest: row[25],
    newTest: row[26],
    population: row[48],
    medianAge: row[50],
  });

  const vaccination = new CovidVaccinations({
    isoCode: row[0],
    continent: row[1],
    country: row[2],
    date: row[3],
    totalVaccinations: row[34],
    newVaccinations: row[38],
    PeopleVaccinated: row[35],
    population: row[48],
    medianAge: row[50],
  });

  await deaths.save();
  await cases.save();
  await tests.save();
  await vaccination.save();
};

const deleteAll = async () => {
  await covidDeaths.deleteMany();
  await covidCases.deleteMany();
  await covidTests.deleteMany();
  await covidVaccinations.deleteMany();
};

//Lectura del archivo donde se encuentra todos los datos a utilizar
fs.createReadStream("./seeds/data-copia.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    try {
      await seedDB(row);
    } catch (e) {
      console.log(e);
    }
  })
  .on("end", async function () {
    await console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });
