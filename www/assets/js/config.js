(function () {
  window.APP_CONFIG = {
    layout: {
      defaultMode: "auto",
      mobileBreakpointPx: 760,
      allowUrlOverride: true
    },
    theme: {
      defaultMode: "auto",
      allowUrlOverride: true
    },
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
      hourLine: "#8c97a8"
    },
    curveStyles: {
      juneSolstice: { color: "#d1495b", lineWidth: 2.0 },
      solarEquinox: { color: "#3178c6", lineWidth: 2.0 },
      otherData: { color: "#888888", lineWidth: 1.0 },
      decemberSolstice: { color: "#2e8b57", lineWidth: 2.0 }
    },
    themeStyles: {
      light: {
        colors: {
          background: "#ffffff",
          frame: "#d7dde6",
          axis: "#2c3e57",
          majorGrid: "#b6c2d3",
          minorGrid: "#e2e8f0",
          text: "#21354d",
          currentSun: "#f25f35",
          currentSunBelowHorizon: "#7f8ca3",
          hourLine: "#8c97a8"
        },
        curveStyles: {
          juneSolstice: { color: "#d1495b", lineWidth: 2.0 },
          solarEquinox: { color: "#3178c6", lineWidth: 2.0 },
          otherData: { color: "#888888", lineWidth: 1.0 },
          decemberSolstice: { color: "#2e8b57", lineWidth: 2.0 }
        }
      },
      dark: {
        colors: {
          background: "#101b2b",
          frame: "#2a3952",
          axis: "#c6d3e6",
          majorGrid: "#3a4a63",
          minorGrid: "#26344a",
          text: "#dce6f4",
          currentSun: "#ffad42",
          currentSunBelowHorizon: "#8b9bb5",
          hourLine: "#6f7f98"
        },
        curveStyles: {
          juneSolstice: { color: "#ff7d8f", lineWidth: 2.0 },
          solarEquinox: { color: "#74b5ff", lineWidth: 2.0 },
          otherData: { color: "#91a0b7", lineWidth: 1.0 },
          decemberSolstice: { color: "#56d091", lineWidth: 2.0 }
        }
      }
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
