const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("./templates/home");
});

router.get("/filter", (req, res) => {
  const array = ["deaths", "cases", "tests", "vaccinations"];
  let i = 0;
  let filer = null;

  do {
    filter = require("./" + array[i] + "Routes");
    i++;
  } while (!filter.filter.global && !filter.filter.byCountry && !filter.filter.byContinent && i<=3);
  res.json(filter.filter);
  filter.filter.global = false;
  filter.filter.byCountry = false;
  filter.filter.byContinent = false;
});

module.exports = router;
