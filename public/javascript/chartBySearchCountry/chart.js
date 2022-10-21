let data = {
  total: [],
  labels: [],
  new: [],
};

const clearAll = async function () {
  data = {
    total: [],
    labels: [],
    new: [],
  };
};

const addLabels = function (days) {
  let labels = [];
  let lastCountry = days[0].country;
  days.forEach((deathCase) => {
    if (!(lastCountry == deathCase.country)) {
      stop = false;
    }
    if (stop) {
      data.labels.push(deathCase.date);
    }
    lastCountry = deathCase.country;
  });
};

const createTotalData = function (days, global) {
  let inside = new Object();
  let total = [];
  let cont = 0;

  days.forEach((c) => {
    if (total[cont] === undefined) {
      total[cont] = 0;
    }
    inside.label = c.country;
    total[cont] += c[global];
    cont++;
  });

  inside.borderColor = "rgb(29,53,87)";
  inside.borderWidth = 3;
  inside.radius = 0;
  inside.data = total;
  data.total.push(inside);
};

const createNewData = function (days, daily) {
  let inside = new Object();
  let total = [];
  let cont = 0;

  days.forEach((c) => {
    if (total[cont] === undefined) {
      total[cont] = 0;
    }
    total[cont] += c[daily];
    inside.label = c.country;
    cont++;
  });

  inside.borderColor = "rgb(29,53,87)";
  inside.borderWidth = 3;
  inside.radius = 0;
  inside.data = total;
  data.new.push(inside);
};

const addDeathsChartLine = async function (title, data2, selectedChart) {
  try {
    newConfig = structuredClone(lineConfig);
    newConfig.data.datasets = data2;
    newConfig.options.plugins.title.text = title;
    newConfig.data.labels = data.labels;

    const chart = await new Chart(
      document.getElementById(selectedChart),
      newConfig
    );
  } catch (e) {
    console.log(e);
  }
};

const createData = async function (url, global, daily, type) {
  const result = await fetch(url);
  const dataFetched = await result.json();
  addLabels(dataFetched);
  createTotalData(dataFetched, global);
  createNewData(dataFetched, daily);
  await addDeathsChartLine(
    "COVID-19 total world " + type + " by country",
    data.total,
    "chart1"
  );
  await addDeathsChartLine(
    "COVID-19 global total world " + type,
    data.new,
    "chart2"
  );

  await clearAll();
};

const start = async function () {
  let url = "https://laboratoriobasesdedatos.azurewebsites.net";
  try {
    result = await fetch(url + "/filter");
  } catch (e) {
    url = "http://localhost:3000";
    result = await fetch(url + "/filter");
  }

  dataFetched = await result.json();

  if (dataFetched.label === "deaths") {
    await createData(
      url + "/deaths/data/deathStaticsByCountry",
      "totalDeaths",
      "newDeaths",
      "deaths"
    );
  } else if (dataFetched.label === "cases") {
    await createData(
      url + "/cases/data/casesStaticsByCountry",
      "totalCases",
      "newCases",
      "cases"
    );
  } else if (dataFetched.label === "tests") {
    await createData(
      url + "/tests/data/testsStaticsByCountry",
      "totalTest",
      "newTest",
      "tests"
    );
  } else if (dataFetched.label === "vaccinations") {
    await createData(
      url + "/vaccinations/data/vaccinationsStaticsByCountry",
      "totalVaccinations",
      "newVaccinations",
      "vaccinations"
    );
  }
};

start();
