var polyline = require('polyline');
var GeoJSON = require('geojson');
var tokml = require('tokml');

// returns an array of lat, lng pairs (y,x)
var decodedArray = polyline.decode('_~ojF~rtfP`CLDjNiHPInJSwJsHD');
var xyPoints = [];

// re-order coordinates into (x,y) format
decodedArray.forEach(function(point, i) {
	xyPoints.push([point[1],point[0]]);
});

var lineString = GeoJSON.parse({ 'line': xyPoints}, {'LineString' : 'line'});
var kml = tokml(lineString);

console.log(kml);
