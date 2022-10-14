//Configurancion para todos los tipos de chart de la pagina
const lineConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
    interaction: {
      intersect: false,
    },
  },
};

const barConfig = {
  type: "bar",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 4,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        display: false,
      },
      title: {
        display: true,
        text: "",
      },
    },
  },
};

const pieConfig = {
  type: "pie",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "",
      },
    },
  },
};
