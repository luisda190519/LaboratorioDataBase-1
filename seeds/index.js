const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");
const covidDeaths = require("../models/covidDeaths");

async function main() {
  await mongoose.connect(
    "mongodb://localhost:27017/laboratorio_bases_de_datos_test"
  );
}

main().then(() => console.log("Conectado"));
main().catch((err) => console.log(err));

const seedDB = async (row) => {
  if (row[8] === "") {
    row[8] = 0;
  }

  if (row[9] === "") {
    row[9] = 0;
  }

  const deathsCases = new covidDeaths({
    isoCode: row[0],
    continent: row[1],
    country: row[2],
    date: row[3],
    totalDeaths: row[7],
    newDeaths: row[8],
    newCases: row[5],
    totalCases: row[4],
    totalTest: row[25],
    newTest: row[26],
    totalVaccinations: row[34],
    newVaccinations: row[38],
    PeopleVaccinated: row[35],
    population: row[48],
    medianAge: row[50],
  });
  await deathsCases.save();
};

const deleteAll = async () => {
  await covidDeaths.deleteMany();
};

fs.createReadStream("./seeds/data-copia.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    seedDB(row);
    //deleteAll();
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });
