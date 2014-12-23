var socket = io.connect();
var series =
[
    "tt1586680", // Shameless
    "tt2467372", // Brooklyn Nine-Nine
    "tt3489184", // Constantine
    "tt3079768", // Dominion
    "tt3487382", // Forever
    "tt3749900", // Gotham
    "tt3205802", // How To Get Away With Murder
    "tt3501074", // Madam Secretary
    "tt2364582", // Marvels Agents of S.H.I.E.L.D
    "tt1843230", // Once Upon a Time
    "tt1839578", // Person of Interest
    "tt0455275", // Prison Break
    "tt0965394", // Sanctuary
    "tt3514324", // Scorpion
    "tt2193021", // Arrow
    "tt2741602", // The Blacklist
    "tt3107288", // The Flash
    "tt3663490", // The Librarians
    "tt1196946", // The Mentalist
    "tt2632424", // The Originals
    "tt2660734", // The Tomorrow People
    "tt1405406"  // The Vampire Diaries
]

socket.emit('getSeries', series);
console.log("Socket emit \"getSeries\"");
$(document).on('click', ".collSerie", function()
{
    $(this).parent().parent().siblings(".seasons").toggle();
    $(this).closest(".info").find(".description").toggleClass("overflow");
})
$(document).on('click', ".collSeason", function()
{
    $(this).parent().parent().siblings("ul").toggle();
})
$(document).on('click', ".episodeInfo", function()
{
    var season;
    var episode;
    var show;
    var year;
    var t = $(this)

    episode = t.find('.Title p').text().replace('Episode ', '');
    season = t.closest(".season").find(".seasonInfo .Title").text().replace('Season ', '');
    show = t.closest(".Serie").find(".info .name").text();
    year = t.closest('.Serie').data('year');

    socket.emit('getTimes', {episode: episode, season: season, show: show, year: year});
})

socket.on('sendTimes', function(p)
{
    var str = "";
    var i = 0;
    _.each(p, function(k, v)
    {
        str += k + "\n";
    })
    alert(str);
})

socket.on('sendEpisodes', function(m)
{
    var Series = $(".Series");
        var Serie = $('<div></div>');
        Serie.addClass('Serie');
            var info = $('<div></div>');
            info.addClass('row');
            info.addClass('info');
                var colp = $('<div></div>');
                colp.addClass('col-xs-3');
                    var name = $('<p></p>');
                    name.addClass("name");
                    name.text(m.title);
                    colp.append(name);
                info.append(colp);
                var colm = $('<div></div>');
                colm.addClass('col-xs-7');
                    var description = $('<p></p>');
                    description.addClass("description");
                    description.addClass("overflow");
                    description.text(m.desc);
                    colm.append(description);
                info.append(colm)
                var coll1 = $('<div></div>');
                coll1.addClass('col-xs-offset-1');
                coll1.addClass('col-xs-1');
                    var collp1 = $('<p></p>')
                    collp1.addClass('coll');
                    collp1.addClass('collSerie');
                    collp1.addClass('glyphicon');
                    collp1.addClass('glyphicon-collapse-down');
                    coll1.append(collp1);
                info.append(coll1);
            Serie.append(info);
        _.each(m.season, function(v, k)
        {
            if (v == null)
            {
                return;
            }
            var seasons = $('<div></div>');
            seasons.addClass('seasons');
            seasons.addClass('row');
                var scol = $('<div></div>');
                scol.addClass('col-xs-12');
                    var ul = $('<ul></ul>');
                        var li = $('<li></li>');
                        li.addClass('season');
                            var seasonInfo = $('<div></div>');
                            seasonInfo.addClass('seasonInfo');
                            seasonInfo.addClass('row');
                                var seasonDiv1 = $('<div></div>');
                                seasonDiv1.addClass('col-xs-11');
                                    var seasonDP1 = $('<p></p>');
                                    seasonDP1.addClass('Title');
                                    seasonDP1.text('Season ' + k);
                                    seasonDiv1.append(seasonDP1);
                                seasonInfo.append(seasonDiv1);
                                var seasonDiv2 = $('<div></div>');
                                seasonDiv2.addClass('col-xs-1');
                                    var seasonDP2 = $('<p></p>');
                                    seasonDP2.addClass('coll');
                                    seasonDP2.addClass('collSeason');
                                    seasonDP2.addClass('glyphicon');
                                    seasonDP2.addClass('glyphicon-collapse-down');
                                    seasonDiv2.append(seasonDP2);
                                seasonInfo.append(seasonDiv2);
                            li.append(seasonInfo);
                            var ulEp = $('<ul></ul>');
                                _.each(v, function(s, p)
                                {
                                    if (s == null)
                                    {
                                        return;
                                    }
                                    var liEp = $('<li></li>');
                                    liEp.addClass('episodes');
                                        var episodeInfo = $('<div></div>');
                                        episodeInfo.addClass('episodeInfo');
                                        episodeInfo.addClass('row');
                                            var epDiv1 = $('<div></div>');
                                            epDiv1.addClass('col-xs-2');
                                            epDiv1.addClass('Title');
                                                var epP1 = $('<p></p>');
                                                epP1.text('Episode ' + p);
                                                epDiv1.append(epP1);
                                            episodeInfo.append(epDiv1);
                                            var epDiv2 = $('<div></div>');
                                            epDiv2.addClass('col-xs-7');
                                            epDiv2.addClass('Desc');
                                                var epP2 = $('<p></p>');
                                                epP2.text(s);
                                                epDiv2.append(epP2);
                                            episodeInfo.append(epDiv2);
                                            var epDiv3 = $('<div></div>');
                                            epDiv3.addClass('col-xs-2');
                                            epDiv3.addClass('TimeStamp');
                                                var epP3 = $('<p></p>');
                                                epP3.text('Episode ' + p);
                                                epDiv3.append(epP3);
                                            episodeInfo.append(epDiv3);
                                        liEp.append(episodeInfo);
                                    ulEp.append(liEp);
                                });
                                li.append(ulEp);
                            ul.append(li);
                        scol.append(ul);
                    seasons.append(scol);
                Serie.append(seasons);
            Series.append(Serie);
        })
        Serie.data('year', m.year);
        console.log(Serie.data('year'));
        console.log(m.year);
    })