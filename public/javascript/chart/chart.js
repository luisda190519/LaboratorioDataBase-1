let data = {
  totalCountry: [],
  labels: [],
  isoCodeLabels: [],
  newCountry: [],
  newGlobal: [],
  totalDataset: [],
  countryLables: [],
  totalCountryDataset: [],
  continentLabels: [],
  continentTotal: [],
};

const clearAll = async function () {
  data = {
    totalCountry: [],
    labels: [],
    isoCodeLabels: [],
    newCountry: [],
    newGlobal: [],
    totalDataset: [],
    countryLables: [],
    totalCountryDataset: [],
    continentLabels: [],
    continentTotal: [],
  };
};

const randomColor = function () {
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
};

const addLabels = function (days) {
  days.forEach((day) => {
    if (!data.labels.includes(day.date)) {
      data.labels.push(day.date);
    }
  });
  data.labels.sort();
};

const addCountryLabels = function (days) {
  let labels = [];
  let last = days[0];
  days.forEach((day) => {
    if (!(last.country == day.country) && !(last.continent === "Continent")) {
      data.countryLables.push(last.country);
      data.isoCodeLabels.push(last.isoCode);
    }
    last = day;
  });
};

const addContinentLabels = function (days) {
  let labels = [];
  let last = days[0];
  days.forEach((day) => {
    if (!(last.country == day.country) && last.continent === "Continent") {
      data.continentLabels.push(last.country);
    }
    last = day;
  });
};

const checkByCountryData = function (objeto, global) {
  let totalLength = [];
  let total = [];
  objeto.forEach((d) => {
    totalLength.push(d.data.length);
    total.push();
  });

  let max = Math.max(...totalLength);

  objeto.forEach((d) => {
    const average = d.data.reduce((a, b) => a + b, 0) / d.data.length;
    if (d.data.length != max && !(d.continent === "Continent")) {
      for (i = 0; max - d.data.length; i++) {
        if (global) {
          d.data.push(
            d.data[d.data.length - 1] + Math.floor(Math.random() * 500)
          );
        } else {
          d.data.push(Math.floor(Math.random() * average));
        }
      }
    }
  });
};

const createTotalDeathsData = function (days, global) {
  let inside = new Object();
  let lastCountry = days[0].country;
  let array = [];
  let total = [];
  let cont = 0;

  days.forEach((day) => {
    if (!(day.continent === "Continent")) {
      if (!(lastCountry == day.country)) {
        inside.borderColor = randomColor();
        inside.borderWidth = 1;
        inside.radius = 0;
        inside.label = lastCountry;
        inside.data = array;
        data.totalCountry.push(inside);

        array = [];
        cont = 0;
        inside = new Object();
      }

      if (total[cont] === undefined) {
        total[cont] = 0;
      }

      array.push(day[global]);
      total[cont] += day[global];
      cont++;
    }
    lastCountry = day.country;
  });
  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.label = "World";
  inside.data = total.sort(function (a, b) {
    return a - b;
  });
  z = total;
  data.totalDataset.push(inside);
};

const createNewDeathsData = function (days, daily) {
  let inside = new Object();
  let last = days[0];
  let array = [];
  let total = [];
  let contTotal = 0;
  let countryTotalDeaths = [];
  let countryTotal = 0;
  let cont = 0;
  let aux = false;

  days.forEach((day) => {
    if (day.continent === "Continent") {
      contTotal += day[daily];
      aux = true;
    } else {
      if (aux) {
        data.continentTotal.push(contTotal);
        contTotal = 0;
        aux = false;
      }
      if (!(last.country == day.country)) {
        inside.borderColor = randomColor();
        inside.borderWidth = 1;
        inside.radius = 0;
        inside.label = last.country;
        inside.data = array;
        data.newCountry.push(inside);
        countryTotalDeaths.push(countryTotal);

        array = [];
        inside = new Object();
        cont = 0;
        countryTotal = 0;
      }

      array.push(day[daily]);

      if (total[cont] === undefined) {
        total[cont] = 0;
      }
      total[cont] += day[daily];
      countryTotal += day[daily];
      cont++;
    }
    last = day;
  });

  inside.borderColor = randomColor();
  inside.borderWidth = 1;
  inside.radius = 0;
  inside.label = "World";
  inside.data = total;
  data.newGlobal.push(inside);
  data.totalCountryDataset = countryTotalDeaths;
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
  } catch (e) {}
};

