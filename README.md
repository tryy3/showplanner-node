     __ _                         _                                  _               _ _     
    / _\ |__   _____      ___ __ | | __ _ _ __  _ __   ___ _ __     (_)_ __ ___   __| | |__  
    \ \| '_ \ / _ \ \ /\ / / '_ \| |/ _` | '_ \| '_ \ / _ \ '__|____| | '_ ` _ \ / _` | '_ \ 
    _\ \ | | | (_) \ V  V /| |_) | | (_| | | | | | | |  __/ | |_____| | | | | | | (_| | |_) |
    \__/_| |_|\___/ \_/\_/ | .__/|_|\__,_|_| |_|_| |_|\___|_|       |_|_| |_| |_|\__,_|_.__/ 
                           |_|                                                               
    
##Prerequisite
* Install Node.js
* Install MongoDB
* Fork the app
* Install all the depencies from npm (http, path, async, express, socket.io, imdb-api, underscore, querystring, mongodb, monk)

##Installation

1. Do the prerequisite.
2. Run the imdbdb.js file using node (node imdbdb.js) (It will put the information into a mongo database called imdb in the table "series", and it assumes that the the script can be reached from localhost:27015)
3. Once the imdbdb.js file is done (it can take a while) run the server using the command: node server.js
4. Now you can reach the server using localhost:3000