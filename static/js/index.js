let currentlyPlaying = false;
let currentAudio;
var songArray = [];


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
    let artists = {};
    let artist1 = $('#firstGenre').val();
    if (artist1 !== "") artists.artist1 = artist1;
    let artist2 = $('#secondGenre').val();
    if (artist2 !== "") artists.artist2 = artist2;
    let artist3 = $('#thirdGenre').val();
    if (artist3 !== "") artists.artist3 = artist3;
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
            let songArray = [];
            for (let key in path) {
                if (path.hasOwnProperty(key)) {
                    let albumPath = path[key].body.tracks.items;
                    for (let albums in albumPath) {
                        if (albumPath.hasOwnProperty(albums)) {
                            let artistName = albumPath[albums].album.artists[0].name;
                            let songName = albumPath[albums].name;
                            console.log(artistName + " " + songName);
                            songArray.push(artistName + "+" + songName);
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
            }
        },
        error: (err) => {
            console.log(err);
        }
    }).done((songArray)=>{
        spinner.hide();
        makePlaylist(songArray);
    });
}

function init() {
    gapi.client.setApiKey("AIzaSyCnkvNIBIlO1PqPqnoK2eAoejUXt84I40c")
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}

function getSongURL(songArray) {
    init();
    for(var i = 0; i < songArray.length(); i++) {
        let searchURL = "https://www.youtube.com/results?search_query=" + songArray[i];
    }

}

function hello() {

    var x = new XMLHttpRequest()
    var request = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + document.getElementById("query").value + "&key=AIzaSyB6777g3SQvVsgbtOG6iHlL8R2NAl_i1B4"

    x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var string = this.response
            var obj = string.substring(string.indexOf("items") + 7, string.length - 2)
            var results_array = JSON.parse(obj)
            //alert(JSON.stringify(results_array[0]))
            for (i = 0; i < results_array.length; i++) {
                var row = document.createElement("div")
                var title = document.createElement("div")

                var result = JSON.stringify(results_array[i])
                var temp = result
                var asdf = temp.substring(temp.indexOf("title") + 8, temp.indexOf("description") - 3)
                alert(asdf)
                title.innerHTML = result.substring(result.indexOf("title"), result.indexOf("thumbnails") - 7)
                row.appendChild(title)
                divFriendsList.appendChild(row)
            }

        }
        else {
            console.log("didnt go through")
        }
    }

    x.open("GET", request, true)
    x.setRequestHeader("Content-type", "application/json")
    x.send()

}

// function init() {
// gapi.client.setApiKey("AIzaSyB6777g3SQvVsgbtOG6iHlL8R2NAl_i1B4")
// gapi.client.load("youtube", "v3", function() {
// // api is ready
// })
// }