const addDeathsChartBar = async function (title, data2, labels, selectedChart) {
  try {
    let inside = new Object();
    inside.borderColor = randomColor();
    inside.data = data2;
    inside.backgroundColor = randomColor();

    newConfig = structuredClone(barConfig);
    newConfig.data.datasets.push(inside);
    newConfig.options.plugins.title.text = title;
    newConfig.data.labels = labels;

    const chart = await new Chart(
      document.getElementById(selectedChart),
      newConfig
    );
  } catch (e) {}
};

const addDeathsChartPie = async function (title, data2, labels, selectedChart) {
  try {
    let inside = new Object();
    inside.label = "Dataset 1";
    inside.data = data2;
    inside.backgroundColor = [];
    data.countryLables.forEach((d) => {
      inside.backgroundColor.push(randomColor());
    });

    newConfig = structuredClone(pieConfig);
    newConfig.data.datasets.push(inside);
    newConfig.options.plugins.title.text = title;
    newConfig.data.labels = labels;

    const chart = await new Chart(
      document.getElementById(selectedChart),
      newConfig
    );
  } catch (e) {}
};

const addMapChart = async function (title, selectedChart) {
  try {
    let layout = {
      title: title,
      geo: {
        projection: {
          type: "robinson",
        },
      },
    };

    let datos = [
      {
        type: "choropleth",
        locationmode: "country names",
        locations: data.countryLables,
        z: data.totalCountryDataset,
        text: data.countryLables,
        autocolorscale: true,
      },
    ];
    Plotly.newPlot(selectedChart, datos, layout, { showLink: false });
  } catch (e) {}
};

const createData = async function (url, global, daily, type) {
  const result = await fetch(url);
  const dataFetched = await result.json();
  addLabels(dataFetched);
  addCountryLabels(dataFetched);
  addContinentLabels(dataFetched);
  createTotalDeathsData(dataFetched, global);
  createNewDeathsData(dataFetched, daily);
  //checkByCountryData(data.totalCountry, true);
  //checkByCountryData(data.newCountry, false);
  //checkByCountryData(data.totalDataset, true);
  //checkByCountryData(data.newGlobal, false);

  await addDeathsChartLine(
    "COVID-19 global total world " + type,
    data.totalDataset,
    "chart1"
  );
  await addDeathsChartLine(
    "COVID-19 total global new world " + type,
    data.newGlobal,
    "chart2"
  );
  await addDeathsChartLine(
    "COVID-19 total world " + type + " by country",
    data.totalCountry,
    "chart3"
  );
  await addDeathsChartLine(
    "COVID-19 total new world " + type + "by country",
    data.newCountry,
    "chart4"
  );
  await addDeathsChartBar(
    "COVID-19 total global new world " + type,
    data.totalCountryDataset,
    data.countryLables,
    "chart5"
  );
  await addDeathsChartPie(
    "COVID-19 total global new world " + type,
    data.totalCountryDataset,
    data.countryLables,
    "chart6"
  );
  await addDeathsChartBar(
    "COVID-19 global total world " + type,
    data.continentTotal,
    data.continentLabels,
    "chart7"
  );
  await addDeathsChartPie(
    "COVID-19 total global new world " + type,
    data.continentTotal,
    data.continentLabels,
    "chart8"
  );

  await addMapChart("COVID-19 total global new world " + type, "mapChart");
  await clearAll();
};

const start = async function () {
  let result = await fetch("http://localhost:3000/deaths/filter");
  let dataFetched = await result.json();
  const array = ["deaths", "cases", "tests", "vaccinations"];
  let i = 0;

  while (
    !dataFetched.global &&
    !dataFetched.byCountry &&
    !dataFetched.byContinent
  ) {
    result = await fetch("http://localhost:3000/" + array[i] + "/filter");
    dataFetched = await result.json();
    i++;
  }

  console.log(dataFetched);

  if (dataFetched.label === "deaths") {
    await createData(
      "http://localhost:3000/deaths/deathStatics",
      "totalDeaths",
      "newDeaths",
      "deaths"
    );
  } else if (dataFetched.label === "cases") {
    await createData(
      "http://localhost:3000/cases/casesStatics",
      "totalCases",
      "newCases",
      "cases"
    );
  } else if (dataFetched.label === "tests") {
    await createData(
      "http://localhost:3000/cases/testsStatics",
      "totalTest",
      "newTest",
      "tests"
    );
  } else if (dataFetched.label === "vaccinations") {
    await createData(
      "http://localhost:3000/cases/vaccinationsStatics",
      "totalVaccinations",
      "newVaccinations",
      "vaccinations"
    );
  }
};

start();
