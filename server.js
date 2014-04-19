var followRedirect = require('follow-redirects'),
    fs    = require('fs'),
    express = require('express'),
    qs    = require('querystring');

// Load config defaults from JSON file.
// Environment variables override defaults.
function loadConfig() {
  var config = JSON.parse(fs.readFileSync(__dirname+ '/config.json', 'utf-8'));
  for (var i in config) {
    config[i] = process.env[i.toUpperCase()] || config[i];
  }
  console.log('Configuration');
  console.log(config);
  return config;
}

var config = loadConfig();
var app = express();

// Convenience for allowing CORS on routes - GET only
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/download', function(req, res) {
	console.log("/download");
	var url = req.param('url');
	if(!url) {
		res.send("No URL parameter", 500);
	}
	else if(url.indexOf("http://") === 0) {
		followRedirect.http.get(url, function(response) {
			response.pipe(res);
		});
	}
	else if(url.indexOf("https://") === 0) {
		followRedirect.https.get(url, function(response) {
			response.pipe(res);
		});
	}
	else {
		res.send("Unknown protocol", 500);
	}
});

var port = process.env.PORT || config.port || 9999;

app.listen(port, null, function (err) {
	console.log('Server started: http://localhost:' + port);
});
