var polyline = require('polyline');
var GeoJSON = require('geojson');
var tokml = require('tokml');
var fs = require('fs');

var features = [],
	activityDict = [],
	duplicates = 0,
	noPolys = 0;

var dir = 'data/strava';

fs.readdirSync(dir).forEach(function(fileName, index) {

	var file = fs.readFileSync(dir + '/' + fileName);
	var activities = JSON.parse(file);

	activities.forEach(function(activity, i) {

		if (activityDict[activity.id] === undefined) {

			if (activity.map.summary_polyline && activity.map.summary_polyline.length > 0) {
				// returns an array of lat, lng pairs (y,x)
				var decodedArray = polyline.decode(activity.map.summary_polyline);
				var xyPoints = [];

				// re-order coordinates into (x,y) format
				decodedArray.forEach(function(point, i) {
					xyPoints.push([point[1],point[0]]);
				});

				features.push({ 'line': xyPoints});
				activityDict[activity.id] = 1;
			}
			else noPolys++;
		}
		else duplicates++;
	});
});

// convert JSON --> geoJSON --> kml
var lineString = GeoJSON.parse(features, {'LineString' : 'line'});
var kml = tokml(lineString);

fs.writeFileSync('activities.kml', kml);

console.log(features.length + ' unique activities processed');
console.log(duplicates + ' duplicate activities found');
console.log(noPolys + ' activities were missing map data');