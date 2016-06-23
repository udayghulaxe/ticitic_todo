app.controller("appController",['$rootScope','$scope', '$state', '$window','AuthService','UserService', 'DataService','AUTH_EVENTS','USER_ROLES','$mdSidenav',
  function($rootScope,$scope, $state, $window, AuthService, UserService, DataService,AUTH_EVENTS,USER_ROLES,$mdSidenav)
{
 // $scope.user_role = AuthService.userrole;

$scope.dynamicTheme = 'light-blue';
$scope.changeTheme = function(theme) {
  console.log(theme);
    $scope.dynamicTheme = theme;
  };

  /***************** DEFINE AUTH EVENTS ***********************/
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    alert('You are Not Authorised to access this URL');
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    console.log('notAuthenticated');
    AuthService.ClearCredentials();
    //$location.path('/login');
    $state.go('login');
    //alert('notAuthenticated');
  });

  $scope.$on(AUTH_EVENTS.serverError, function(event) {
    //AuthService.ClearCredentials();
    //$state.go('login');
    alert('Oops.. This is server error.');
  });



  /*****************************************************/

  $rootScope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;

  $scope.setCurrentUser = function (user) {
    $rootScope.currentUser = user;
  };

  $scope.setGlobalVars = function (vars) {
    $rootScope.GlobalVars = vars;
  };

   $scope.setCurrentUserrole = function(role) {
    $rootScope.role = role;
  };

  $scope.toggleSidenav =  function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  // Load initial data into $scope ( init )
 /* $scope.load = function(){
  var temp_local_data = UserService.loadLocalData();
  if((temp_local_data != null ) || (typeof temp_local_data != 'undefined')){
    $scope.setGlobalVars();
    var local_data_globals = angular.fromJson(UserService.loadLocalData());
    $rootScope.current_user_id = local_data_globals.currentUser.user_id;
  }
  };*/


}
]);


app.controller("ListController",['$rootScope','$scope','$state', '$q', 'UserService', '$window','AuthService','DataService','AUTH_EVENTS','list_id','$mdSidenav',function($rootScope,$scope, $state, $q, UserService, $window, AuthService, DataService,AUTH_EVENTS,list_id,$mdSidenav)
{


 $scope.value = 'this is value2';
  $rootScope.list_id = list_id.toString();
  $rootScope.todo_id = '';
  $scope.current_list =  UserService.GetTodoBylistid($rootScope.lists, $scope.list_id);

  function toggleSidenav(menuId) {
    $mdSidenav(menuId).open();
  };

  $scope.Toggle_Todo_Detail = function (todo_id) {
    $state.go('dashboard.tododetail',{ list_id:$scope.list_id, todo_id:todo_id}, {reload: false});


    $scope.$watch(todo_id, function() {
        // do something here
        $rootScope.todo_id = todo_id;
    }, true);

      toggleSidenav('right');
   // console.log('toogle is here');

  };

}]);





app.controller("TodoDetailController",['$rootScope','$scope','$state', '$q', 'UserService', '$window','AuthService','DataService','AUTH_EVENTS','list_id','$mdSidenav','todo_id',
  function($rootScope,$scope, $state, $q, UserService, $window, AuthService, DataService,AUTH_EVENTS,list_id,$mdSidenav,todo_id)
{
  console.log('I am here');
}]);

app.controller("loginController",['$scope', '$state', '$q', 'UserService', '$window','AuthService','DataService','AUTH_EVENTS',
  function($scope, $state, $q, UserService, $window, AuthService, DataService,AUTH_EVENTS)
{


   $scope.login = function () {
    if($scope.password==null)
    {
      $scope.validation_error_password = true;
    }

    if($scope.email==null)
    {
     $scope.validation_error_email = true;
    }

    if($scope.password && $scope.email){
      $scope.serverError = null;
      $scope.serverSuccess = null;
      var encodedPassword = custom_encode($scope.password);
      var login_info = ({ 'email':$scope.email, 'password':encodedPassword });

    AuthService.Login(login_info)
    .then(function(response) {
        if (response.success) {
            $scope.serverSuccess = response.massage;
            $scope.setCurrentUser(response.userdata);
            $scope.setCurrentUserrole(response.userdata.user_role);
            //$state.go('dashboard.lists',{}, {reload: true});
            $state.go('dashboard.listdetail',{list_id:'inbox'}, {reload: true});
        } else {
          $scope.serverError = response.massage;
        }
    });
    }
  }
}]);

app.controller("registerController",['$scope', '$state', '$q', 'UserService', '$window','$log','$http','DataService','AUTH_EVENTS',
  function($scope, $state, $q, UserService, $window, $log, $http, DataService,AUTH_EVENTS)
{

$scope.register = function () {
  $scope.registerSuccess = '';
  $scope.registerError = '';
  var encodedPassword = custom_encode($scope.registerpassword);
  var newhash = dorand();
  var register_info = ({ full_name:$scope.registerfullname, email:$scope.registeremail, password:encodedPassword, unique_id:newhash });

  UserService.CreatUser(register_info)
    .then(function(response) {
        if (response.success) {
            $scope.registerSuccess = response.massage;
            // Resgistration succesfull ! Finally
        } else {
          $scope.registerError = response.massage;
        }
    });
};
}
]);
