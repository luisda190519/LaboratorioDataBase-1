let data = {
  total: [],
  labels: [],
  new: [],
};

const randomColor = function () {
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
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

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
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

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
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

    console.log(newConfig);

    const chart = await new Chart(
      document.getElementById(selectedChart),
      newConfig
    );
  } catch (e) {
    console.log(e);
  }
};

const createData = async function (url, global, daily, type, IdStart) {
  const result = await fetch(url);
  const dataFetched = await result.json();
  addLabels(dataFetched);
  createTotalData(dataFetched, global);
  createNewData(dataFetched, daily);
  await addDeathsChartLine(
    "COVID-19 total world " + type + " by country",
    data.total,
    IdStart + "1"
  );
  await addDeathsChartLine(
    "COVID-19 global total world " + type,
    data.new,
    IdStart + "2"
  );

  await clearAll();
};

const start = async function () {
  let result = await fetch("http://localhost:3000/deaths/filter");
  let dataFetched = await result.json();
  const array = ["cases", "tests", "vaccinations"];
  let i = 0;

  while (!dataFetched.global && !dataFetched.byCountry) {
    result = await fetch("http://localhost:3000/" + array[i] + "/filter");
    dataFetched = await result.json();
    i++;
  }

  if (dataFetched.label === "deaths") {
    await createData(
      "http://localhost:3000/deaths/deathStaticsByCountry",
      "totalDeaths",
      "newDeaths",
      "deaths",
      "deathsChart"
    );
  } else if (dataFetched.label === "cases") {
    await createData(
      "http://localhost:3000/cases/casesStaticsByCountry",
      "totalCases",
      "newCases",
      "cases",
      "casesChart"
    );
  } else if (dataFetched.label === "tests") {
    await createData(
      "http://localhost:3000/cases/testsStaticsByCountry",
      "totalTest",
      "newTest",
      "tests",
      "testsChart"
    );
  } else if (dataFetched.label === "vaccinations") {
    await createData(
      "http://localhost:3000/cases/vaccinationsStaticsByCountry",
      "totalVaccinations",
      "newVaccinations",
      "vaccinations",
      "casesChart"
    );
  }
};

start();
