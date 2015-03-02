app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/new-shares.html',
    controller: 'NewSharesCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/shares/new', routeDefinition);
}])
.controller('NewSharesCtrl', ['sharesService', 'Share', function (sharesService, Share) {

//   this.shares = shares;
// console.log(shares, "hello");
  var self = this;

  // self.shares = shares;

  self.newShare = Share();

  self.newShare.url = "http://";

  self.addShare = function () {


    // Make a copy of the 'newShare' object
    var share = Share(self.newShare);

    // Add the share to our service
    sharesService.addShare(share);
    // .then(function () {
    //   // If the add succeeded, remove the user from the shares array
    //   self.shares = self.shares.filter(function (existingShare) {
    //     return existingShare.shareId !== share.shareId;
    //   });
    //
    //   // Add the share to the shares array
    //   self.shares.push(share);
    // });

    // Clear our newShare property
    self.newShare = Share();
  };
}]);
