var express = require('express');
var path = require('path');

var app = express();
var port = 3000;
var publicPath = path.resolve(__dirname + '/../dist');

app.use(express.static(publicPath));

app.get('/*', function(req, res){
  res.sendFile(publicPath + '/index.html')
});

app.listen(port, function(){
  console.log('Listening on port', port);
});
