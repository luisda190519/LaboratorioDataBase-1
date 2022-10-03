const express = require("express");
const mongoose = require("mongoose");
const covidCases = require("../models/covidCases");
const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  byContinent:false,
  error: false,
  label: "cases",
};
let location = "";

const searchCases = async function () {
  const cases = await covidCases.find().sort({ country: 1, date: 1 });
  return cases;
};

const searchCasesByCountry = async function (country) {
  const cases = await covidCases
    .find({ country: country })
    .sort({ country: 1, date: 1 });
  return cases;
};

const GetTotalCases = function (Cases) {
  let total = 0;
  Cases.forEach((Case) => {
    total += Case.newCases;
  });
  return total;
};

const GetTotalCasesByCountry = function (cases, country) {
  let total = 0;
  cases.forEach((Case) => {
    if (Case.country === country) {
      total += Case.newCases;
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
  const cases = await searchCases();
  const totalCases = commafy(GetTotalCases(cases));
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
  res.render("./templates/cases", {
    cases: cases,
    total: totalCases,
    filter,
  });
  filter.error = false;
});

router.route("/search").get(async (req, res) => {
  let { country } = req.query;
  const cases = await searchCasesByCountry(country);
  location = country;
  const totalCases = commafy(GetTotalCasesByCountry(cases, country));

  if (totalCases == 0) {
    filter.error = true;
    res.redirect("/cases/filter/global");
  } else {
    res.render("./templates/search", {
      cases: cases,
      total: totalCases,
      country,
      filter
    });
  }
});

router.get("/casesStatics", async (req, res) => {
  const cases = await searchCases();
  res.json(cases);
});

router.get("/casesStaticsByCountry", async (req, res) => {
  const cases = await searchCasesByCountry(location);
  res.json(cases);
});

router.get("/filter", async (req, res) => {
  res.json(filter);
});

module.exports = router;
