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

  sharesService.voteShare(share, {vote: 1}).then(function () {
    return sharesService.getByShareId(share._id).then(function (updatedShare) {
      share.upvotes = updatedShare.upvotes;
      share.downvotes = updatedShare.downvotes;
    });
    // Get the latest version of share from the server
    // Once you've gotten it, update share.upvotes and share.downvotes
  });
};

  self.downVote = function(share) {

  sharesService.voteShare(share, {vote: -1}).then(function () {
    return sharesService.getByShareId(share._id).then(function(updatedShare){
      share.upvotes = updatedShare.upvotes;
      share.downvotes = updatedShare.downvotes;
    });
  });
};

//   self.clearVotes = function(share) {
//   sharesService.clearVote(share, {vote: 0});
// };

}]);
