const express = require("express");
const mongoose = require("mongoose");
const covidDeaths = require("../models/covidDeaths");
const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  byContinent: false,
  error: false,
  label: "deaths",
};
let location = "";

const searchDeathCases = async function () {
  const deaths = await covidDeaths.find().sort({ country: 1, date: 1 });
  return deaths;
};

const searchDeathCasesByCountry = async function (country) {
  const deaths = await covidDeaths
    .find({ country: country })
    .sort({ country: 1, date: 1 });
  return deaths;
};

const GetTotalDeaths = function (deaths) {
  let total = 0;
  deaths.forEach((deathCase) => {
    total += deathCase.newDeaths;
  });
  return total;
};

const GetTotalDeathsByCountry = function (deaths, country) {
  let total = 0;
  deaths.forEach((deathCase) => {
    if (deathCase.country === country) {
      total += deathCase.newDeaths;
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
  const deaths = await searchDeathCases();
  const totalDeaths = commafy(GetTotalDeaths(deaths));
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
  res.render("./templates/show", { deaths, total: totalDeaths, filter });
  filter.error = false;
});

router.route("/search").get(async (req, res) => {
  let { country } = req.query;
  const deaths = await searchDeathCasesByCountry(country);
  location = country;
  const totalDeaths = commafy(GetTotalDeathsByCountry(deaths, country));

  if (totalDeaths == 0) {
    filter.error = true;
    res.redirect("/deaths/filter/global");
  } else {
    filter.byCountry = true;
    filter.global = false;
    filter.byContinent = false;
    res.render("./templates/search", {
      deaths,
      total: totalDeaths,
      country,
      filter,
    });
  }
});

router.get("/deathStatics", async (req, res) => {
  const deaths = await searchDeathCases();
  res.json(deaths);
});

router.get("/deathStaticsByCountry", async (req, res) => {
  const deaths = await searchDeathCasesByCountry(location);
  res.json(deaths);
});

router.get("/filter", (req, res) => {
  res.json(filter);
});

exports.filter = filter;
exports.router = router;

