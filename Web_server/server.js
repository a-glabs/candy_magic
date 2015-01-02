// websocket things
var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;
var Instagram = require('instagram-node-lib');
var hashtag = 'put HASHTAG here to track';
var clientID = 'your Instagram-API client ID here',
    clientSecret = 'your Instagram-API sercret key here';

var server_url = 'your server url here';

var connections=[];
var count = 0;
/**
 * Set the configuration
 */
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', server_url+'/callback');
Instagram.set('redirect_uri', server_url);
Instagram.set('maxSockets', 10);
Instagram.subscriptions.unsubscribe({ id: '4038384' });
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: hashtag,
  aspect: 'media',
  callback_url: server_url+'/callback',
  type: 'subscription',
  id: '#'
});

//app.use(express.static(__dirname + '/'));

/**
 * Set your app main configuration
 */
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler());
});


var server = http.createServer(app);
server.listen(port);


//console.log('httcop server listening on %d', port);

var wss = new WebSocketServer({server: server});
//console.log('websocket server created');
wss.on('connection', function(ws) {
    var id = count++;
    connections[id] = ws;
    //connections.push(ws);

    setInterval(function() {
        sendAll('ping');
    }, 30000);
    //console.log((new Date()) + 'websocket connection opened [' + id + ']');
    //

    ws.on('message', function(message) {
    });
    
    ws.on('close', function(message) {
        //connections.pop(ws);

        delete connections[id];       
    });
    
});

app.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

/**
 * for each new post Instagram send us the data
 */
app.post('/callback', function(req, res) {
    var data = req.body;

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+clientID;
      //sendMessage(url);
      
    });
    res.end();
    sendAll("I've got something");
});

function sendAll(data)
{
for(var i=0;i<connections.length;i++)
    {
    if(connections[i] != null) {
        try{
           connections[i].send(data); 
        }catch (e){
            console.log(e);
        }
     }
    }
}
