var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '9e91dbd172c24b608a18276182a66308'; // my client id
var client_secret = '150e886419e04d43ad8fd06225d0a56d'; // my secret key
var redirect_uri = 'http://localhost:8888/callback'; // my redirect uri

function login() {
    var userName = document.getElementById("inputUsername").value;
    var userName = document.getElementById("inputPassword").value;

}
