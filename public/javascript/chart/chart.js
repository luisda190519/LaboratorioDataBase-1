let data = {
  totalCountry: [],
  labels: [],
  isoCodeLabels: [],
  newCountry: [],
  newWorld: [],
  totalWorld: [],
  countryLables: [],
  totalCountryDataset: [],
  continentLabels: [],
  continentTotal: [],
  newContinent: [],
  totalContinent: [],
  countryBarRace: {},
  continentBarRace: {},
};

const clearAll = async function () {
  data = {
    totalCountry: [],
    labels: [],
    isoCodeLabels: [],
    newCountry: [],
    newWorld: [],
    totalWorld: [],
    countryLables: [],
    totalCountryDataset: [],
    continentLabels: [],
    continentTotal: [],
    countryBarRace: [],
  };
};

const randomColor = function () {
  r = Math.floor(Math.random() * 256);
  g = Math.floor(Math.random() * 256);
  b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
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

const isValidCountry = function (name) {
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
    if (
      !(last.country == day.country) &&
      !(last.continent === "Continent") &&
      !isValidCountry(last.country)
    ) {
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
    if (
      !(last.country == day.country) &&
      last.continent === "Continent" &&
      isContinent(last.country)
    ) {
      data.continentLabels.push(last.country);
    }
    last = day;
  });
};

const addInsideObject = function (label, array, border, color) {
  let inside = new Object();
  inside.borderColor = color;
  inside.borderWidth = border;
  inside.radius = 0;
  inside.label = label;
  inside.data = array;

  return inside;
};

const createWorldData = function (datos, global, daily) {
  let last = datos[0];
  let dailyData = [];
  let globalData = [];
  let cont = 0;

  datos.forEach((day) => {
    if (!(day.continent === "Continent")) {
      if (!(last.country == day.country)) {
        cont = 0;
      }
      if (globalData[cont] === undefined) {
        globalData[cont] = 0;
      }
      if (dailyData[cont] === undefined) {
        dailyData[cont] = 0;
      }
      globalData[cont] += day[global];
      dailyData[cont] += day[daily];
    }
    last = day;
    cont++;
  });

  color = "rgb(29,53,87)";
  data.totalWorld.push(
    addInsideObject(
      "World",
      globalData.sort(function (a, b) {
        return a - b;
      }),
      3,
      color
    )
  );
  data.newWorld.push(addInsideObject("World", dailyData, 3, color));
};

const createCountryData = function (datos, global, daily) {
  let last = datos[0];
  let dailyData = [];
  let globalData = [];
  let totalData = [];

  datos.forEach((day) => {
    if (!(day.continent === "Continent") && !isValidCountry(day.country)) {
      if (!(last.country == day.country)) {
        color = randomColor();
        data.totalCountry.push(
          addInsideObject(last.country, globalData, 2, color)
        );
        data.newCountry.push(
          addInsideObject(last.country, dailyData, 2, color)
        );
        totalData.push(Math.max(...globalData));
        globalData = [];
        dailyData = [];
      }
      globalData.push(day[global]);
      dailyData.push(day[daily]);
    }
    last = day;
  });

  data.totalCountryDataset = totalData;
};

const createContinentData = function (datos, global, daily) {
  let last = datos[0];
  let dailyData = [];
  let globalData = [];
  let totalData = [];

  datos.forEach((day) => {
    if (day.continent === "Continent" && isContinent(day.country)) {
      globalData.push(day[global]);
      dailyData.push(day[daily]);
    } else if (last.continent === "Continent" && isContinent(last.country)) {
      color = randomColor();
      data.totalContinent.push(
        addInsideObject(last.country, globalData, 2, color)
      );
      data.newContinent.push(
        addInsideObject(last.country, dailyData, 2, color)
      );
      totalData.push(globalData[globalData.length - 1]);
      globalData = [];
      dailyData = [];
    }
    last = day;
  });

  data.continentTotal = totalData;
};

