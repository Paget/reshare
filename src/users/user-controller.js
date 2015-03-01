app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm',
    resolve: {
      user: ['$route', 'usersService', function ($route, usersService) {
        var routeParams = $route.current.params;
        return usersService.getByUserId(routeParams.userid);
      }],
      shares:['sharesService', '$route', function (sharesService, $route) {
        return sharesService.list().then(function(data){
          console.log(data);
          return shares = data.filter(function(item){
            return item.userId == $route.current.params.userid;
          });

        });
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', 'shares', function (user, shares) {
  this.user = user;
  this.userShares = shares;
}]);
