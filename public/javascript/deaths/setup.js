const lineConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: false,
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      y: {
        stacked: true,
      },
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
        borderWidth: 2,
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
        position: "top"
      },
      title: {
        display: true,
        text: "",
      },
    },
  },
};