const createCountryBarChartRaceData = function (datos, global) {
  let last = datos[0];
  let totalData = [];
  let inside = new Object();

  datos.forEach((day) => {
    if (!(day.continent === "Continent")) {
      if (!(last.country == day.country)) {
        inside[last.country] = totalData;
        totalData = [];
      }
      totalData.push(day[global]);
    }
    last = day;
  });

  let inside2 = new Object();
  let array = [];
  let cont = 0;

  data.labels.forEach((day) => {
    data.countryLables.forEach((country) => {
      inside2["country"] = country;
      try {
        if (!(inside[country].at(cont) === undefined)) {
          inside2["total"] = inside[country].at(cont);
          array.push(inside2);
          inside2 = new Object();
        }
      } catch (e) {
        inside2["total"] = 0;
        array.push(inside2);
        inside2 = new Object();
      }
    });
    cont++;
    data.countryBarRace[day] = array;
    array = [];
  });
};

const createContinentBarChartRaceData = function (datos, global) {
  let last = datos[0];
  let totalData = [];
  let inside = new Object();

  datos.forEach((day) => {
    if (day.continent === "Continent" && isContinent(day.country)) {
      totalData.push(day[global]);
    } else if (last.continent === "Continent" && isContinent(last.country)) {
      inside[last.country] = totalData;
      totalData = [];
    }
    last = day;
  });

  let inside2 = new Object();
  let array = [];
  let cont = 0;

  data.labels.forEach((day) => {
    data.continentLabels.forEach((continent) => {
      inside2["country"] = continent;
      try {
        if (!(inside[continent].at(cont) === undefined)) {
          inside2["total"] = inside[continent].at(cont);
          array.push(inside2);
          inside2 = new Object();
        }
      } catch (e) {
        inside2["total"] = 0;
        array.push(inside2);
        inside2 = new Object();
      }
    });
    cont++;
    data.continentBarRace[day] = array;
    array = [];
  });
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
    inside.borderColor = "rgb(29,53,87)";
    inside.data = data2;
    inside.backgroundColor = "rgb(29,53,87)";

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

const createData = async function (url, global, daily, type, query) {
  const result = await fetch(url);
  const dataFetched = await result.json();
  addLabels(dataFetched);
  addCountryLabels(dataFetched);
  addContinentLabels(dataFetched);

  if (query[0]) {
    createWorldData(dataFetched, global, daily);

    await addDeathsChartLine(
      "COVID-19 global total world " + type,
      data.totalWorld,
      "chart1"
    );
    await addDeathsChartLine(
      "COVID-19 total global new world " + type,
      data.newWorld,
      "chart2"
    );
  } else if (query[1]) {
    createCountryData(dataFetched, global, daily);
    createCountryBarChartRaceData(dataFetched, global);

    await startRace(data.countryBarRace, data.labels);

    await addDeathsChartLine(
      "COVID-19 total world " + type + " by country",
      data.totalCountry,
      "chart3"
    );
    await addDeathsChartLine(
      "COVID-19 total new world " + type + " by country",
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
    await addMapChart("COVID-19 total global new world " + type, "mapChart");
  } else if (query[2]) {
    createContinentData(dataFetched, global, daily);
    createContinentBarChartRaceData(dataFetched, global);
    await startRace(data.continentBarRace, data.labels);
    await addDeathsChartLine(
      "COVID-19 global total world " + type,
      data.totalContinent,
      "chart7"
    );
    await addDeathsChartLine(
      "COVID-19 total global new world " + type,
      data.newContinent,
      "chart8"
    );
    await addDeathsChartBar(
      "COVID-19 global total world " + type,
      data.continentTotal,
      data.continentLabels,
      "chart9"
    );
    await addDeathsChartPie(
      "COVID-19 total global new world " + type,
      data.continentTotal,
      data.continentLabels,
      "chart10"
    );
  }
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
  console.log(dataFetched);

  if (dataFetched.label === "deaths") {
    await createData(
      url + "/deaths/data/deathStatics",
      "totalDeaths",
      "newDeaths",
      "deaths",
      dataFetched.case
    );
  } else if (dataFetched.label === "cases") {
    await createData(
      url + "/cases/data/casesStatics",
      "totalCases",
      "newCases",
      "cases",
      dataFetched.case
    );
  } else if (dataFetched.label === "tests") {
    await createData(
      url + "/tests/data/testStatics",
      "totalTest",
      "newTest",
      "tests",
      dataFetched.case
    );
  } else if (dataFetched.label === "vaccinations") {
    await createData(
      url + "/vaccinations/data/vaccinationsStatics",
      "totalVaccinations",
      "newVaccinations",
      "vaccinations",
      dataFetched.case
    );
  }
};

start();
