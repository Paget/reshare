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
          shares = data.filter(function(item){
            return item.userId == $route.current.params.userid;
          });
          return shares;
        });
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition);
}])
.controller('UserCtrl', ['user', 'shares', 'sharesService', function (user, shares, sharesService) {

  var self = this;

  self.user = user;

  self.userShares = shares;

  self.removeShare = function (shareId) {

    sharesService.removeShare(shareId).then(function(success){

      if (success === 1) {

        var updatedShares = self.userShares.filter(function(item){

          return item._id !== shareId;

        });

        self.userShares = updatedShares;

      }

    });

  }

}]);
