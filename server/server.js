var express = require('express');
var path = require('path');

var app = express();
var port = 3000;
var publicPath = path.resolve(__dirname, 'client');

app.use(express.static(publicPath));

app.listen(port, function(){
  console.log('Listening on port', port);
})