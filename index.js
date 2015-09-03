var http = require('http');
var request = require('request');

var server = http.createServer(function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

  function isAgileDeploy(msg) {
    return (msg.indexOf('[agileEMAIL]') == 0) && msg.match(/to Done/);
  }

  req.on('end', function() {
    if(body.indexOf('payload') == 0) {
      body = body.slice('payload='.length);
      body = decodeURIComponent(body.replace(/\+/g, ' '));
    }

    if(body[0] != '{') {
      console.log("NOT JSON! " + body);
      res.writeHead(500, {});
      res.end("NO");
      return;
    }

    var payload = JSON.parse(body);

    if(isAgileDeploy(payload.text)) {
      payload.text = ":tada: " + payload.text + " :tada:";

      console.log("Posting to clubhouse: " + payload.text);
      request.post(process.env.SLACK_HOOK_URL, {
        body: JSON.stringify(payload)
      }, function(err, httpResponse, body) {
        if(err) {
          console.log(err);
        } else {
          console.log("Response from slack: " + httpResponse.body);
        }
      });
    } else {
      console.log("Not posting to clubhouse: " + payload.text);
    }

    res.writeHead(200, {});
    res.end();
  });
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});
