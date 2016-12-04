var polyline = require('polyline');
var GeoJSON = require('geojson');
var tokml = require('tokml');
var fs = require('fs');


var stravaFile = fs.readFileSync("activities.json");
var activities = JSON.parse(stravaFile);
var features = [];

activities.forEach(function(activity) {

	if (activity.map.summary_polyline && activity.map.summary_polyline.length > 0) {
		// returns an array of lat, lng pairs (y,x)
		var decodedArray = polyline.decode(activity.map.summary_polyline);
		var xyPoints = [];

		// re-order coordinates into (x,y) format
		decodedArray.forEach(function(point, i) {
			xyPoints.push([point[1],point[0]]);
		});

		features.push({ 'line': xyPoints});
	}
});

var lineString = GeoJSON.parse(features, {'LineString' : 'line'});
var kml = tokml(lineString);

console.log(features.length + ' activities processed');

fs.writeFileSync('activities.kml', kml);