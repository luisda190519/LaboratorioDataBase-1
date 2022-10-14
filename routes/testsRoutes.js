const express = require("express");
const mongoose = require("mongoose");
const covidTests = require("../models/covidTests");
const {search, searchByCountry, GetTotal, GetTotalByCountry, commafy} = require('./utils');
const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  byContinent: false,
  error: false,
  label: "tests",
};

let location = "";

router.route("/:filter").get(async (req, res) => {
  const tests = await search(covidTests);
  const totalTests = commafy(GetTotal(tests, "totalTest"));
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
    tests: tests,
    total: totalTests,
    filter,
  });
  filter.error = false;
});

router.route("/query/search").get(async (req, res) => {
  let { country } = req.query;
  const tests = await searchByCountry(country, covidTests);
  location = country;
  const totalTests = commafy(GetTotalByCountry(tests, country, "totalTests"));

  if (totalTests == 0) {
    filter.error = true;
    res.redirect("/tests/global");
  } else {
    filter.byCountry = true;
    filter.global = false;
    filter.byContinent = false;
    res.render("./templates/search", {
      tests: tests,
      total: totalTests,
      country,
      filter,
    });
  }
});

router.get("/data/testStatics", async (req, res) => {
  const tests = await search(covidTests);
  res.json(tests);
});

router.get("/data/testsStaticsByCountry", async (req, res) => {
  const tests = await searchByCountry(location, covidTests);
  res.json(tests);
});

exports.filter = filter;
exports.router = router;
