var client_id = '9e91dbd172c24b608a18276182a66308'; // my client id
var client_secret = '150e886419e04d43ad8fd06225d0a56d'; // my secret key
var redirect_uri = 'http://localhost:8888/callback'; // my redirect uri

const app = {};

app.events = function() {
    $('form').on('submit', function(e) {
        e.preventDefault();
        var genreOne = document.getElementById("firstGenre").value;
        var genreTwo = document.getElementById("secondGenre").value;
        var genreThree = document.getElementById("thirdGenre").value;
        console.log(genreOne);
        console.log(genreTwo);
        console.log(genreThree);
        var genreArray = [genreOne, genreTwo, genreThree];
        let search = genreArray.map(genreName => app.searchGenres(genreType));
        console.log(search);
    });
}

app.searchGenres = (genreName) => $.ajax({
    url: '${app.apiUrl}/search',
    method: 'GET',
    dataType: 'json',
    data: {
        q: genreName,
        type: 'artist'
    }
});

app.init = function() {
    app.events();
};

$(app.init);

