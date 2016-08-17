var express = require('express');
var app = express();
var server = require('http').createServer(app);
var Pushy = require('pushy-node');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json	
 
// memory storage for device id 
var tokens;
 
app.get('/', function (req, res) {
  	res.render('index');
});

app.post('/add_device', function(req, res) {
	// Insert target device token(s) here 
	tokens = [req.body.deviceid];
	res.send({status: 200});
});

app.post('/send', function(req, res) {
	// Set push payload data to deliver to device(s) 
	var data = {
	    message: req.body.message
	};
	// Send push notification via the Send Notifications API 
	// https://pushy.me/docs/api/push-notifications 
	// Set optional push notification options (such as TTL) 
	var options = {
	    // Set the notification to expire if not delivered within 30 seconds 
	    time_to_live: 30
	};
	var pushyAPI = new Pushy('0601818e16928f5ffd518a4d09a619aa4f4e956b63f681c05a08f086cf6156c4');
	pushyAPI.sendPushNotification(data, tokens, options, function (err, id) {
    	// Log errors to console 
    	        console.log("tokens: " + tokens);
    		if (!err || JSON.stringify(err) === '{}') {
        		res.send({status: 200});
    		} else {
			res.send({status: 'sending ' + JSON.stringify(data) + ' to ' + JSON.stringify(tokens) + ' and got error ' + JSON.stringify(err)});
		}
		console.log("sendpush_success. err: " + JSON.stringify(err) + " id: " + id);
	});
});

app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function() {
  console.log('created express server on port ' + app.get('port'));
});
