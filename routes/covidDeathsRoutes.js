const express = require("express");
const mongoose = require("mongoose");
const covidDeaths = require("../models/covidDeaths");
const router = express.Router();

const searchDeathCases = async () => {
  const deaths = await covidDeaths.find().sort({ country: 1, date: 1 });
  return deaths;
};

const GetTotalDeaths = function (deaths) {
  let total = 0;
  deaths.forEach((deathCase) => {
    total += deathCase.totalDeaths;
  });
  return total;
};

function commafy(num) {
  let str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
}

router
  .route("/")
  .get(async (req, res) => {
    const deaths = await searchDeathCases();
    const totalDeaths = commafy(GetTotalDeaths(deaths));
    res.render("./templates/deaths", { deaths, totalDeaths });
  })

  .post(async (req, res) => {
    const deaths = await searchDeathCases();
    res.json(deaths);
  });

router.get("/deathStatics", async (req, res) => {
  const deaths = await searchDeathCases();
  res.json(deaths);
});

module.exports = router;
