(function () {
  var config = window.APP_CONFIG;
  var solar = window.SolarMath;
  var renderer = window.ChartRenderer;

  var canvas = document.getElementById("sun-chart");
  var chartFrame = document.getElementById("chart-frame");
  var metaText = document.getElementById("meta-text");
  var testToggle = document.getElementById("test-toggle");
  var testPanel = document.getElementById("test-panel");
  var timeSlider = document.getElementById("time-slider");
  var timeSliderValue = document.getElementById("time-slider-value");
  var daySlider = document.getElementById("day-slider");
  var daySliderValue = document.getElementById("day-slider-value");
  var locationSelect = document.getElementById("location-select");
  var legendList = document.getElementById("legend-list");

  var locationCache = {};
  var seasonCache = {};
  var minuteTimeoutId = null;
  var minuteIntervalId = null;
  var scheduledRenderFrameId = null;
  var resizeDebounceTimeoutId = null;
  var initialRenderStarted = false;
  var postLoadRefineDone = false;
  var chartRevealedAfterLoad = false;
  var state = {
    isTestMode: false,
    simulatedMinutes: 12 * 60,
    simulatedDayOfYear: 1
  };

  var defaultLocation = (config.locations && config.locations.length > 0)
    ? config.locations[0]
    : { label: "Standard Standort", locationString: "47.251738, 8.765695", utcOffsetMinutes: -new Date().getTimezoneOffset() };

  function scheduleRender() {
    if (scheduledRenderFrameId !== null) {
      cancelAnimationFrame(scheduledRenderFrameId);
    }
    scheduledRenderFrameId = requestAnimationFrame(function () {
      scheduledRenderFrameId = null;
      renderNow();
    });
  }

  function formatLiveDateTime(date) {
    return date.toLocaleString("de-CH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  function parseLocationCached(locationString) {
    if (!locationCache[locationString]) {
      locationCache[locationString] = solar.parseLocation(locationString);
    }
    return locationCache[locationString];
  }

  function getSeasonPathsForYear(year, locationString) {
    var cacheKey = String(year) + "|" + locationString;
    if (seasonCache[cacheKey]) {
      return seasonCache[cacheKey];
    }
    var loc = parseLocationCached(locationString);
    seasonCache[cacheKey] = solar.computeSeasonPaths(
      year,
      loc.latitude,
      loc.longitude,
      config.paths.sampleStepMinutes
    );
    return seasonCache[cacheKey];
  }

  function formatTimeFromMinutes(totalMinutes) {
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  }

  function minutesFromDate(date) {
    return date.getHours() * 60 + date.getMinutes();
  }

  function dayOfYearFromDate(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    return Math.floor(diff / 86400000);
  }

  function dateWithDayAndMinutesAtOffset(year, dayOfYear, minutes, utcOffsetMinutes) {
    var normalizedDay = Math.max(1, Math.min(365, dayOfYear));
    var utcMs = Date.UTC(year, 0, normalizedDay, 0, 0, 0, 0) + (minutes - utcOffsetMinutes) * 60000;
    return new Date(utcMs);
  }

  function setTestModeEnabled(enabled) {
    state.isTestMode = enabled;
    testPanel.hidden = !enabled;
    testToggle.setAttribute("aria-expanded", String(enabled));
  }

  function populateLocationSelect() {
    locationSelect.innerHTML = "";
    config.locations.forEach(function (entry) {
      var option = document.createElement("option");
      option.value = entry.locationString;
      option.textContent = entry.label;
      locationSelect.appendChild(option);
    });
    locationSelect.value = defaultLocation.locationString;
  }

  function getSelectedLocationEntry() {
    var selectedString = locationSelect.value || defaultLocation.locationString;
    for (var i = 0; i < config.locations.length; i += 1) {
      if (config.locations[i].locationString === selectedString) {
        return config.locations[i];
      }
    }
    return defaultLocation;
  }

  function getActiveLocationEntry() {
    if (!state.isTestMode) {
      return defaultLocation;
    }
    return getSelectedLocationEntry();
  }

  function getLocationUtcOffsetMinutes(activeLocation) {
    if (typeof activeLocation.utcOffsetMinutes === "number") {
      return activeLocation.utcOffsetMinutes;
    }
    return -new Date().getTimezoneOffset();
  }

  function renderLegend(seasonPaths) {
    legendList.innerHTML = "";
    seasonPaths.forEach(function (season) {
      var item = document.createElement("li");
      item.className = "legend-item";

      var swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.backgroundColor = config.colors[season.colorKey];

      var label = document.createElement("span");
      label.textContent = season.label;

      item.appendChild(swatch);
      item.appendChild(label);
      legendList.appendChild(item);
    });

    var sunItem = document.createElement("li");
    sunItem.className = "legend-item";

    var sunSwatch = document.createElement("span");
    sunSwatch.className = "legend-swatch sun";
    sunSwatch.style.backgroundColor = config.colors.currentSun;

    var sunLabel = document.createElement("span");
    sunLabel.textContent = "Aktuelle Sonne";

    sunItem.appendChild(sunSwatch);
    sunItem.appendChild(sunLabel);
    legendList.appendChild(sunItem);
  }

  function renderForDate(activeDate, activeLocation, simulationMode) {
    var locationCoords = parseLocationCached(activeLocation.locationString);
    var currentSun = solar.solarForDate(activeDate, locationCoords.latitude, locationCoords.longitude);
    var seasonPaths = getSeasonPathsForYear(activeDate.getUTCFullYear(), activeLocation.locationString);

    renderer.drawSunChart(canvas, config, {
      seasonPaths: seasonPaths,
      currentSun: currentSun
    });
    renderLegend(seasonPaths);

    metaText.textContent =
      "Standort " +
      activeLocation.label +
      " (" +
      activeLocation.locationString +
      ")" +
      " | Modus " +
      (simulationMode ? "Simulation" : "Live") +
      " | Zeit " +
      (simulationMode ? (String(state.simulatedDayOfYear) + " / " + formatTimeFromMinutes(state.simulatedMinutes)) : formatLiveDateTime(activeDate)) +
      " | Tag " +
      (simulationMode ? state.simulatedDayOfYear : dayOfYearFromDate(activeDate)) +
      " | Azimut " +
      currentSun.azimuth.toFixed(1) +
      "° | Elevation " +
      currentSun.elevation.toFixed(1) +
      "°" +
      (currentSun.elevation < 0 ? " (unter Horizont)" : "");
  }

  function getChartFrameSize() {
    var rect = chartFrame.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  function renderForDateStable(activeDate, activeLocation, simulationMode) {
    var before = getChartFrameSize();
    renderForDate(activeDate, activeLocation, simulationMode);
    var after = getChartFrameSize();

    if (before.width !== after.width || before.height !== after.height) {
      renderForDate(activeDate, activeLocation, simulationMode);
    }
  }

  function maybeRefineAfterLoad() {
    if (postLoadRefineDone) {
      return;
    }
    postLoadRefineDone = true;

    setTimeout(function () {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.max(1, window.devicePixelRatio || 1);
      var expectedWidth = Math.round(rect.width * dpr);
      var expectedHeight = Math.round(rect.height * dpr);

      // Only refresh if the backing store does not match final CSS size.
      if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
        renderNow();
      }

      if (!chartRevealedAfterLoad) {
        chartRevealedAfterLoad = true;
        canvas.style.visibility = "visible";
      }
    }, 180);
  }

  function renderNow() {
    var now = new Date();
    var activeLocation = getActiveLocationEntry();
    if (state.isTestMode) {
      var simulatedDate = dateWithDayAndMinutesAtOffset(
        now.getFullYear(),
        state.simulatedDayOfYear,
        state.simulatedMinutes,
        getLocationUtcOffsetMinutes(activeLocation)
      );
      renderForDateStable(simulatedDate, activeLocation, true);
      return;
    }

    state.simulatedMinutes = minutesFromDate(now);
    state.simulatedDayOfYear = dayOfYearFromDate(now);
    timeSlider.value = String(state.simulatedMinutes);
    timeSliderValue.textContent = formatTimeFromMinutes(state.simulatedMinutes);
    daySlider.value = String(state.simulatedDayOfYear);
    daySliderValue.textContent = String(state.simulatedDayOfYear);
    renderForDateStable(now, activeLocation, false);
  }

  function onTestToggleClick() {
    setTestModeEnabled(!state.isTestMode);
    scheduleRender();
  }

  function onSliderInput() {
    state.simulatedMinutes = parseInt(timeSlider.value, 10);
    timeSliderValue.textContent = formatTimeFromMinutes(state.simulatedMinutes);
    if (state.isTestMode) {
      renderNow();
    }
  }

  function onDaySliderInput() {
    state.simulatedDayOfYear = parseInt(daySlider.value, 10);
    daySliderValue.textContent = String(state.simulatedDayOfYear);
    if (state.isTestMode) {
      renderNow();
    }
  }

  function onLocationChange() {
    if (state.isTestMode) {
      renderNow();
    }
  }

  function applyChartAspectRatio() {
    var ratio = config.chart.aspectRatioWidth + " / " + config.chart.aspectRatioHeight;
    chartFrame.style.setProperty("--chart-aspect-ratio", ratio);
  }

  function stopMinuteAlignedUpdates() {
    if (minuteTimeoutId) {
      clearTimeout(minuteTimeoutId);
      minuteTimeoutId = null;
    }
    if (minuteIntervalId) {
      clearInterval(minuteIntervalId);
      minuteIntervalId = null;
    }
  }

  function startMinuteAlignedUpdates() {
    stopMinuteAlignedUpdates();
    var now = new Date();
    var msIntoMinute = now.getSeconds() * 1000 + now.getMilliseconds();
    var delayToNextMinute = 60000 - msIntoMinute;
    if (delayToNextMinute === 60000) {
      delayToNextMinute = 0;
    }

    minuteTimeoutId = setTimeout(function () {
      renderNow();
      minuteIntervalId = setInterval(renderNow, 60000);
    }, delayToNextMinute);
  }

  function setupInitialRender() {
    if (initialRenderStarted) {
      return;
    }
    initialRenderStarted = true;

    var stableCount = 0;
    var lastWidth = -1;
    var lastHeight = -1;
    var attempts = 0;

    function tick() {
      attempts += 1;
      var rect = chartFrame.getBoundingClientRect();
      var width = Math.round(rect.width);
      var height = Math.round(rect.height);
      var isStable = width === lastWidth && height === lastHeight && width > 0 && height > 0;

      if (isStable) {
        stableCount += 1;
      } else {
        stableCount = 0;
        lastWidth = width;
        lastHeight = height;
      }

      if (stableCount >= 2 || attempts >= 24) {
        scheduleRender();
        maybeRefineAfterLoad();
        return;
      }
      requestAnimationFrame(tick);
    }

    if (document.readyState === "complete") {
      requestAnimationFrame(tick);
      return;
    }
    window.addEventListener("load", function () {
      requestAnimationFrame(tick);
    }, { once: true });
  }

  function start() {
    applyChartAspectRatio();
    populateLocationSelect();
    var now = new Date();
    state.simulatedDayOfYear = dayOfYearFromDate(now);
    state.simulatedMinutes = minutesFromDate(now);
    timeSlider.value = String(state.simulatedMinutes);
    timeSliderValue.textContent = formatTimeFromMinutes(state.simulatedMinutes);
    daySlider.value = String(state.simulatedDayOfYear);
    daySliderValue.textContent = String(state.simulatedDayOfYear);
    setTestModeEnabled(false);
    testToggle.addEventListener("click", onTestToggleClick);
    timeSlider.addEventListener("input", onSliderInput);
    daySlider.addEventListener("input", onDaySliderInput);
    locationSelect.addEventListener("change", onLocationChange);
    canvas.style.visibility = "hidden";
    setupInitialRender();
    startMinuteAlignedUpdates();
  }

  window.addEventListener("resize", function () {
    if (resizeDebounceTimeoutId !== null) {
      clearTimeout(resizeDebounceTimeoutId);
    }
    resizeDebounceTimeoutId = setTimeout(function () {
      resizeDebounceTimeoutId = null;
      scheduleRender();
    }, 120);
  });
  start();
})();
