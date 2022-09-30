const mongoose = require("mongoose");

const covidSchema = new mongoose.Schema({
  isoCode: {
    type: String,
  },
  continent: {
    type: String,
  },
  country: {
    type: String,
  },
  date: {
    type: String,
  },
  newCases: {
    type: Number,
  },
  totalCases: {
    type: Number,
  },
  population: {
    type: Number,
  },
  medianAge: {
    type: Number,
  },
});

module.exports = mongoose.model("CovidCases", covidSchema);
