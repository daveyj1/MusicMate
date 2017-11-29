// var client_id = '9e91dbd172c24b608a18276182a66308'; // my client id
// var client_secret = '150e886419e04d43ad8fd06225d0a56d'; // my secret key
// var redirect_uri = 'http://localhost:8888/callback'; // my redirect uri

// const app = {};
//
// app.apiUrl = 'https://api.spotify.com/v1';
//
// app.events = function() {
//     $('form').on('submit', function(e) {
//         e.preventDefault();
//         var genreOne = document.getElementById("firstGenre").value;
//         var genreTwo = document.getElementById("secondGenre").value;
//         var genreThree = document.getElementById("thirdGenre").value;
//         console.log(genreOne);
//         console.log(genreTwo);
//         console.log(genreThree);
//         var genreArray = [genreOne, genreTwo, genreThree];
//         let search = genreArray.map(genreName => app.searchGenres(genreName));
//         console.log(search);
//         $.when(...search)
//             .then((...results) => {
//                 console.log(results);
//             });
//
//     });
// };
//
// app.searchGenres = (genreName) => $.ajax({
//     url: `${app.apiUrl}/artists`,
//     method: 'GET',
//     dataType: 'json',
//     data: {
//         q: genreName,
//         type: 'artist'
//     }
// });
//
//
// app.init = function() {
//     app.events();
// };
//
// $(app.init);
function getArtists() {
    let artists = {};
    let artist1 = $('#firstGenre').val();
    if(artist1 !== "") artists.artist1 = artist1;
    let artist2 = $('#secondGenre').val();
    if(artist2 !== "") artists.artist2 = artist2;
    let artist3 = $('#thirdGenre').val();
    if(artist3 !== "") artists.artist3 = artist3;
    if(jQuery.isEmptyObject(artists)){
        alert("Please enter at least 1 artist.");
        return;
    }
    alert(JSON.stringify(artists));
    $.ajax({
        url: '/searchArtist',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(artists),
        contentType: "application/json",
        success: function (data) {
            console.log(JSON.stringify(data));
        },
        error: function (err) {
            console.log(err);
        }
    });
}