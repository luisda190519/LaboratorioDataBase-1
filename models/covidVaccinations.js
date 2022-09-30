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
  totalVaccinations: {
    type: Number,
  },
  newVaccinations: {
    type: Number,
  },
  PeopleVaccinated: {
    type: Number,
  },
  population: {
    type: Number,
  },
  medianAge: {
    type: Number,
  },
});

module.exports = mongoose.model("CovidVaccinations", covidSchema);
