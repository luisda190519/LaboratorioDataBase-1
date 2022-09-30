const express = require("express");
const mongoose = require("mongoose");
const covidVaccinations = require("../models/covidVaccinations");
const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  error: false,
  label: "vaccinations",
};
let location = "";

const searchVaccinations = async function () {
  const vaccinations = await covidVaccinations
    .find()
    .sort({ country: 1, date: 1 });
  return vaccinations;
};

const searchVaccinationsByCountry = async function (country) {
  const vaccinations = await covidVaccinations
    .find({ country: country })
    .sort({ country: 1, date: 1 });
  return vaccinations;
};

const GetTotalVaccinations = function (vaccinations) {
  let total = 0;
  vaccinations.forEach((vaccination) => {
    total += vaccination.newVaccinations;
  });
  return total;
};

const GetTotalVaccinationsByCountry = function (vaccinations, country) {
  let total = 0;
  vaccinations.forEach((vaccination) => {
    if (vaccination.country === country) {
      total += vaccination.newVaccinations;
    }
  });
  return total;
};

const commafy = function commafy(num) {
  let str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
};

router.route("/filter/:filter").get(async (req, res) => {
  const vaccinations = await searchVaccinations();
  const totalVaccinations = commafy(GetTotalVaccinations(vaccinations));
  if (req.params.filter === "global") {
    filter.global = true;
    filter.byCountry = false;
  } else if (req.params.filter === "byCountry") {
    filter.byCountry = true;
    filter.global = false;
  }
  res.render("./templates/vaccinations", {
    vaccinations: vaccinations,
    totalVaccinations: totalVaccinations,
    filter,
  });
  filter.error = false;
});

router.route("/search").get(async (req, res) => {
  let { country } = req.query;
  const vaccinations = await searchVaccinationsByCountry(country);
  location = country;
  const totalVaccinations = commafy(
    GetTotalVaccinationsByCountry(vaccinations, country)
  );

  if (totalVaccinations == 0) {
    filter.error = true;
    res.redirect("/vaccinations/filter/global");
  } else {
    res.render("./templates/vaccinationCountry", {
      vaccinations: vaccinations,
      totalVaccinations: totalVaccinations,
      country,
      filter
    });
  }
});

router.get("/vaccinationsStatics", async (req, res) => {
  const vaccinations = await searchVaccinations();
  res.json(vaccinations);
});

router.get("/vaccinationsStaticsByCountry", async (req, res) => {
  const vaccinations = await searchVaccinationsByCountry(location);
  res.json(vaccinations);
});

module.exports = router;
