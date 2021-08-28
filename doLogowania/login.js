var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'id17156034_domojejstrony',
	password : 'Kotypsykoty+12',
	database : 'id17156034_bazadanych'
});



var app = express();
app.use(session({
secret: 'secret',
resave: true,
saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
var nick = request.body.nick;
var haslo = request.body.haslo;
if (nick && haslo) {
    connection.query('SELECT * FROM konta WHERE nick = ? AND haslo = ?', [nick, haslo], function(error, results, fields) {
        if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = nick;
            response.redirect('/home');
        } else {
            response.send('Incorrect Username and/or Password!');
        }			
        response.end();
    });
} else {
    response.send('Please enter Username and Password!');
    response.end();
}
});

app.get('/home', function(request, response) {
if (request.session.loggedin) {
    response.send('Welcome back, ' + request.session.username + '!');
} else {
    response.send('Please login to view this page!');
}
response.end();
});

app.listen(430);