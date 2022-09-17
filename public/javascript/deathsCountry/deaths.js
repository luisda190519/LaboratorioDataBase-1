let deathData = {
  totalDeathsDatasets: [],
  labels: [],
  newDeathDataSets: [],
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
  let total = [];
  let cont = 0;

  data.forEach((deathCase) => {
    if (total[cont] === undefined) {
      total[cont] = 0;
    }
    inside.label = deathCase.country;
    total[cont] += deathCase.totalDeaths;
    cont++;
  });

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.data = total;
  deathData.totalDeathsDatasets.push(inside);
};

const createNewDeathsData = function (data) {
  let inside = new Object();
  let total = [];
  let cont = 0;

  data.forEach((deathCase) => {
    if (total[cont] === undefined) {
      total[cont] = 0;
    }
    total[cont] += deathCase.newDeaths;
    inside.label = deathCase.country;
    cont++;
  });

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.data = total;
  deathData.newDeathDataSets.push(inside);
};

const addDeathsChart = async function (title, data, selectedChart) {
  config.data.datasets = data;
  config.options.plugins.title = title;
  config.data.labels = deathData.labels;

  const chart = await new Chart(document.getElementById(selectedChart), config);
};

const createData = async function () {
  const result = await fetch("http://localhost:3000/deaths/deathStaticsByCountry");
  const data = await result.json();

  addLabels(data);
  createTotalDeathsData(data);
  createNewDeathsData(data);

  addDeathsChart(
    "COVID-19 total world deaths by country",
    deathData.totalDeathsDatasets,
    "myChart1"
  );
  addDeathsChart(
    "COVID-19 total new world deaths by country",
    deathData.newDeathDataSets,
    "myChart2"
  );
};

createData();
