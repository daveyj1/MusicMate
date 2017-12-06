let currentlyPlaying = false;
let currentAudio;
var songArray = [];
var randoSongs = [];

function logIn() {
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const email = txtEmail.value;
    const pass = txtPassword.value;
    firebase.auth().signInWithEmailAndPassword(email, pass).then(function (user) {
        window.location.href = "index";
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
    let count = 0;
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
                            //console.log(artistName + " " + songName);
                            songArray.push(artistName + "+" + songName);
                            count++;
                            if (albumPath[albums].preview_url !== null) {
                                let button = document.createElement("BUTTON");
                                let text = document.createTextNode(albumPath[albums].name);
                                button.appendChild(text);
                                button.onclick = () => {
                                    if(currentlyPlaying){
                                        currentAudio.pause();
                                    }
                                    let audio = new Audio(albumPath[albums].preview_url);
                                    currentAudio = audio;
                                    audio.play();
                                    currentlyPlaying = true;
                                };
                                myContainer.appendChild(button);
                            }

                        }
                    }
                }
                // let i = 0;
                // if (flag == 2) {
                //    i = 18;
                // }
                // else if (flag == 1) {
                //     i = 9;
                // }
                // else {
                //     i = 6;
                // }
                // for (let i = 0; i < 5; i++) {
                //     var x = Math.floor(Math.random() * songArray.length);
                //     randoSongs.push(songArray[x])
                // }
                // console.log(randoSongs);
            }
            createPlaylist(songArray)
        },
        error: (err) => {
            console.log(err);
        }
    }).done(()=>{
        spinner.hide();
    });
    console.log(count);
    for (let i = 0; i < 10; i++) {
        var x = Math.floor(Math.random() * count);
        console.log(x);
        randoSongs.push(songArray[x]);
        console.log(songArray[x])
    }
    //console.log(randoSongs);
    showDiv();
}

function createPlaylist(songArray) {
    var playlist = {};
    let p = $('#playlistName').val();
    playlist["playlistName"] = p;
    document.getElementById('pName').innerHTML = "Playlist: " + p;
    for (var i = 0; i < songArray.length; i++) {
        let song = songArray[i].substring(songArray[i].indexOf("+") + 1, songArray[i].length);
        let artist = songArray[i].substring(0, songArray[i].indexOf("+"));
        //p["songName"][i] = song;
        //p["artistName"][i] = artist;
        console.log();
        var x = new XMLHttpRequest();
        var request = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + songArray[i] + "&key=AIzaSyB6777g3SQvVsgbtOG6iHlL8R2NAl_i1B4";
        let vidID = "";
        x.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let thing = this.response.indexOf("videoId") + 11;
                let thing2 = this.response.indexOf("snippet") - 7;
                vidID = this.response.substring(thing, thing2);
            }
        };
        //p["vidID"][i] = vidID;
        x.open("GET", request, true);
        x.setRequestHeader("Content-type", "application/json");
        x.send()
    }
    console.log(playlist);
}

function showDiv() {
    document.getElementById('playlist').style.display = "block";
}


