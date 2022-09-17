let deathData = {
  totalDeathsDatasetsByCountry: [],
  labels: [],
  newDeathDataSetsByCountry: [],
  newDeathDataSetsGlobal: [],
  totalDeathsDatasetGlobal: [],
};

const randomColor = function () {
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
};

const addLabels = function (data) {
  let labels = [];
  let lastCountry = data[0].country;
  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      stop = false;
    }
    if (stop) {
      deathData.labels.push(deathCase.date);
    }
    lastCountry = deathCase.country;
  });
};

const createTotalDeathsData = function (data) {
  let inside = new Object();
  let lastCountry = data[0].country;
  let array = [];
  let total = [];
  let cont = 0;

  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      inside.borderColor = randomColor();
      inside.borderWidth = 1;
      inside.radius = 0;
      inside.label = deathCase.country;
      inside.data = array;
      deathData.totalDeathsDatasetsByCountry.push(inside);

      array = [];
      cont = 0;
      inside = new Object();
    }

    if (total[cont] === undefined) {
      total[cont] = 0;
    }

    array.push(deathCase.totalDeaths);
    total[cont] += deathCase.totalDeaths;
    lastCountry = deathCase.country;
    cont++;
  });

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.label = "World";
  inside.data = total;
  deathData.totalDeathsDatasetGlobal.push(inside);
};

const createNewDeathsData = function (data) {
  let inside = new Object();
  let lastCountry = data[0].country;
  let array = [];
  let total = [];
  let cont = 0;

  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      inside.borderColor = randomColor();
      inside.borderWidth = 1;
      inside.radius = 0;
      inside.label = deathCase.country;
      inside.data = array;
      deathData.newDeathDataSetsByCountry.push(inside);

      array = [];
      inside = new Object();
      cont = 0;
    }

    array.push(deathCase.newDeaths);
    lastCountry = deathCase.country;

    if (total[cont] === undefined) {
      total[cont] = 0;
    }
    total[cont] += deathCase.newDeaths;
    cont++;
  });

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.label = "World";
  inside.data = total;
  deathData.newDeathDataSetsGlobal.push(inside);
};

const addDeathsChart = async function (title, data, selectedChart) {
  config.data.datasets = data;
  config.options.plugins.title = title;
  config.data.labels = deathData.labels;

  const chart = await new Chart(document.getElementById(selectedChart), config);
};

const createData = async function () {
  const result = await fetch("http://localhost:3000/deaths/deathStatics");
  const data = await result.json();
  addLabels(data);
  createTotalDeathsData(data);
  createNewDeathsData(data);
  addDeathsChart(
    "COVID-19 total world deaths by country",
    deathData.totalDeathsDatasetsByCountry,
    "myChart1"
  );
  addDeathsChart(
    "COVID-19 total new world deaths by country",
    deathData.newDeathDataSetsByCountry,
    "myChart3"
  );
  addDeathsChart(
    "COVID-19 global total world deaths",
    deathData.totalDeathsDatasetGlobal,
    "myChart2"
  );
  addDeathsChart(
    "COVID-19 total global new world deaths",
    deathData.newDeathDataSetsGlobal,
    "myChart4"
  );
};

createData();
