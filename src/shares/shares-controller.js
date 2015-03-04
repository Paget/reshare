app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/shares.html',
    controller: 'SharesCtrl',
    controllerAs: 'vm',
    resolve: {
      shares: ['sharesService', function(sharesService) {
        return sharesService.list();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/shares', routeDefinition);
}])
.controller('SharesCtrl', ['shares', 'sharesService', function (shares, sharesService) {
  var self = this;

  self.shares = shares;

  self.upVote = function(share) {
  share.upvotes += 1;
  sharesService.voteShare(share, {vote: 1});
};

  self.downVote = function(share) {
  console.log("trying", share);
  sharesService.voteShare(share, {vote: -1});
};

  //self.clearVotes

}]);
