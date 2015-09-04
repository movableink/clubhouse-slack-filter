var http = require('http');
var request = require('request');

var messageMatch = process.env.CLUBHOUSE_MESSAGE_REGEX || ".*";
var embellishment = process.env.EMBELLISHMENT || "|MESSAGE|";

function matchesMessage(msg) {
  return msg.match(messageMatch);
}

var server = http.createServer(function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });

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

    if(matchesMessage(payload.text)) {
      payload.text = embellishment.replace(/\|MESSAGE\|/g, payload.text);

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
