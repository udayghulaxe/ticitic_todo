app.factory("DataService", ['$http',function ($http) {
    // This service connects to our REST API
        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (response) {
                return response.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function(response) {
                return response.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (response) {
                return response.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (response) {
                return response.data;
            });
        };

        return obj;
}]);

app.factory('AuthInterceptor',['$rootScope', '$q', 'AUTH_EVENTS', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        500: AUTH_EVENTS.serverError
      }[response.status], response);
      return $q.reject(response);
    }
  };
}]);

app.factory('AuthService',['$rootScope','DataService','AUTH_EVENTS', '$http', '$q','USER_ROLES', function ($rootScope, DataService,AUTH_EVENTS,$http,$q,USER_ROLES) {
  var LOCAL_TOKEN_KEY = '';
  var authService = {};
  var userrole = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  /* Login service, pass credentials*/
  authService.Login = function (credentials) {
    var deferred = $q.defer();
    return DataService
      .post('login', credentials)
      .then(function(response)
          {
            if(response.state == 'success'){
                /******* Save auth token below*********/
                var authdata = ({ 'email':response.content.email, 'user_id':response.content.id, 'user_role': response.content.user_role_id,'user_uniqueid':response.content.unique_id,'auth_token':response.content.auth_token });
                authService.storeUserCredentials(authdata);
                deferred.resolve({ success: true,userdata:authdata, massage: response.massage });
            }
            else if(response.state == 'error'){
                deferred.resolve({ success: false, massage: response.massage});
            }
            return deferred.promise;
          },
       handleError('Error Login user'));
  };

  authService.logout = function() {
    //destroyUserCredentials();
  };

  authService.storeUserCredentials = function(serverdata) {
    window.localStorage.setItem('LOCAL_TOKEN_KEY', serverdata.auth_token);
    authService.useCredentials(serverdata.auth_token,serverdata.user_role);
      $rootScope.globals = {
                currentUser: {
                    email: serverdata.email,
                    role: serverdata.user_role,
                    user_id: serverdata.user_id,
                    user_uniqueid: serverdata.user_uniqueid,
                    auth_token: serverdata.auth_token
                }
            };
    window.localStorage.setItem('GLOBALS', custom_encode(JSON.stringify($rootScope.globals)));
        }

  authService.loadUserCredentials = function() {
    var token = window.localStorage.getItem('LOCAL_TOKEN_KEY');
    if (token) {
       isAuthenticated = true;
      authService.useCredentials(token,"user");
    }
  }


  authService.ClearCredentials = function() {
      $rootScope.GlobalVars = '';
      $rootScope.globals = '';
      isAuthenticated = false;
      window.localStorage.removeItem('GLOBALS');
      window.localStorage.removeItem('LOCAL_TOKEN_KEY');
      $http.defaults.headers.common.Authorization = 'Basic';
  }


  authService.useCredentials = function (token,userrole) {
    var userrole = 'user';
    console.log(userrole);
    role = userrole;
    isAuthenticated = true;
    authToken = token;

    if (userrole == 'admin') {
      role = USER_ROLES.admin
    }
    if (userrole == 'user') {
      role = USER_ROLES.user
    }
    // Set the token as header for your requests!
   // $http.defaults.headers.common['X-Auth-Token'] = token;
   console.log('token =' + token);
   $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
  }

  authService.isAuthenticated =function(){
    return isAuthenticated;
  }

  authService.role = function()
  {
    return role;
  }

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(role) !== -1);
  };

  authService.loadUserCredentials();
  return authService;
}]);


app.factory('UserService',['$rootScope','DataService','AUTH_EVENTS','AuthService', '$q', function ($rootScope,DataService,AUTH_EVENTS,AuthService, $q) {

  var userService = {};
  userService.CreatUser = function (register_info) {
    var deferred = $q.defer();
      return DataService
      .post('register', register_info)
      .then(function(response)
          {
            if(response.state == 'success'){
                deferred.resolve({ success: true,massage: response.massage });
            }
            else if(response.state == 'error'){
                deferred.resolve({ success: false, massage: response.massage});
            }
            return deferred.promise;
          },
       handleError('Error creating user'));
  };


  userService.LoadListsByUserid = function (user_id) {
    var deferred = $q.defer();
      return DataService
      .post('loadlistsbyuserid', user_id)
      .then(function(response)
          {
            if(response.state == 'success'){
                deferred.resolve({ success: true, lists: response.lists });
            }
            else if(response.state == 'error'){
                deferred.resolve({ success: false, massage: response.massage});
            }
            return deferred.promise;
          },
       handleError('Error Fetching data'));
  };


    userService.GetTodoBylistid = function (lists,list_id) {
      return lists[list_id];
    };

   userService.loadLocalData = function() {
      var temp_local = window.localStorage.getItem('GLOBALS');
      if (temp_local != null){
        var user_local_data = custom_decode(temp_local.toString());
        return user_local_data;
      }else{
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
   };


    userService.loadTodoData = function(todo_id) {
      var deferred = $q.defer();
      return DataService
      .post('load_data_by_todo_id', user_id)
      .then(function(response)
          {
            if(response.state == 'success'){
                deferred.resolve({ success: true });
            }
            else if(response.state == 'error'){
                deferred.resolve({ success: false, massage: response.massage});
            }
            return deferred.promise;
          },
       handleError('Error Fetching data'));
   };


  return userService;
}]);


app.factory('AuthResolver',['$q','$rootScope', '$state',  function ($q, $rootScope, $state) {
  return {
    resolve: function () {
      var deferred = $q.defer();
      var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
        if (angular.isDefined(currentUser)) {
          if (currentUser) {
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
            $state.go('login');
          }
          unwatch();
        }
      });
      return deferred.promise;
    }
  };
}]);