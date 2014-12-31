var init = require('./includes/init.js');
var config = init.config;
var log = init.functions;
log.init(config);

var http = require('http');
var path = require('path');
var express = require('express');
var socketio = require('socket.io');
var _ = require('underscore');
var querystring = require('querystring');
var mongo =         require('mongodb');
var monk =          require('monk');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
var db = monk(config.dbuser + ":" + config.dbpass + "@" + config.dburl + ':' + config.dbport + '/' + config.dbname);
var series = db.get(config.dbtable);

router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function(socket){
    log.info("Client Connected");

    socket.on('getTimes', function(m)
    {
        log.info('Client request getTimes"');
        log.debug('Client request info: ');
        log.debug(m, true);
        var timestamp = [];
        var r = series.find(
        {
            title: m.show,
            season: m.season,
            episode: m.episode,
            year: m.year
        },
        {
            stream: true
        })
        .each(
            function(doc)
            {
                timestamp.push(doc.date);
            })
        .error(
            function(err)
            {
                log.warning('getTimes request failed: ');
                log.warning(err, true);
                return false;
            })
        .success(
            function()
            {
                log.info('getTimes request success, sending sendTimes with info: ');
                log.info(timestamp, true);

                socket.emit('sendTimes', timestamp);
            })
    })

    var se = [];
    var l = 0;
    _.each(config.series, function(v, k)
    {
        var query = "http://omdbapi.com/?";
        query += querystring.stringify({
            i: v,
            p: "full",
            r: "json"
        })
        log.debug('Requesting query from ' + query);

        http.get(query, onResponse).on('error', onError);
        var data;
        function onResponse(res)
            {
                log.debug('Got a response');
                res.on('data', onData).on('error', onError).on('end', onEnd);
            }
            function onData(res)
            {
                log.debug('Translating the response to utf8');
                data = res.toString('utf8');
                log.debug('Data: ');
                log.debug(data, true);
            }
            function onError(err)
            {
                log.warning('Got a error on response: ');
                log.warning(err);
            }
            function onEnd()
            {
                var str = JSON.parse(data);
                var ser = {};

                var year = /([0-9]{4}).+/g.exec(str.Year)[1];
                log.debug('Starting to loop through the ' + str.title + ' serie!');
                var m = series.find(
                    {
                        title: str.Title,
                        year: year
                    },
                    {
                        stream: true
                    }
                )
                .each(
                    function(doc)
                    {
                        ser = doc;
                        ser.desc = str.Plot;
                    }
                )
                .error(
                    function(err)
                    {
                        log.warning('Ran into a problem when looping: ');
                        log.warning(err, true);
                        return false;
                    }
                )
                .success(
                    function()
                    {
                        log.debug('Done looping, sending sendEpisodes with the information: ');
                        log.debug(ser, true);
                        socket.emit('sendEpisodes', ser);
                    }
                );
            }
    })
});

server.listen(config.serverport, config.serverip, function(){
    var addr = server.address();
    log.log("Showplanner server listening at " + addr.address + ":" + addr.port);
});
