(function () {
  function setupCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, width: rect.width, height: rect.height };
  }

  function deriveChartBounds(cfg, payload) {
    var chart = cfg.chart;
    var maxElevation = chart.elevationMin;

    payload.seasonPaths.forEach(function (season) {
      season.points.forEach(function (p) {
        if (p.elevation > maxElevation) {
          maxElevation = p.elevation;
        }
      });
    });

    if (payload.currentSun && payload.currentSun.elevation > maxElevation) {
      maxElevation = payload.currentSun.elevation;
    }

    var paddedMax = Math.ceil(maxElevation + 5);
    return {
      azimuthMin: chart.azimuthMin,
      azimuthMax: chart.azimuthMax,
      elevationMin: 0,
      elevationMax: Math.max(5, paddedMax)
    };
  }

  function buildScales(width, height, cfg, bounds) {
    var m = cfg.chart;
    var plot = {
      left: m.marginLeft,
      top: m.marginTop,
      right: width - m.marginRight,
      bottom: height - m.marginBottom
    };
    plot.width = Math.max(1, plot.right - plot.left);
    plot.height = Math.max(1, plot.bottom - plot.top);

    function xFromAzimuth(az) {
      var t = (az - bounds.azimuthMin) / (bounds.azimuthMax - bounds.azimuthMin);
      return plot.left + t * plot.width;
    }

    function yFromElevation(el) {
      var t = (el - bounds.elevationMin) / (bounds.elevationMax - bounds.elevationMin);
      return plot.bottom - t * plot.height;
    }

    return { plot: plot, xFromAzimuth: xFromAzimuth, yFromElevation: yFromElevation };
  }

  function drawGrid(ctx, scales, cfg, bounds) {
    var chart = cfg.chart;
    var c = cfg.colors;
    var lw = cfg.lineWidths;
    var yLabelStep = chart.yAxisLabelStepDeg || 20;
    var az;
    var el;

    ctx.save();
    for (az = bounds.azimuthMin; az <= bounds.azimuthMax; az += chart.gridMinorStepDeg) {
      var xMinor = scales.xFromAzimuth(az);
      ctx.strokeStyle = c.minorGrid;
      ctx.lineWidth = lw.minorGrid;
      ctx.beginPath();
      ctx.moveTo(xMinor, scales.plot.top);
      ctx.lineTo(xMinor, scales.plot.bottom);
      ctx.stroke();
    }

    for (el = bounds.elevationMin; el <= bounds.elevationMax; el += chart.gridMinorStepDeg) {
      var yMinor = scales.yFromElevation(el);
      ctx.strokeStyle = c.minorGrid;
      ctx.lineWidth = lw.minorGrid;
      ctx.beginPath();
      ctx.moveTo(scales.plot.left, yMinor);
      ctx.lineTo(scales.plot.right, yMinor);
      ctx.stroke();
    }

    for (az = bounds.azimuthMin; az <= bounds.azimuthMax; az += chart.gridMajorStepDeg) {
      var xMajor = scales.xFromAzimuth(az);
      ctx.strokeStyle = c.majorGrid;
      ctx.lineWidth = lw.majorGrid;
      ctx.beginPath();
      ctx.moveTo(xMajor, scales.plot.top);
      ctx.lineTo(xMajor, scales.plot.bottom);
      ctx.stroke();
    }

    for (el = bounds.elevationMin; el <= bounds.elevationMax; el += yLabelStep) {
      var yMajor = scales.yFromElevation(el);
      ctx.strokeStyle = c.majorGrid;
      ctx.lineWidth = lw.majorGrid;
      ctx.beginPath();
      ctx.moveTo(scales.plot.left, yMajor);
      ctx.lineTo(scales.plot.right, yMajor);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAxes(ctx, scales, cfg, bounds) {
    var c = cfg.colors;
    var lw = cfg.lineWidths;
    var chart = cfg.chart;
    var yLabelStep = chart.yAxisLabelStepDeg || 20;
    var az;
    var el;

    ctx.save();
    ctx.strokeStyle = c.axis;
    ctx.lineWidth = lw.axis;
    ctx.strokeRect(scales.plot.left, scales.plot.top, scales.plot.width, scales.plot.height);

    ctx.fillStyle = c.text;
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (az = bounds.azimuthMin; az <= bounds.azimuthMax; az += chart.gridMajorStepDeg) {
      var x = scales.xFromAzimuth(az);
      ctx.fillText(String(az), x, scales.plot.bottom + 8);
    }
    ctx.fillText("Azimut [°]", (scales.plot.left + scales.plot.right) / 2, scales.plot.bottom + 28);

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (el = bounds.elevationMin; el <= bounds.elevationMax; el += yLabelStep) {
      var y = scales.yFromElevation(el);
      ctx.fillText(String(el), scales.plot.left - 8, y);
    }

    ctx.save();
    ctx.translate(16, (scales.plot.top + scales.plot.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Elevation [°]", 0, 0);
    ctx.restore();
    ctx.restore();
  }

  function drawPath(ctx, scales, points, color, width, cfg) {
    if (!points || points.length === 0) {
      return;
    }
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    points.forEach(function (p, idx) {
      var x = scales.xFromAzimuth(p.azimuth);
      var y = scales.yFromElevation(p.elevation);
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        var prev = points[idx - 1];
        var deltaAz = p.azimuth - prev.azimuth;

        // Handle 0°/360° wrap explicitly to avoid spikes and missing half-curves.
        if (Math.abs(deltaAz) > 180) {
          var prevY = scales.yFromElevation(prev.elevation);
          var currY = y;

          if (deltaAz > 0) {
            var currAzUnwrappedLeft = p.azimuth - 360;
            var tLeft = (0 - prev.azimuth) / (currAzUnwrappedLeft - prev.azimuth);
            var yAtZero = prevY + (currY - prevY) * tLeft;
            ctx.lineTo(scales.xFromAzimuth(0), yAtZero);
            ctx.moveTo(scales.xFromAzimuth(360), yAtZero);
            ctx.lineTo(x, y);
          } else {
            var currAzUnwrappedRight = p.azimuth + 360;
            var tRight = (360 - prev.azimuth) / (currAzUnwrappedRight - prev.azimuth);
            var yAtThreeSixty = prevY + (currY - prevY) * tRight;
            ctx.lineTo(scales.xFromAzimuth(360), yAtThreeSixty);
            ctx.moveTo(scales.xFromAzimuth(0), yAtThreeSixty);
            ctx.lineTo(x, y);
          }
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  function drawCurrentSun(ctx, scales, cfg, bounds, currentSun) {
    if (!currentSun) {
      return;
    }
    var clampedAzimuth = Math.max(bounds.azimuthMin, Math.min(bounds.azimuthMax, currentSun.azimuth));
    var clampedElevation = Math.max(bounds.elevationMin, Math.min(bounds.elevationMax, currentSun.elevation));
    var x = scales.xFromAzimuth(clampedAzimuth);
    var y = scales.yFromElevation(clampedElevation);
    var isBelowHorizon = currentSun.elevation < bounds.elevationMin;

    ctx.save();
    ctx.fillStyle = isBelowHorizon ? cfg.colors.currentSunBelowHorizon : cfg.colors.currentSun;
    ctx.beginPath();
    ctx.arc(x, y, cfg.chart.currentSunRadiusPx, 0, 2 * Math.PI);
    ctx.fill();
    if (isBelowHorizon) {
      ctx.strokeStyle = cfg.colors.currentSun;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSunChart(canvas, cfg, payload) {
    var canvasState = setupCanvas(canvas);
    var ctx = canvasState.ctx;
    var width = canvasState.width;
    var height = canvasState.height;
    var bounds = deriveChartBounds(cfg, payload);
    var scales = buildScales(width, height, cfg, bounds);

    ctx.fillStyle = cfg.colors.background;
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, scales, cfg, bounds);
    drawAxes(ctx, scales, cfg, bounds);

    payload.seasonPaths.forEach(function (season) {
      drawPath(ctx, scales, season.points, cfg.colors[season.colorKey], cfg.lineWidths.path, cfg);
    });

    drawCurrentSun(ctx, scales, cfg, bounds, payload.currentSun);
  }

  window.ChartRenderer = {
    drawSunChart: drawSunChart
  };
})();
