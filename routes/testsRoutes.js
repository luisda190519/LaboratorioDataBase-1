const express = require("express");
const mongoose = require("mongoose");
const covidTests = require("../models/covidTests");
const router = express.Router();

const filter = {
  global: false,
  byCountry: false,
  byContinent: false,
  error: false,
  label: "tests",
};
let location = "";

const searchTestCases = async function () {
  const tests = await covidTests.find().sort({ country: 1, date: 1 });
  return tests;
};

const searchTestsCasesByCountry = async function (country) {
  const tests = await covidTests
    .find({ country: country })
    .sort({ country: 1, date: 1 });
  return tests;
};

const GetTotalTests = function (test) {
  let total = 0;
  test.forEach((testCase) => {
    total += testCase.newTest;
  });
  return total;
};

const GetTotalTestsByCountry = function (tests, country) {
  let total = 0;
  tests.forEach((testCase) => {
    if (testCase.country === country) {
      total += testCase.newTest;
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
  const tests = await searchTestCases();
  const totalTests = commafy(GetTotalTests(tests));
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

router.route("/search").get(async (req, res) => {
  let { country } = req.query;
  const tests = await searchTestsCasesByCountry(country);
  location = country;
  const totalTests = commafy(GetTotalTestsByCountry(tests, country));

  if (totalTests == 0) {
    filter.error = true;
    res.redirect("/tests/filter/global");
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

router.get("/testStatics", async (req, res) => {
  const tests = await searchTestCases();
  res.json(tests);
});

router.get("/testsStaticsByCountry", async (req, res) => {
  const tests = await searchTestsCasesByCountry(location);
  res.json(tests);
});

exports.filter = filter;
exports.router = router;
