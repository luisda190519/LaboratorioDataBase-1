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

//BarChart race config
const startRace = async function (barData, labels) {
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.padding(40, 40, 40, 40);
    
    chart.numberFormatter.bigNumberPrefixes = [
      { "number": 1e+3, "suffix": "K" },
      { "number": 1e+6, "suffix": "M" },
      { "number": 1e+9, "suffix": "B" }
    ];
    
    var label = chart.plotContainer.createChild(am4core.Label);
    label.x = am4core.percent(97);
    label.y = am4core.percent(95);
    label.horizontalCenter = "right";
    label.verticalCenter = "up";
    label.dx = -15;
    label.fontSize = 50;
    
    var playButton = chart.plotContainer.createChild(am4core.PlayButton);
    playButton.x = am4core.percent(97);
    playButton.y = am4core.percent(95);
    playButton.dy = -2;
    playButton.verticalCenter = "middle";
    playButton.events.on("toggled", function(event) {
      if (event.target.isActive) {
        play();
      }
      else {
        stop();
      }
    })
    
    var stepDuration = 1000;
    let cont = 0;
    
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = stepDuration;
    valueAxis.extraMax = 0.1;
    
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "country";
    series.dataFields.valueX = "total";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.interpolationDuration = stepDuration;
    series.interpolationEasing = am4core.ease.linear;
    
    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = -10;
    
    chart.zoomOutButton.disabled = true;
    
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    var year = labels[cont];
    label.text = year;
    
    var interval;
    
    function play() {
      interval = setInterval(function(){
        nextYear();
      }, stepDuration)
      nextYear();
    }
    
    function stop() {
      if (interval) {
        clearInterval(interval);
      }
    }
    
    function nextYear() {
      cont++;
      year = labels[cont]
      var newData = barData[labels[cont]];
      var itemsWithNonZero = 0;
      for (var i = 0; i < chart.data.length; i++) {
        chart.data[i].total = newData[i].total;
        if (chart.data[i].total > 0) {
          itemsWithNonZero++;
        }
      }
    
      if (labels[cont] == "2020-01-01") {
        series.interpolationDuration = stepDuration / 4;
        valueAxis.rangeChangeDuration = stepDuration / 4;
      }
      else {
        series.interpolationDuration = stepDuration;
        valueAxis.rangeChangeDuration = stepDuration;
      }
    
      chart.invalidateRawData();
      label.text = year;
      categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
    }
    
    
    categoryAxis.sortBySeries = series;
    chart.data = JSON.parse(JSON.stringify(barData[year]));
    categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });
    
    series.events.on("inited", function() {
      setTimeout(function() {
        playButton.isActive = false; // this starts interval
      }, 2000)
    })
    
    }); // end am4core.ready()
};
