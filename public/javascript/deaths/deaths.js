let deathData = { totalDeathsDatasets: [], labels: [], newDeathDataSets: [] };

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

  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      inside.borderColor = randomColor();
      inside.borderWidth = 1;
      inside.radius = 0;
      inside.label = deathCase.country;
      inside.data = array;
      deathData.totalDeathsDatasets.push(inside);

      array = [];
      inside = new Object();
    }
    array.push(deathCase.totalDeaths);
    lastCountry = deathCase.country;
  });
};

const createNewDeathsData = function (data) {
  let inside = new Object();
  let lastCountry = data[0].country;
  let array = [];

  data.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      inside.borderColor = randomColor();
      inside.borderWidth = 1;
      inside.radius = 0;
      inside.label = deathCase.country;
      inside.data = array;
      deathData.newDeathDataSets.push(inside);

      array = [];
      inside = new Object();
      stop = false;
    }

    array.push(deathCase.newDeaths);
    lastCountry = deathCase.country;
  });
};

const addTotalChart = async function () {
  totalDeathConfig = { ...config };
  totalDeathConfig.data.datasets = deathData.totalDeathsDatasets;
  totalDeathConfig.data.labels = deathData.labels;
  totalDeathConfig.options.plugins.title = "COVID-19 total world deaths";

  const myChart = await new Chart(
    document.getElementById("myChart"),
    totalDeathConfig
  );
};

const addNewChart = async function () {
  newDeathConfig = { ...config };
  newDeathConfig.data.datasets = deathData.newDeathDataSets;
  newDeathConfig.options.plugins.title = "COVID-19 total new world deaths";
  newDeathConfig.data.labels = deathData.labels;

  const myChart2 = await new Chart(
    document.getElementById("myChart2"),
    newDeathConfig
  );
};

fetch("http://localhost:3000/deaths/deathStatics")
  .then((result) => result.json())
  .then((data) => {
    addLabels(data);
    createTotalDeathsData(data);
    createNewDeathsData(data);
    addTotalChart();
    addNewChart();
  })
  .catch((err) => console.log(err));
