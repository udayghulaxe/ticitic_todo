/*
This is the global Files for constants andveriables.
Veriables in this file will be available throughout the app.
@author : Uday G.<udaghulaxe@gmail.com >

*/

//Base url for API
// var serviceBase = 'http://staging.pragmasoftwares.com/webappapi/';
//var serviceBase = 'http://localhost/angular/webappapi/';
 var serviceBase = 'http://server/uday/angular/webappapi/';

// Add Global priorities here
var priorities = [{name: 'low', id:0},
                  {name: 'Medium', id:1},
                  {name: 'High', id:2},
                  {name: 'Highest', id:3},
                  {name: 'Critical', id:4}
                  ];

// Add Global AUTH events
app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  serverError: 'server-error'
});

// Add Global User roles
app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  user: 'user',
  participant: 'participant',
  guest: 'guest'
});


function custom_encode(data){
  data = btoa(data);
  return data;
}

function custom_decode(data){
  data = atob(data);
  return data;
}


function handleError(error) {
          return function () {
              return { success: false, message:error };
          };
      }


// Create random id based on date and current time]
function dorand()
{
  var dateObject = new Date();
  var uniqueId =
    dateObject.getMonth() + '' +
    dateObject.getDate() + '' +
    dateObject.getTime();
  var randomnumber = Math.floor(Math.random() * 9001);

  if (uniqueId.length > 10){
    uniqueId = uniqueId.substring(0, 10);
  }
  var uniqueId = parseInt(randomnumber) + parseInt(uniqueId);
  return uniqueId;
}