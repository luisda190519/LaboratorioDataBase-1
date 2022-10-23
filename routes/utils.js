module.exports.search = async function (model) {
  const result = await model.find();
  result.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));
  result.sort((a, b) =>
    a.country > b.country ? 1 : b.country > a.country ? -1 : 0
  );
  return result;
};

module.exports.searchByCountry = async function (country, model) {
  const result = await model.find({ country: country });
  result.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));
  result.sort((a, b) =>
    a.country > b.country ? 1 : b.country > a.country ? -1 : 0
  );
  return result;
};

const isContinent = function (name) {
  if (
    name === "South America" ||
    name === "North America" ||
    name === "Africa" ||
    name === "Asia" ||
    name === "Oceania" ||
    name === "Europe"
  ) {
    return true;
  }
  return false;
};

const isValidCountry = function(name){
  if (
    name === "High income" ||
    name === "Low income" ||
    name === "International" ||
    name === "World" ||
    name === "zzzzzzzzz" ||
    name === "Lower middle income" ||
    name === "Upper middle income" ||
    name === "European Uninon" ||
    name === "Europe"
  ) {
    return true;
  }
  return false;
}

module.exports.GetTotal = function (data, global) {
  let total = 0;
  let last = data[0];
  data.forEach((d) => {
    if (!(last.country === d.country) && !isContinent(last.country) && !isValidCountry(last.country)) {
      total += last[global];
    }
    last = d;
  });
  return total;
};

module.exports.GetTotalByCountry = function (data, country, global) {
  let total = 0;
  data.forEach((d) => {
    if (d.country === country) {
      total = d[global];
    }
  });
  return total;
};

module.exports.commafy = function commafy(num) {
  let str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
};
