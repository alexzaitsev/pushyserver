var express = require('express');
var app = express();
var server = require('http').createServer(app);
var Pushy = require('pushy-node');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json	
 
// Plug in your Secret API Key 
// Get it here: https://app.pushy.me/ 
var pushyAPI = new Pushy('319dacb71a6ceb32d4e943b19045844db777610c11920094165605785014eed8');
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

app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function() {
  console.log('created express server on port ' + app.get('port'));
});