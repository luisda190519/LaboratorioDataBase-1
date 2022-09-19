const config = {
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
