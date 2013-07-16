var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var fileBuffer = fs.readFileSync('index.html');
var outString = fileBuffer.toString();

app.get('/', function(request, response) {
//  response.send('Hello World 2!');
    response.send(outString);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
