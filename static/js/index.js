var config = {
    apiKey: "AIzaSyCnkvNIBIlO1PqPqnoK2eAoejUXt84I40c",
    authDomain: "musicmatch-fda17.firebaseapp.com",
    databaseURL: "https://musicmatch-fda17.firebaseio.com",
    projectId: "musicmatch-fda17",
    storageBucket: "musicmatch-fda17.appspot.com",
    messagingSenderId: "840617963782"
};
firebase.initializeApp(config);

var songArray = [];
var randoSongs = [];
var finalArray = [];
var playlistEntry = [];
let firebaseRef = firebase.database().ref('users');
let user;

function loadData() {
    user = firebase.auth().currentUser;
    let counter = 1;
    firebaseRef.child(user.uid).once("value").then(function (snapshot) {
       for(let key in snapshot.val()){
            if(counter <= 5){
                let link = $("#link" + counter);
                let button = $("<button>");
                button.attr({id : key});
                button.html("Delete");
                button.click(function (event) {
                    event.stopPropagation();
                    deletePlaylist(this.id);
                });
                link.html(key);
                link.append(button);
                link.attr({id : key});
            }
            counter++;
       }
    });
}
function deletePlaylist(playlistName) {
    firebaseRef.child(user.uid).child(playlistName).remove().then(()=>{
        loadData();
    });
}


function logIn() {
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const email = txtEmail.value;
    const pass = txtPassword.value;
    firebase.auth().signInWithEmailAndPassword(email, pass).then(function (user) {
        window.location.href = "index";
        document.getElementById('profile').innerHTML = "Hi, " + email.substring(0, email.indexOf('@'));
    }).catch(function(error) {
        alert(error.message);
    });
    console.log('100');
    if (firebase.auth().currentUser) {
        console.log('Logged In');
    } else {
        console.log('error not logged in');
    }
}
function signUp() {
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const email = txtEmail.value;
    const pass = txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {
        setTimeout(function() {}, 3000);
        window.location.href = "index";
        document.getElementById('profile').innerHTML = "Hi, " + email.substring(0, email.indexOf('@'));
    }).catch(function(error) {
        alert(error.message);
    });
}

function signOut() {
    window.location.href = "/";
    firebase.auth().signOut.then(function() {
        window.location.href = "sign_in";
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
    if (firebase.auth().currentUser) {
        console.log('Logged In');
    } else {
        console.log('error not logged in');
    }
    songArray = [];
    randoSongs = [];
    finalArray = [];
    let arrayLength = "";
    let artists = {};
    let artist1 = $('#firstGenre').val();
    if (artist1 !== "") {
        artists.artist1 = artist1;
    }
    let artist2 = $('#secondGenre').val();
    if (artist2 !== "") {
        artists.artist2 = artist2;
    }
    let artist3 = $('#thirdGenre').val();
    if (artist3 !== "") {
        artists.artist3 = artist3;
    }
    if (jQuery.isEmptyObject(artists)) {
        alert("Please enter at least 1 artist.");
        return;
    }
    let spinner = $("#spinner");
    spinner.show();
    $.ajax({
        url: '/searchArtist',
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
                        }
                    }
                }
            }
            if(songArray.length > 0) {
                shuffleArray(songArray);
                arrayLength = songArray.length;
                console.log(arrayLength);
                for (let i = 0; i < 15; i++) {
                    let x = Math.floor(Math.random() * arrayLength);
                    if ($.inArray(songArray[x], randoSongs) !== -1) {
                        i--;
                        continue;
                    }
                    randoSongs.push(songArray[x]);
                }
                console.log(randoSongs);
                createPlaylist(randoSongs);
            } else {
                alert('No matches. Please check that everyhing is typed correctly.')
            }
        },
        error: (err) => {
            alert("ERROR");
            console.log(err);
        }
    }).done(()=>{
        spinner.hide();
    }).always(()=>{
        spinner.hide();
    });
}

function createPlaylist(randoSongs) {
    stopMusic();
    playlistEntry = [];
    let counter = 0;
    let p = $('#playlistName').val();
    playlist["playlistName"] = p;
    document.getElementById('pName').innerHTML = "Playlist: " + p;
    for (let i = 0; i < randoSongs.length; i++) {
        let x = new XMLHttpRequest();
        let request = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + randoSongs[i] + "&key=AIzaSyB6777g3SQvVsgbtOG6iHlL8R2NAl_i1B4";
        let vidID = "";
        let entry = {
            artist: randoSongs[i].split("+")[0],
            songName: randoSongs[i].split("+")[1]
        };
        x.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let thing = this.response.indexOf("videoId") + 11;
                let thing2 = this.response.indexOf("snippet") - 12;
                vidID = this.response.substring(thing, thing2);
                entry.vid = vidID;
                playlistEntry.push(entry);
                if(counter >= randoSongs.length - 1){
                    showDiv(playlistEntry);
                }
                counter++;
            }
        };
        x.open("GET", request, true);
        x.setRequestHeader("Content-type", "application/json");
        x.send()
    }
}
function saveToFirebase() {
    firebaseRef.child(user.uid).child($("#playlistName").val()).set(playlistEntry);
}
function stopMusic() {
    $("iframe").each(function() {
        var src= $(this).attr('src');
        $(this).attr('src',src);
    });
    let iframes = document.querySelectorAll('iframe');
    for (let i = 0; i < iframes.length; i++) {
        iframes[i].parentNode.removeChild(iframes[i]);
    }
}
function getPlaylistFirebase(playlistName) {
    let array = [];
    firebaseRef.child(user.uid).child(playlistName).once("value").then(function (snapshot) {
        for(let key in snapshot.val()){
            let entry = snapshot.val()[key];
            array.push(entry);
        }
    }).then(function () {
        showDiv(array);
    });
}
function showDiv(playlistEntry) {
    document.getElementById('playlist').style.display = "block";
    document.getElementById('playlistNames').innerHTML = "";
    for (let i = 0; i < 15; i++) {
        let entry = playlistEntry[i];
        let vid = entry.vid;
        let icon = document.createElement("I");
        icon.classList.add("fa");
        icon.classList.add("fa-play-circle");
        icon.style.fontSize = "20px";
        icon.style.margin = "0";
        icon.innerHTML = " " + entry.songName + " (" + entry.artist + ")" + "<br />" ;
        icon.className += ' artist_title';
        icon.addEventListener('click', ()=>{
            if(icon.className.indexOf('fa-pause-circle') !== -1){
                stopMusic();
                icon.className = "fa fa-play-circle artist_title";
            }
            else {
                let children = icon.parentNode.childNodes;
                for (let i = 0; i < children.length; i++) {
                    children[i].className = "fa fa-play-circle artist_title";
                }
                icon.classList.add("fa-pause-circle");
                playSong(vid);
            }
        });
        document.getElementById('playlistNames').appendChild(icon);
    }
}

function playSong(vidID) {
    stopMusic();
    let body = document.getElementById('bodyTag');
    let iframe = document.createElement('iframe');
    iframe.width = "420";
    iframe.height = "315";
    iframe.src = "//www.youtube.com/embed/" + vidID + "?rel=0&autoplay=1";
    body.appendChild(iframe);
}

function shuffleArray(songArray) {
    for (var i = songArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = songArray[i];
        songArray[i] = songArray[j];
        songArray[j] = temp;
    }
}


