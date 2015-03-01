app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['sharesService', function(sharesService) {
        console.log('sharesService', sharesService.list());
        return sharesService.list();  
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['shares', 'sharesService', function (shares, sharesService) {
console.log(shares, "hello");
  this.shares = shares;

}]);
