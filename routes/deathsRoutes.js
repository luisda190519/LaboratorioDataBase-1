const express = require("express");
const mongoose = require("mongoose");
const covidDeaths = require("../models/covidDeaths");
const {search, searchByCountry, GetTotal, GetTotalByCountry, commafy} = require('./utils');
const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  byContinent: false,
  error: false,
  label: "deaths",
};

let location = "";

router.route("/filter/:filter").get(async (req, res) => {
  const deaths = await search(covidDeaths);
  const totalDeaths = commafy(GetTotal(deaths, "newDeaths"));
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
  const deaths = await searchByCountry(country, covidDeaths);
  location = country;
  const totalDeaths = commafy(GetTotalByCountry(deaths, country, "newDeaths"));

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
  const deaths = await search(covidDeaths);
  res.json(deaths);
});

router.get("/deathStaticsByCountry", async (req, res) => {
  const deaths = await searchByCountry(location, covidDeaths);
  res.json(deaths);
});

router.get("/filter", (req, res) => {
  res.json(filter);
});

exports.filter = filter;
exports.router = router;
