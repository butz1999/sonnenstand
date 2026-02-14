(function () {
  var DEG_TO_RAD = Math.PI / 180;
  var RAD_TO_DEG = 180 / Math.PI;
  var MINUTES_PER_DAY = 1440;

  function parseLocation(locationString) {
    var parts = locationString.split(",").map(function (v) { return parseFloat(v.trim()); });
    if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) {
      throw new Error("Ungueltiger Standort-String. Erwartet: 'lat, lon'");
    }
    return { latitude: parts[0], longitude: parts[1] };
  }

  function dayOfYear(date) {
    var start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    return Math.floor((date - start) / 86400000);
  }

  function solarForDate(date, latitude, longitude) {
    var utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    var gamma = (2 * Math.PI / 365) * (dayOfYear(date) - 1 + (utcMinutes - 720) / MINUTES_PER_DAY);

    var eqTime =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));

    var decl =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    var trueSolarMinutes = (utcMinutes + eqTime + 4 * longitude + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    var hourAngleDeg = trueSolarMinutes / 4 - 180;
    var hourAngle = hourAngleDeg * DEG_TO_RAD;
    var latRad = latitude * DEG_TO_RAD;

    var cosZenith =
      Math.sin(latRad) * Math.sin(decl) +
      Math.cos(latRad) * Math.cos(decl) * Math.cos(hourAngle);
    var safeCosZenith = Math.min(1, Math.max(-1, cosZenith));
    var zenith = Math.acos(safeCosZenith);
    var elevation = 90 - zenith * RAD_TO_DEG;

    var azimuth = Math.atan2(
      Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(latRad) - Math.tan(decl) * Math.cos(latRad)
    );
    var azimuthDeg = (azimuth * RAD_TO_DEG + 180 + 360) % 360;

    return {
      azimuth: azimuthDeg,
      elevation: elevation
    };
  }

  function createSeasonDates(year) {
    return [
      { label: "Dez", colorKey: "decemberSolstice", date: new Date(Date.UTC(year, 11, 21, 12, 0, 0)) },
      { label: "Jan/Nov", colorKey: "otherData", date: new Date(Date.UTC(year, 0, 21, 12, 0, 0)) },
      { label: "Feb/Okt", colorKey: "otherData", date: new Date(Date.UTC(year, 1, 21, 12, 0, 0)) },
      { label: "März/Sep", colorKey: "solarEquinox", date: new Date(Date.UTC(year, 2, 21, 12, 0, 0)) },
      { label: "Apr/Aug", colorKey: "otherData", date: new Date(Date.UTC(year, 3, 21, 12, 0, 0)) },
      { label: "Mai/Juli", colorKey: "otherData", date: new Date(Date.UTC(year, 4, 21, 12, 0, 0)) },
      { label: "Juni", colorKey: "juneSolstice", date: new Date(Date.UTC(year, 5, 21, 12, 0, 0)) }
    ];
  }

  function computeDayPath(baseDateUtc, latitude, longitude, sampleStepMinutes) {
    var path = [];
    for (var m = 0; m < MINUTES_PER_DAY; m += sampleStepMinutes) {
      var sample = new Date(Date.UTC(
        baseDateUtc.getUTCFullYear(),
        baseDateUtc.getUTCMonth(),
        baseDateUtc.getUTCDate(),
        0,
        m,
        0
      ));
      var pos = solarForDate(sample, latitude, longitude);
      if (pos.elevation >= 0) {
        path.push(pos);
      }
    }
    return path;
  }

  function computeSeasonPaths(year, latitude, longitude, sampleStepMinutes) {
    return createSeasonDates(year).map(function (item) {
      return {
        label: item.label,
        colorKey: item.colorKey,
        points: computeDayPath(item.date, latitude, longitude, sampleStepMinutes)
      };
    });
  }

  window.SolarMath = {
    parseLocation: parseLocation,
    solarForDate: solarForDate,
    computeSeasonPaths: computeSeasonPaths
  };
})();
