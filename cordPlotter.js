const RADIUS_OF_EARTH = 6371000; //m

function birdDistance(start, end) {
  const lat1Rads = toRadians(start.lat);
  const lat2Rads = toRadians(end.lat);
  const deltaLat = toRadians(end.lat - start.lat);
  const deltaLng = toRadians(end.lon - start.lon);
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1Rads) * Math.cos(lat2Rads) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = RADIUS_OF_EARTH * c;
  return d;
}

function toRadians(val) {
  return (Math.PI / 180) * val;
}

function toDegrees(val) {
  return (180 / Math.PI) * val;
}

function calculateBearing(start, end) {
  const startLat = toRadians(start.lat);
  const startLong = toRadians(start.lon);
  const endLat = toRadians(end.lat);
  const endLong = toRadians(end.lon);
  let dLong = endLong - startLong;
  const dPhi = Math.log(Math.tan((endLat / 2.0) + (Math.PI / 4.0)) / Math.tan((startLat / 2.0) + (Math.PI / 4.0)));
  if (Math.abs(dLong) > Math.PI) {
    if (dLong > 0.0) {
      dLong = -(2.0 * Math.PI - dLong);
    }
    else {
      dLong = (2.0 * Math.PI + dLong);
    }
  }
  const bearing = (toDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  return bearing;
}

function getDestinationCoord(start, azimuth, converedDist) {
  const radiusKm = RADIUS_OF_EARTH / 1000; //Radius of the Earth in km
  const brng = toRadians(azimuth); //Bearing is degrees converted to radians.
  const d = converedDist / 1000; //Distance m converted to km
  const lat1 = toRadians(start.lat); //Current dd lat point converted to radians
  const lon1 = toRadians(start.lon); //Current dd long point converted to radians
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / radiusKm) + Math.cos(lat1) * Math.sin(d / radiusKm) * Math.cos(brng));
  const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / radiusKm) * Math.cos(lat1), Math.cos(d / radiusKm) - Math.sin(lat1) * Math.sin(lat2));
  //convert back to degrees
  const lat = toDegrees(lat2);
  const lon = toDegrees(lon2);
  return { lat, lon };
}

function plotLineCoords(start, end, interval) {
  const azimuth = calculateBearing(start, end);
  const length = birdDistance(start, end);
  const distBetweenPoints = length / interval;
  let converedDist = interval;
  const coords = [start];
  for (let i = 0; i < distBetweenPoints; i += interval) {
    coords.push(getDestinationCoord(start, azimuth, converedDist))
    converedDist += interval;
  }
  coords.push(end);
  return coords;
}

module.exports = {
  plotLineCoords
}