var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var socketio = require('socket.io');
var imdb = require('imdb-api');
var _ = require('underscore');
var querystring = require('querystring');
var mongo =         require('mongodb');
var monk =          require('monk');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
var db = monk('localhost:27017/imdb');
var series = db.get('series');

router.use(express.static(path.resolve(__dirname, 'client')));

io.set('log level', 1);

io.on('connection', function(socket){
    console.log("Client Connected");

    socket.on('getTimes', function(m)
    {
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
                console.log(doc);
            })
        .error(
            function(err)
            {
                console.log(err)
                return false;
            })
        .success(
            function()
            {
                socket.emit('sendTimes', timestamp);
                console.log(timestamp);
            })
    })

    socket.on('getSeries', function(msg){
        console.log("Client request \"getSeries\"");
        _.each(msg, function(v, k)
        {
            var query = "http://omdbapi.com/?";
            query += querystring.stringify({
                i: v,
                p: "full",
                r: "json"
            });

            http.get(query, onResponse).on('error', onError);
            var data;

            function onResponse(res)
            {
                res.on('data', onData).on('error', onError).on('end', onEnd);
            }
            function onData(res)
            {
                data = res.toString('utf8');
            }
            function onError(err)
            {
                console.log(err);
            }
            function onEnd()
            {
                var str = JSON.parse(data);
                var ser = {};

                ser.title = str.Title;
                ser.year = parseInt(str.Year).toString();
                ser.desc = str.Plot;
                ser.season = []

                var m = series.find(
                    {
                        title: ser.title,
                        year: ser.year
                    },
                    {
                        stream: true
                    }
                )
                .each(
                    function(doc)
                    {
                        if (!ser.season[doc.season]) ser.season[doc.season] = [];
                        ser.season[doc.season][doc.episode] = doc.desc;
                    }
                )
                .error(
                    function(err)
                    {
                        console.log(err);
                        return false;
                    }
                )
                .success(
                    function()
                    {
                        socket.emit('sendEpisodes', ser);
                    }
                );
            }
        })
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Showplanner server listening at", addr.address + ":" + addr.port);
});
