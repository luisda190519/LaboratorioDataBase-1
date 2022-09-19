let deathData = {
  totalDeathsDatasetsByCountry: [],
  labels: [],
  newDeathDataSetsByCountry: [],
  newDeathDataSetsGlobal: [],
  totalDeathsDatasetGlobal: [],
  countryLables: [],
  countryTotalDeathsDataset: [],
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

const addCountryLabels = function (data) {
  let labels = [];
  let lastCountry = data[0].country;
  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      deathData.countryLables.push(deathCase.country);
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
  let countryTotalDeaths = [];
  let countryTotal = 0;
  let cont = 0;

  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      inside.borderColor = randomColor();
      inside.borderWidth = 1;
      inside.radius = 0;
      inside.label = deathCase.country;
      inside.data = array;
      deathData.newDeathDataSetsByCountry.push(inside);
      countryTotalDeaths.push(countryTotal);

      array = [];
      inside = new Object();
      cont = 0;
      countryTotal = 0;
    }

    array.push(deathCase.newDeaths);
    lastCountry = deathCase.country;

    if (total[cont] === undefined) {
      total[cont] = 0;
    }
    total[cont] += deathCase.newDeaths;
    countryTotal += deathCase.newDeaths;
    cont++;
  });

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.label = "World";
  inside.data = total;
  deathData.newDeathDataSetsGlobal.push(inside);

  inside = new Object();

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.data = countryTotalDeaths;
  deathData.countryTotalDeathsDataset.push(inside);
};

const addDeathsChartLine = async function (title, data, selectedChart) {
  newConfig = structuredClone(lineConfig);
  newConfig.data.datasets = data;
  newConfig.options.plugins.title.text = title;
  newConfig.data.labels = deathData.labels;

  const chart = await new Chart(
    document.getElementById(selectedChart),
    newConfig
  );
};

const addDeathsChartBar = async function (title, data, selectedChart) {
  newConfig = structuredClone(barConfig);
  newConfig.data.datasets = data;
  newConfig.options.plugins.title.text = title;
  newConfig.data.labels = deathData.countryLables;

  const chart = await new Chart(
    document.getElementById(selectedChart),
    newConfig
  );
};

const addDeathsChartPie = async function (title, data, selectedChart) {
  newConfig = structuredClone(pieConfig);
  newConfig.data.datasets = data;
  newConfig.options.plugins.title.text = title;
  newConfig.data.labels = deathData.countryLables;

  const chart = await new Chart(
    document.getElementById(selectedChart),
    newConfig
  );
};

const createData = async function () {
  const result = await fetch("http://localhost:3000/deaths/deathStatics");
  const data = await result.json();
  addLabels(data);
  addCountryLabels(data);
  createTotalDeathsData(data);
  createNewDeathsData(data);
  addDeathsChartLine(
    "COVID-19 total world deaths by country",
    deathData.totalDeathsDatasetsByCountry,
    "myChart1"
  );
  addDeathsChartLine(
    "COVID-19 total new world deaths by country",
    deathData.newDeathDataSetsByCountry,
    "myChart3"
  );
  addDeathsChartLine(
    "COVID-19 global total world deaths",
    deathData.totalDeathsDatasetGlobal,
    "myChart2"
  );
  addDeathsChartLine(
    "COVID-19 total global new world deaths",
    deathData.newDeathDataSetsGlobal,
    "myChart4"
  );
  addDeathsChartBar(
    "COVID-19 total global new world deaths",
    deathData.countryTotalDeathsDataset,
    "myChart5"
  );
  addDeathsChartPie(
    "COVID-19 total global new world deaths",
    deathData.countryTotalDeathsDataset,
    "myChart6"
  );
};

createData();
