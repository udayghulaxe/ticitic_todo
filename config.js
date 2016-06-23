app.config(['$stateProvider', 'USER_ROLES', '$urlRouterProvider','$locationProvider', function($stateProvider, USER_ROLES, $urlRouterProvider,$locationProvider) {

	   $stateProvider
	    .state('intro', {
	      url: '/',
	      templateUrl: './partials/intro.html',
			data: {
	          pageTitle: ''
	        }
	    })
	    .state('404', {
	      url: '/404',
	      templateUrl: './partials/404.html',
			data: {
	          pageTitle: '404'
	        }
	    })
	    .state('login', {
	      url: '/login',
	      templateUrl: './partials/login.html',
			data: {
	          pageTitle: 'Login'
	        }
	    })
	    .state('register', {
	      url: '/register',
	      templateUrl: './partials/register.html',
	      data: {
	          pageTitle: 'Register'
	        }
	    })
	    .state('dashboard', {
			url: '/dashboard',
			abstract: true,
 			views: {
            '': { templateUrl: './partials/main.html'},
            'header_toolbar@dashboard': { templateUrl: './views/header_toolbar.html' },
            'sidenavleft@dashboard': { templateUrl: './views/sidenav.html' },
            'widgets@dashboard': { templateUrl: './views/widgets.html'},
            'todo_detail@dashboard': { templateUrl: './views/todo_detail.html' }

         	}
		})

			.state('dashboard.listdetail', {
				url: '/lists/:list_id/',
				templateUrl: './partials/list.detail.html',
				controller:'ListController',
				resolve: {
				            list_id: function($stateParams){
				                return $stateParams.list_id;
				            }
				        },
				data: {
					authorizedRoles: [USER_ROLES.user],
					pageTitle: 'Lists'
				}
			})


			.state('dashboard.tododetail', {
			url: '/lists/:list_id/:todo_id',
			templateUrl: './partials/list.detail.html',
			controller:'ListController',
			resolve: {
			        list_id: function($stateParams){
			        	console.log($stateParams);
			            return $stateParams.list_id;
			        }
			        ,
			        todo_id: function($stateParams){
			        	console.log($stateParams);
			            return $stateParams.todo_id;
			        }
			    }
			})


		.state('dashboard.test', {
			url: '/test',
			templateUrl: './partials/admin.html',
			data: {
				authorizedRoles: [USER_ROLES.user],
				pageTitle: 'Lists'
			}
		})
		.state('dashboard.admin', {
			url: '/admin',
			templateUrl: './partials/admin.html',
			data: {
				authorizedRoles: [USER_ROLES.admin],
				pageTitle: 'admin'
			}
		});

		// Specify URL states here
	    //$urlRouterProvider.otherwise('/login');

		$urlRouterProvider.otherwise( function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("intro");
       });

	}
]);

app.config(['$httpProvider', '$mdThemingProvider', function ($httpProvider,$mdThemingProvider) {
	//red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey

	$mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red');

	$mdThemingProvider.theme('light-blue')
    .primaryPalette('light-blue')
    .accentPalette('blue')
    .warnPalette('red');

    $mdThemingProvider.theme('yellow')
    .primaryPalette('yellow', {
      'default': '400',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': 'A100'
    })
    .accentPalette('yellow')
    .warnPalette('red');


    $mdThemingProvider.theme('blue')
    .primaryPalette('blue')
    .accentPalette('blue', {
      'default': '400',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': 'A100'
    })
    .warnPalette('red');

    $mdThemingProvider.theme('teal')
    .primaryPalette('teal')
    .accentPalette('green', {
      'default': '400',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': 'A100'
    })
    .warnPalette('red');

	$mdThemingProvider.alwaysWatchTheme(true);

  	$httpProvider.interceptors.push('AuthInterceptor');
}]);
