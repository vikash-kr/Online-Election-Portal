var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var request = require("request");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
// connection to database;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vikash123",
    database: "project_v2"
});

// setting up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

con.connect(function (err) {
    if (err) {
        console.log("Error connecting to database"+ err);
    } else {
        console.log("Connected to database!");
    }
});

// ROUTES

// landing page
app.get("/", function (req, res) {
    res.render('landing');
});

// sign up / login -> user page 
app.get("/admin", function (req, res) {
    res.render("admin");
});


// sign up / login -> user page 
app.get("/signuploginuser", function (req, res) {
    res.render("signuploginuser");
});

// sign up / login -> guide page 
app.get("/signuploginPolingAgent", function (req, res) {
    res.render("signuploginPolingAgent");
});


// profile page -> user
app.get("/profileUser", function (req, res) {
    res.send("redricting")
});

// profile page -> guide
app.get("/profilePolingAgent", function (req, res) {
    res.render("profilePolingAgent");
});
app.get("/voter",function(req, res){
    //var name = req.
    console.log(req + "is req");
    res.render("voter");
})

// POST REQUESTS
app.get("/admin_results",function(req, res){
    var query = req.query.search;
    var sqlStatement = "select * from aadhar where constituency = " +" '" +query +" '" ;
    con.query(sqlStatement,function (err, result) {
        if (err) 
            console.log(err);
        console.log("Searching in constituenty "+ query);
        console.log(result+ "will be passed");
        res.render('adminresult' ,{result : result});   
    });
});

// post request for sign up -> user
app.post("/signuploginuser", function (req, res) {
    var aadhar_no = req.body.aadhar_no ;
    var fullname = "'" + req.body.fullname + "'";
    var f_h_name = "'" + req.body.f_h_name + "'";
    var gender = "'" + req.body.gender + "'";
    var dob = "'" + req.body.dob + "'";
    var email = "'" + req.body.email + "'";
    var address = "'" + req.body.city  +" , "+ req.body.state +" , " +req.body.country + "'";
    var constituenty = "'" + req.body.ct + "'";
    var sqlStatement = "insert into aadhar values (" + aadhar_no + ", " + fullname + ", " + gender + ", " + dob + " ," + f_h_name + ", " + address + ", " + email + " ," + constituenty + ");";
    console.log("Raw string is " +sqlStatement);
    con.query(sqlStatement, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Entry successfully inserted into member");
    }
    res.redirect("/signuploginuser");
    });
});

app.post("/admin_results", function (req, res) {
    var voter_id ="'" + req.body.v_id  + "'";
    var aadhar_no = req.body.aadhar_no ;
    var password = "'" + req.body.ps + "'";
    var label = "'" + req.body.label + "'";
    var sqlStatement = "insert into voter values (" + voter_id +", " +aadhar_no + ", "+password + "," +label + ");";
    console.log("Raw string is " +sqlStatement);
    con.query(sqlStatement, function (err, result) {
        if (err) {
            console.log(err);

        } else {
            console.log("Entry successfully inserted into voter");
    }
    res.redirect("/admin_results");
    });
});

// post request for login -> user;
// post request for login -> user;
app.post("/profileUser", function (req, res) {
    // parsing body parameters
    var username = "'" +req.body.username+"'";
    var password = "" + req.body.password+"";

    var temp = username[1];
    console.log("value in temp " +temp);
    var table;
    var id;
    if(temp == "A"){
        table = 'admin';
        id = 'Admin_id';
    } else if(temp == "V"){
        table = 'voter';
        id = 'voter_id';
    } else if(temp == "P"){
        table = 'pollingAgent';
        id = 'pollingAgent.id';
    } else if(temp == "C"){
        table = 'Candidate';
        id = 'candidate_id';
    }
    
    var sqlStatement = "select "+id+", password from "+table+" where "+id+" = "+username+";";
   // var sqlStatement = "select ?, password from ? where ? = ?";
    con.query(sqlStatement, [id,table,id,username],function (err, result) {
        if (err) {
            console.log("result---------------")
            console.log(result);
            console.log("--------------Error in log in.");
            console.log(err);
        } else {
            console.log("result---------------" + result)
            if (result.length == 0) {
                console.log("No such username exists");
                res.redirect("/signuploginuser");
            } else {
                if (result[0].password == password) {
                    console.log("Correct login to" +table);
                   //    res.redirect("/admin");

                    if(table == 'admin'){
                        console.log("redricting to admin");
                        res.redirect("/admin");
                    } else if(table == 'voter'){
                        res.redirect("/voter");
                    } else if(table == 'pollingAgent'){
                        res.redirect("/pollingAgent");
                    } else if(table == 'candidate'){
                        res.redirect("/candidate");
                    }
                } else {
                    console.log(result[0].password + " " + password);
                    console.log("Wrong password");
                    res.redirect("/signuploginuser");
                }
            }
        }
    });
});

// post request for sign up -> guide
app.post("/signuploginPolingAgent", function (req, res) {
    // parsing body parameters
    var username = "'" + req.body.username + "'";
    var password = "'" + req.body.password + "'";
    var full_name = "'" + req.body.fullname + "'";
    var email = "'" + req.body.email + "'";
    var mobile_no = "'" + req.body.mobile_no + "'";
    var bhamasha_no = "'" + req.body.bhamasha_no + "'";
    var city = "'" + req.body.city + "'";
    var state = "'" + req.body.state + "'";
    var zip = "'" + req.body.zip + "'";

    var sqlStatement = "insert into member values (" + username + ", " + password + ");";

    con.query(sqlStatement, function (err, result) {
        if (err) {
            console.log("Duplicate Entry");
        } else {
            console.log("Successfull insertion into member from guide");
            var sqlStatement = "insert into guide values (" + username + ", " + password + ", " + full_name + ", " + email + ", " + mobile_no + ", " + bhamasha_no + ", " + city + ", " + state + ", " + zip + ");";
            con.query(sqlStatement, function (err, result) {
                if (err) {
                    console.log("Error inserting into guide");
                } else {
                    console.log("Successful insertion into guide");
                }
            });
        }
        res.redirect("/signuploginPolingAgent");
    });
});

// post request for guide
app.post("/profilePolingAgent", function (req, res) {
    // parsing body parameters;
    var username = req.body.username;
    var password = req.body.password;

    var sqlStatement = "select username, password from guide where username = ?";
    con.query(sqlStatement, [username], function (err, result, values) {
        if (err) {
            console.log("Error querying");
        } else {
            if (result.length == 0) {
                console.log("no such result exists");
                res.redirect("/signuploginPolingAgent");
            } else {
                if (result[0].password == password) {
                    console.log("Successful login!");
                    res.redirect("/profilePolingAgent");
                } else {
                    console.log("Wrong password");
                    res.redirect("/profilePolingAgent");
                }
            }
        }
    })
});

app.listen(3000, function () {
    console.log("Server initiated!");
});