const express = require("express");
const mongoose = require("mongoose");
const covidCases = require("../models/covidCases");
const {search, searchByCountry, GetTotal, GetTotalByCountry, commafy} = require('./utils');

const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  byContinent:false,
  error: false,
  label: "cases",
};
let location = "";

router.route("/filter/:filter").get(async (req, res) => {
  const cases = await search(covidCases);
  const totalCases = commafy(GetTotal(cases, "newCases"));
  if (req.params.filter === "global") {
    filter.global = true;
    filter.byCountry = false;
    filter.byContinent = false;
  } else if (req.params.filter === "byCountry") {
    filter.byCountry = true;
    filter.global = false;
    filter.byContinent = false;
  }else{
    filter.byCountry = false;
    filter.global = false;
    filter.byContinent = true;
  }
  res.render("./templates/show", {
    cases: cases,
    total: totalCases,
    filter,
  });
  filter.error = false;
});

router.route("/search").get(async (req, res) => {
  let { country } = req.query;
  const cases = await searchByCountry(country, covidCases);
  location = country;
  const totalCases = commafy(GetTotalByCountry(cases, country, "newCases"));

  if (totalCases == 0) {
    filter.error = true;
    res.redirect("/cases/filter/global");
  } else {
    filter.byCountry = true;
    filter.global = false;
    filter.byContinent = false;
    res.render("./templates/search", {
      cases: cases,
      total: totalCases,
      country,
      filter
    });
  }
});

router.get("/casesStatics", async (req, res) => {
  const cases = await search(covidCases);
  res.json(cases);
});

router.get("/casesStaticsByCountry", async (req, res) => {
  const cases = await searchByCountry(location, covidCases);
  res.json(cases);
});

router.get("/filter", async (req, res) => {
  res.json(filter);
});

exports.filter = filter;
exports.router = router;
