var express = require('express'),
path = require('path');
var app = express();

app.use('/', express.static('public'));
app.use("/bower", express.static(path.join(__dirname, '..', 'bower_components')));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});