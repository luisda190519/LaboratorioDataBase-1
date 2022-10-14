const express = require("express");
const mongoose = require("mongoose");
const covidVaccinations = require("../models/covidVaccinations");
const {search, searchByCountry, GetTotal, GetTotalByCountry, commafy} = require('./utils');
const router = express.Router();
let location = "";

const filter = {
  global: false,
  byCountry: false,
  byContinent: false,
  error: false,
  label: "vaccinations",
};

router.route("/:filter").get(async (req, res) => {
  const vaccinations = await search(covidVaccinations);
  const totalVaccinations = commafy(GetTotal(vaccinations, "totalVaccinations"));
  if (req.params.filter === "global") {
    filter.global = true;
    filter.byCountry = false;
    filter.byContinent = false;
  } else if (req.params.filter === "byCountry") {
    filter.byCountry = true;
    filter.global = false;
    filter.byContinent = false;
  } else {
    filter.byCountry = false;
    filter.global = false;
    filter.byContinent = true;
  }
  res.render("./templates/show", {
    vaccinations: vaccinations,
    total: totalVaccinations,
    filter,
  });
  filter.error = false;
});

router.route("/query/search").get(async (req, res) => {
  let { country } = req.query;
  const vaccinations = await searchByCountry(country, covidVaccinations);
  location = country;
  const totalVaccinations = commafy(
    GetTotalByCountry(vaccinations, country, "totalVaccinations")
  );

  if (totalVaccinations == 0) {
    filter.error = true;
    res.redirect("/vaccinations/global");
  } else {
    filter.byCountry = true;
    filter.global = false;
    filter.byContinent = false;
    res.render("./templates/search", {
      vaccinations: vaccinations,
      total: totalVaccinations,
      country,
      filter,
    });
  }
});

router.get("/data/vaccinationsStatics", async (req, res) => {
  const vaccinations = await search(covidVaccinations);
  res.json(vaccinations);
});

router.get("/data/vaccinationsStaticsByCountry", async (req, res) => {
  const vaccinations = await searchByCountry(location, covidVaccinations);
  res.json(vaccinations);
});

exports.filter = filter;
exports.router = router;
