var express = require( 'express')
var app = express()
var cf_app = require( './app/vcap_application')
var cf_svc = require( './app/vcap_services')
var rest = require('restler');

app.set( 'views', __dirname + '/views')
app.set( 'view engine', 'jade')
app.use( express.static( __dirname + '/public'))

app.get( '/', function ( req, res) {
  res.render( 'pages/index', {
    app_environment:    app.settings.env,
    application_name:   cf_app.get_app_name(),
    app_uris:           cf_app.get_app_uris(),
    app_space_name:     cf_app.get_app_space(),
    app_index:          cf_app.get_app_index(),
    app_mem_limits:     cf_app.get_app_mem_limits(),
    app_disk_limits:    cf_app.get_app_disk_limits(),
    service_label:      cf_svc.get_service_label(),
    service_name:       cf_svc.get_service_name(),
    service_plan:       cf_svc.get_service_plan()
  })
})


app.get( '/health', function ( req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: 'UP' }, null, 3));
})


function fortune(url, res) {
    rest.get(url).on('complete', function(result) {
        if (result instanceof Error) {
            console.log('Error:', result.message);
            res.status(500).send(result.message);
        } else {
            console.log('REST response: ', result);
            res.status(200).send(result);
        }
    });
}

app.get( '/javafortune', function ( req, res) {
    fortune('http://localhost:8087/fortunes/random', res);
    //fortune('http://fortunes-rhardt.cfapps.io/random', res);
})

app.get( '/rubyfortune', function ( req, res) {
    fortune('http://localhost:8087/ruby-demo/javafortune', res);
})

app.get( '/pythonfortune', function ( req, res) {
    fortune('http://localhost:8087/python-demo/javafortune', res);
})

app.get( '/gofortune', function ( req, res) {
    fortune('http://localhost:8087/go-demo/javafortune', res);
})

app.get( '/dockerfortune', function ( req, res) {
    fortune('http://localhost:8087/docker-demo/javafortune', res);
})




app.listen( process.env.PORT || 4000)
