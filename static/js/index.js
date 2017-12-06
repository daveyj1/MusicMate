let currentlyPlaying = false;
let currentAudio;
var songArray = [];
var randoSongs = [];
var finalArray = [];

function logIn() {
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const email = txtEmail.value;
    const pass = txtPassword.value;
    firebase.auth().signInWithEmailAndPassword(email, pass).then(function (user) {
        window.location.href = "index";
        document.getElementById('profile').innerHTML = "Hi, " + txtEmail.substring(0, txtEmail.indexOf('@'));
    }).catch(function(error) {
        alert(error.message);
    });
}
function signUp() {
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const email = txtEmail.value;
    const pass = txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {
        window.location.href = "index";
        document.getElementById('profile').innerHTML = "Hi, " + txtEmail.substring(0, txtEmail.indexOf('@'));
    }).catch(function(error) {
        alert(error.message);
    });
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function getArtists() {
    let arrayLength = "";
    let flag = 0;
    let artists = {};
    let artist1 = $('#firstGenre').val();
    if (artist1 !== "") {
        artists.artist1 = artist1;
    }
    else {
        flag++;
    }
    let artist2 = $('#secondGenre').val();
    if (artist2 !== "") {
        artists.artist2 = artist2;
    }
    else {
        flag++;
    }
    let artist3 = $('#thirdGenre').val();
    if (artist3 !== "") {
        artists.artist3 = artist3;
    }
    else {
        flag++;
    }
    if (jQuery.isEmptyObject(artists)) {
        alert("Please enter at least 1 artist.");
        return;
    }
    let spinner = $("#spinner");
    spinner.show();
    $.ajax({
        url: '/searchArtist',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(artists),
        contentType: "application/json",
        success: (data) => {
            let path = data.dataArray;
            let myContainer = document.getElementById('myContainer');
            myContainer.innerHTML = '';
            for (let key in path) {
                if (path.hasOwnProperty(key)) {
                    let albumPath = path[key].body.tracks.items;
                    for (let albums in albumPath) {
                        if (albumPath.hasOwnProperty(albums)) {
                            let artistName = albumPath[albums].album.artists[0].name;
                            let songName = albumPath[albums].name;
                            songArray.push(artistName + "+" + songName);
                            // if (albumPath[albums].preview_url !== null) {
                            //     let button = document.createElement("BUTTON");
                            //     let text = document.createTextNode(albumPath[albums].name);
                            //     button.appendChild(text);
                            //     button.onclick = () => {
                            //         if(currentlyPlaying){
                            //             currentAudio.pause();
                            //         }
                            //         let audio = new Audio(albumPath[albums].preview_url);
                            //         currentAudio = audio;
                            //         audio.play();
                            //         currentlyPlaying = true;
                            //     };
                            //     myContainer.appendChild(button);
                            // }

                        }
                    }
                }
            }
            shuffleArray(songArray);
            arrayLength = songArray.length;
            console.log(arrayLength);
            for (let i = 0; i < 15; i++) {
                var x = Math.floor(Math.random() * arrayLength);
                if ($.inArray(songArray[x], randoSongs) != -1) {
                    i--;
                    continue;
                }
                randoSongs.push(songArray[x]);
            }
            console.log(randoSongs);
            createPlaylist(randoSongs);
        },
        error: (err) => {
            console.log(err);
        }
    }).done(()=>{
        spinner.hide();
    });
}

function createPlaylist(randoSongs) {
    var vidIDArray = [];
    let p = $('#playlistName').val();
    playlist["playlistName"] = p;
    document.getElementById('pName').innerHTML = "Playlist: " + p;
    for (var i = 0; i < randoSongs.length; i++) {
        var x = new XMLHttpRequest();
        var request = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + randoSongs[i] + "&key=AIzaSyB6777g3SQvVsgbtOG6iHlL8R2NAl_i1B4";
        let vidID = "";
        let first = randoSongs[i];
        let count = i;
        x.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let thing = this.response.indexOf("videoId") + 11;
                let thing2 = this.response.indexOf("snippet") - 14;
                vidID = this.response.substring(thing, thing2);
                vidIDArray.push(vidID);
                finalArray.push(first + "*" + vidID);
            }
        };

        x.open("GET", request, true);
        x.setRequestHeader("Content-type", "application/json");
        x.send()
    }
    console.log(finalArray);
    showDiv(randoSongs, finalArray);
}

function showDiv(randoSongs, finalArray) {
    console.log(finalArray);
    console.log(finalArray[0]);
    console.log(randoSongs[0]);
    document.getElementById('playlist').style.display = "block";
    document.getElementById('playlistNames').innerHTML = "";
    for (var i = 0; i < 15; i++) {
        let artist = randoSongs[i].substring(0, randoSongs[i].indexOf("+"));
        let song = randoSongs[i].substring(randoSongs[i].indexOf("+") + 1, randoSongs[i].length);
        //let vid = finalArray[i].substring(finalArray[i].indexOf("*") + 1, finalArray[i].length);
        document.getElementById('playlistNames').innerHTML += '<i class="fa fa-play-circle" style="font-size:24px;" onclick="playSong(vid)"></i>  ' + song + ' (' + artist + ')' + "<br />";
    }
    //firebase.
}

function playSong(vidID) {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '480',
            width: '720',
            videoId: vidID,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING && !done) {
            done = true;
        }
    }
    function stopVideo() {
        player.stopVideo();
    }
}

function shuffleArray(songArray) {
    for (var i = songArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = songArray[i];
        songArray[i] = songArray[j];
        songArray[j] = temp;
    }
}


