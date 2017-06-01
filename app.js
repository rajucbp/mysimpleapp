var http=require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var log = require('./routes/log/log');
var jwt = require('jwt-simple');
var server = require('http').Server(app);
//Connect to Mongoose
app.use(bodyParser.json());
mongoose.connect('mongodb://rajesh:rajesh@ds149481.mlab.com:49481/eaalzayeed_stagingdb');

var db = mongoose.connection;



var secret = 'this is the secret secret secret 12356';
app.use('/api', expressJwt({secret: secret}));
function parallel(middlewares) {
  return function (req, res, next) {
    async.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));	
app.use(function(err, req, res, next){
 if (err.constructor.name === 'UnauthorizedError') {
  res.status(401).send('Unauthorized');
 }
});

//----------------------------------------route modules---------------------------------------------
var User = require('./routes/login/login');
var Register = require('./routes/register/register');
var School = require('./routes/school/school');
//----------------------------------------HTML pages------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', function(req,res){
res.sendFile( __dirname + '/views/index.html' );
});

app.get('/login', function(req,res){
res.sendFile( __dirname + '/views/login.html' );
});

//--------------------------Super admin HTML pages-------------------------------------------------------
app.get('/superAdminDashboard', function(req,res){
res.sendFile( __dirname + '/views/S_A_dashboard.html' );
});
app.get('/addSchool', function(req,res){
res.sendFile( __dirname + '/views/SA/add_school.html' );
});
app.get('/assignAdmin', function(req,res){
res.sendFile( __dirname + '/views/SA/assign_admin.html' );
});
//--------------------------Admin HTML pages-------------------------------------------------------------
app.get('/adminDashboard', function(req,res){
res.sendFile( __dirname + '/views/A_dashboard.html' );
});

//--------------------------Teacher HTML pages-----------------------------------------------------------
app.get('/teacherDashboard', function(req,res){
res.sendFile( __dirname + '/views/T_dashboard.html' );
});
//--------------------------API'S-------------------------------------------------------------------
//USER REGISTER ENDPOINT
app.post("/register", Register.register );

//USER LOGIN ENDPOINT
app.post("/login", User.login);

app.post('/api/AddSchool', School.schoolRegister);

app.get('/api/GetSchoolsList', School.schools_list);
//app.put('/api/ModifySchool/:schoolId', classes.edit_class);
//app.delete('/api/DeleteSchool/:schoolId', classes.delete_class);

//USER UPDATE ENDPOINT
//app.post("/update", User.userUpdate);

const PORT = 8080;
app.listen(PORT);
log.info("Server connected to port" + " " + PORT);
