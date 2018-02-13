// var express = require('express');
// var app = express();
// var route = require("./server/route.js")(app, express);
// var util = require('util');

// var userDao = require("./server/userDao.js");


// app.use('/static/', express.static(__dirname + "/app"));
// app.engine('html', require('ejs').renderFile);

// var port = process.env.PORT || 4443;

// var server = app.listen(port, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
//     console.log('Example app listening at  http://localhost:%s', port);
// });


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        // client.emit('messages', 'Hello from server');
    });

    client.on('messages', function(data) {
        console.log(data);
        client.emit('broad', data);
        client.broadcast.emit('broad', data);
    });

});

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/app/index.html');
});

server.listen(4443);
