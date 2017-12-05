let express = require('express')
let bodyParser = require('body-parser');
let cors = require('cors');
let request = require('request');
let SpotifyWebApi = require('spotify-web-api-node');
let client_id = '9e91dbd172c24b608a18276182a66308';
let client_secret = '150e886419e04d43ad8fd06225d0a56d';

let spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: 'http://localhost:8000/'
});

let app = express();

app.use("/css", express.static(__dirname + '/static/css'));
app.use("/js", express.static(__dirname + '/static/js'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    let payload = client_id + ":" + client_secret;
    let encodedPayload = new Buffer(payload).toString("base64");
    let opts = {
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + encodedPayload
        },
        body: "grant_type=client_credentials&scope=playlist-modify-public playlist-modify-private"
    };
    request(opts, (err, res, body) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(JSON.parse(body).access_token);
            spotifyApi.setAccessToken(JSON.parse(body).access_token);
        }
    });
    res.sendfile(__dirname + "/static/sign_in.html");
});
app.get('/index', (request, response) => {
    return response.sendfile(__dirname + "/static/index.html");
});
app.post('/searchArtist', (request, response) => {
    let errorFlag = false;
    let dataArray = [];
    let artistsObject = request.body;
    let count = Object.keys(artistsObject).length;
    for (let key in artistsObject) {
        if (artistsObject.hasOwnProperty(key))
            spotifyApi.searchTracks('artist:' + artistsObject[key],{limit: 50})
                .then((data) => {
                    dataArray.push(data);
                    count--;
                    if (count <= 0 && !errorFlag) {
                        return response.status(200).json({
                            dataArray
                        });
                    }
                },(err) => {
                    errorFlag = true;
                    return response.status(400).json({
                        message: err
                    });
                });
    }
});

// (function() {
//     $("form").on("submit", function(e) {
//         e.preventDefault();
//         // prepare the request
//         var request = gapi.client.youtube.search.list({
//             part: "snippet",
//             type: "video",
//             q: encodeURIComponent$("#search").val().replace(/%20/g, "+"),
//             maxResults: 3,
//             order: "viewCount",
//             publishedAfter: "2015-01-01T00:00:00Z"
//         });
//         request.execute(function(response) {
//             var results = response.result;
//             $.each(results.items, function(index, item) {
//                 // $("#results").append(item.id.videoId + "." + item.snippet.title+"<br>")
//             });
//         });
//     });
// });

function init() {
    gapi.client.setApiKey("AIzaSyCnkvNIBIlO1PqPqnoK2eAoejUXt84I40c")
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}

app.set('port', (process.env.PORT || 8100));
app.listen(app.get('port'));