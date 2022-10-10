module.exports.search = async function (model) {
  const result = await model.find().sort({ country: 1, date: 1 });
  return result;
};

module.exports.searchByCountry = async function (country, model) {
  const result = await model
    .find({ country: country })
    .sort({ country: 1, date: 1 });
  return result;
};

module.exports.GetTotal = function (data, daily) {
  let total = 0;
  data.forEach((d) => {
    total += d[daily];
  });
  return total;
};

module.exports.GetTotalByCountry = function (data, country, daily) {
  let total = 0;
  data.forEach((d) => {
    if (d.country === country) {
      total += d[daily];
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
