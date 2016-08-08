var express = require('express');
var app = express();
var Pushy = require('pushy-node');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json	
 
// Plug in your Secret API Key 
// Get it here: https://app.pushy.me/ 
var pushyAPI = new Pushy('7064401b1eb5b0f611326af13c8c5b1fff6f46b6766b2d26a46bf50b76e504d2');
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
	pushyAPI.sendPushNotification(data, tokens, options, function (err, id) {
    	// Log errors to console 
    	if (err) {
        	res.send({status: err});
    	}
    
    	// Log success 
    	res.send({status: 200});
	});
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});