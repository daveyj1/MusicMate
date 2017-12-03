let currentlyPlaying = false;
let currentAudio;

(function() {
    //initializes firebase
    var config = {
        apiKey: "AIzaSyCnkvNIBIlO1PqPqnoK2eAoejUXt84I40c",
        authDomain: "musicmatch-fda17.firebaseapp.com",
        databaseURL: "https://musicmatch-fda17.firebaseio.com",
        projectId: "musicmatch-fda17",
        storageBucket: "musicmatch-fda17.appspot.com",
        messagingSenderId: "840617963782"
    };

    firebase.initializeApp(config);

    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');

    btnLogin.addEventListener('click', e => {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        const promise = auth.singInWithEmailAndPassword(email, pass);
        promise.catch(e => console.log(e.message));
        if (promise) {
            window.location.href = "index.html";
        }
        else {
            alert("incorrect username or password");
        }
    });

    btnSignUp.addEventListener('click', e => {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        const promise = auth.createWithEmailAndPassword(email, pass);
        promise.catch(e => console.log(e.message));
        if (promise) {
            window.location.href = "index.html";
        }
        else {
            alert("incorrect username or password");
        }

    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
       if(firebaseUser) {
           console.log(firebaseUser);
           btnLogOut.classList.remove('hide');
       } else {
           console.log('not logged in');
           btnLogOut.classList.add('hide');
       }
    });

}());

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
                            console.log(albumPath[albums]);
                            if (albumPath[albums].preview_url !== null) {
                                let button = document.createElement("BUTTON");
                                let text = document.createTextNode(albumPath[albums].name);
                                songArray.push(albumPath[albums].name);
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

function makePlaylist(array) {
    $.ajax({
        url: '',
        dataType: 'json',
        type: 'POST',
        contentType: "application/json",

    })
}
