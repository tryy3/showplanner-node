var http =          require('http');
var fs =            require('fs');
var download =      require('get-down');
var mkdirp =        require('mkdirp');
var ProgressBar =   require('progress');
var _ =             require('underscore');
var mongo =         require('mongodb');
var monk =          require('monk');
var rd =            require('readline');

var db = monk('localhost:27017/imdb');
var series = db.get('series');

var downloadURL = function(tmp, folder, name, extension, url)
{
    this.tmp = tmp + folder;
    this.name = name;
    this.file = name + extension;
    this.url = url + this.file;
};

var file = new downloadURL("tmp/", "release/", "release-dates.list", ".gz", "http://ftp.sunet.se/pub/tv+movies/imdb/");

var createFolder = function()
{
    console.log("Creating directory " + file.tmp + ", stand by...");
    mkdirp(file.tmp, function(err) {
        console.log("Checking for errors.");
        if (err)
        {
            console.log(err);
            return false;
        }

        console.log("No errors found, the directory " + file.tmpFo + " has now been created.");
        downloadFile();
    });
}

var downloadFile = function()
{
    // Download the file and save it locally.
    console.log("Downloading a file called " + file.name + " from the url " + file.url + " and saving it at " + file.tmp);
    var bar;
    var lastRec;
    download(file.url,
    {
        dest: file.tmp,
        extract: true
    }).on('progress', function(state)
    {
        console.log(state);
        if (state.retry) {
            var delay = Math.round(state.timeout / 1000) + 's';
            console.log('Download failed, retrying again in ' + delay);
        } else {
            if (!bar) {
                bar = new ProgressBar('  downloading [:bar] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: state.total
                });
                bar.tick(state.received);
            }
            bar.tick(state.received - lastRec);
            lastRec = state.received
        }
    }).on('error', function(err) {
        console.log(err);
    }).on('end', function(dest) {
        console.log("File has now been downloaded and extracted into the folder " + file.tmp);
        initilizeDB();
    });
}

var initilizeDB = function()
{
    console.log("Starting the process of inserting everything from the file to the db.");

    console.log("Starting to read the file " + file.name + "...");

    var i; 
    var count = 0;
    var insertBar;
    var filestream = fs.createReadStream(file.tmp + file.name)
        .on('data', function(chunk)
            {
                for (i = 0; i < chunk.length; i++)
                {
                    if(chunk[i] == 10) count++;
                }
            })
        .on('end', function()
            {
                console.log("The file length is " + count);
                console.log("Starting to setup the insert progressbar!");
                insertBar = new ProgressBar('     reading [:bar] :percent :etas {:current/:total lines}', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: count + 1
                });
                insertDB(insertBar);
            })

}

var insertDB = function(insertBar)
{
    var c = 0;
    var max = 1000;
    console.log("Starting to insert the data to the db.")

    var r = rd.createInterface({
        input: fs.createReadStream(file.tmp + file.name),
        output: process.stdout,
        terminal: false
    })
    r.on('line', function(data)
    {
        if (c >= max)
        {
            insertBar.tick(c);
            c = 0;
            max = Math.floor((Math.random() * 500) + 1);
        }
        else
        {
            c++;
        }
        var test = /(\".+\").+(\([0-9]+\)).+{(.+)?\(#([0-9]+)\.([0-9]+)\)}(.+)/g;
        var p = test.exec(data);

        if (p)
        {
            var title = p[1].replace(/\"/g, '');
            var year = p[2].replace('(', '').replace(')', '');
            var desc = p[3];
            var season = p[4];
            var episode = p[5];
            var date = p[6].replace(/\t/g, '');
            series.insert({
                title: title,
                year: year,
                desc: desc,
                season: season,
                episode: episode,
                date: date
            });
        }
    })

    r.on('close', function()
    {
        console.log("Closing the file");
        console.log("Closing the datbase");
        db.close();
    })
}

//createFolder();
initilizeDB();