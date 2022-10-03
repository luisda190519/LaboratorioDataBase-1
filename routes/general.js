const express = require("express");
const mongoose = require("mongoose");
const covidCases = require("../models/covidCases");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("./templates/home");
});

module.exports = router;
