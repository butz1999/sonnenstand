(function () {
  window.APP_CONFIG = {
    locations: [
      { label: "Hombrechtikon", locationString: "47.251738, 8.765695", utcOffsetMinutes: 60 },
      { label: "Zürich", locationString: "47.376887, 8.541694", utcOffsetMinutes: 60 },
      { label: "Bern", locationString: "46.948090, 7.447440", utcOffsetMinutes: 60 },
      { label: "Hamburg", locationString: "53.551086, 9.993682", utcOffsetMinutes: 60 },
      { label: "Kiew", locationString: "50.454722, 30.523888", utcOffsetMinutes: 180 },
      { label: "Tromsø", locationString: "69.651827, 18.954451", utcOffsetMinutes: 60 },
      { label: "Kairo, EG (Afrika)", locationString: "30.044420, 31.235712", utcOffsetMinutes: 120 },
      { label: "Tokio, JP (Asien)", locationString: "35.676200, 139.650300", utcOffsetMinutes: 540 },
      { label: "New York, US (Nordamerika)", locationString: "40.712776, -74.005974", utcOffsetMinutes: -300 },
      { label: "Sao Paulo, BR (Südamerika)", locationString: "-23.550520, -46.633308", utcOffsetMinutes: -180 },
      { label: "Sydney, AU (Ozeanien)", locationString: "-33.868820, 151.209290", utcOffsetMinutes: 600 }
    ],
    refreshIntervalMs: 60000,
    chart: {
      aspectRatioWidth: 18,
      aspectRatioHeight: 9,
      marginTop: 24,
      marginRight: 36,
      marginBottom: 52,
      marginLeft: 62,
      elevationMin: 0,
      elevationMax: 90,
      azimuthMin: 0,
      azimuthMax: 360,
      gridMajorStepDeg: 30,
      gridMinorStepDeg: 10,
      yAxisLabelStepDeg: 20,
      currentSunRadiusPx: 5
    },
    paths: {
      sampleStepMinutes: 8,
      showHourLoops: false,
      breakLineAtAzimuthJumpDeg: 120,
      breakLineAboveElevationDeg: 88
    },
    colors: {
      background: "#ffffff",
      frame: "#d7dde6",
      axis: "#2c3e57",
      majorGrid: "#b6c2d3",
      minorGrid: "#e2e8f0",
      text: "#21354d",
      currentSun: "#f25f35",
      currentSunBelowHorizon: "#7f8ca3",
      juneSolstice: "#d1495b",
      marchEquinox: "#3178c6",
      septemberEquinox: "#3178c6",
      decemberSolstice: "#2e8b57",
      hourLine: "#8c97a8"
    },
    lineWidths: {
      axis: 1.5,
      majorGrid: 1,
      minorGrid: 0.8,
      path: 1.6,
      hourLine: 0.9
    }
  };
})();
