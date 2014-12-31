var socket = io.connect();

//socket.emit('getSeries', series);
console.log("Socket emit \"getSeries\"");
$(document).on('click', ".collSerie", function()
{
    console.log("meow");
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
        var Serie = $('<div class="Serie"></div>');
            var info = $("<div class='row info'></div>");
                var colp = $('<div class="col-xs-3"></div>');
                    var name = $("<p class='name'>" + m.title + "</p>");
                colp.append(name);

                var colm = $("<div class='col-xs-7'></div>");
                    var description = $("<p class='description overflow'>" + m.desc + "</p>");
                colm.append(description);

                var coll1 = $("<div class='col-xs-offset-1 col-xs-1'></div>");
                    var collp1 = $("<p class='coll collSerie glyphicon glyphicon-collapse-down'></p>");
                coll1.append(collp1);
            info.append(colp);
            info.append(colm);
            info.append(coll1);
        Serie.append(info);
        _.each(m.serie, function(v, k)
        {
            if (v == null)
            {
                return;
            }

            var seasons = $("<div class='seasons row'></div>");
                var scol = $("<div class='col-xs-12'></div>");
                    var ul = $("<ul></ul>");
                        var li = $("<li class='season'></li>");
                            var seasonInfo = $("<div class='seasonInfo row'></div>");
                                var seasonDiv1 = $("<div class='col-xs-11'></div>");
                                    var seasonDP1 = $("<p class='Title'>Season " + k + "</p>");
                                seasonDiv1.append(seasonDP1)
                            seasonInfo.append(seasonDiv1);

                                var seasonDiv2 = $("<div class='col-xs-1'></div>");
                                    var seasonDP2 = $("<p class='coll collSeason glyphicon glyphicon-collapse-down'>");
                                seasonDiv2.append(seasonDP2);
                            seasonInfo.append(seasonDiv2);
                        li.append(seasonInfo);
                        var ulEp = $("<ul></ul>");
                            _.each(v, function(s, p)
                            {
                                if (s == null)
                                {
                                    return;
                                }

                                var liEp = $('<li class="episodes"></li>');
                                    var episodeInfo = $("<div class='episodeInfo row'></div>");
                                        var epDiv1 = $("<div class='col-xs-2 Title'></div>");
                                            var epP1 = $("<p>Episode " + p + "</p>");
                                        epDiv1.append(epP1);

                                        var epDiv2 = $("<div class='col-xs-7 Desc'></div>");
                                            var epP2 = $('<p>' + s.desc + "</p>");
                                        epDiv2.append(epP2);

                                        var epDiv3 = $("<div class='col-xs-2' TimeStamp'></div>");
                                            var epP3 = $('<p>TimeStamp</p>');
                                        epDiv3.append(epP3);
                                    episodeInfo.append(epDiv1);
                                    episodeInfo.append(epDiv2);
                                    episodeInfo.append(epDiv3);
                                liEp.append(episodeInfo);
                                ulEp.append(liEp);
                            })
                        li.append(ulEp);
                    ul.append(li);
                scol.append(ul);
            seasons.append(scol);
            Serie.append(seasons);
            Series.append(Serie);
        })
    Serie.data('year', m.year);
})