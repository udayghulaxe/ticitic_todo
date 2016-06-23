var app = angular.module('app', ['ui.router', 'ng-sortable','ngMaterial']);

app.run(['$rootScope','$injector', '$http', '$state','AuthService', 'AUTH_EVENTS', 'UserService', function ($rootScope,$injector, $http, $state, AuthService, AUTH_EVENTS,UserService) {

  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

      }
    }
    if(AuthService.isAuthenticated() && (next.name == 'login' || next.name == 'register' || next.name == 'intro')){
      event.preventDefault();
       $state.go('dashboard.listdetail',{list_id:'inbox'}, {reload: true});
    }

    if (!AuthService.isAuthenticated() && next.name !== 'register') {
      if (next.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });

  /***********************************************/
  var temp_local_data = UserService.loadLocalData();
  if((temp_local_data != null ) || (typeof temp_local_data != 'undefined')){
    $rootScope.GlobalVars = temp_local_data;
    var local_data_globals = angular.fromJson(temp_local_data);
    $rootScope.current_user_id = local_data_globals.currentUser.user_id;
    $rootScope.auth_token = local_data_globals.currentUser.auth_token;
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.auth_token;
  }

  console.log($state.current);

  UserService.LoadListsByUserid($rootScope.current_user_id)
   .then(function(response) {
        if (response.success) {
            $rootScope.lists = response.lists;
        } else {
          // Don't have any todo added
         // $scope.serverError = response.massage;
        }
  });


  $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
        if((temp_local_data != null ) || (typeof temp_local_data != 'undefined')){
        //  local_data_globals = angular.fromJson($rootScope.GlobalVars);
        if (local_data_globals.currentUser.auth_token)
        headersGetter()['Authorization'] = "Basic "+local_data_globals.currentUser.auth_token;
        }
        if (data) {
        return angular.toJson(data);
        }

    };

}]);