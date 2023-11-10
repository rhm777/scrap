
var net = require('net');
var stream = net.connect('/tmp/test.sock');


obj = {"title":"twitter post test_5","content":"this is a test content_5..."}
obj_str = JSON.stringify ( obj )
stream.write ( obj_str );


stream.end();