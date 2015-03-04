// The root module for our Angular application
var app = angular.module('app', ['ngRoute']);

app.controller('MainNavCtrl',
  ['$location', 'StringUtil', function($location, StringUtil) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };
  }]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'shares/new-shares.html',
    controller: 'NewSharesCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/shares/new', routeDefinition);
}])
.controller('NewSharesCtrl', ['sharesService', 'Share', function (sharesService, Share) {

  var self = this;


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
    self.newShare.url = "http://";
  };
}]);

app.factory('Share', function () {
  return function (spec) {
    spec = spec || {};
    return {
      url: spec.url || '',
      description: spec.description || ''
    };
  };
});

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

app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId || '',
      role: spec.role || 'user'
    };
  };
});

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'users/users.html',
    controller: 'UsersCtrl',
    controllerAs: 'vm',
    resolve: {
      users: ['usersService', function (usersService) {
        return usersService.list();
      }]
    }
  };

  $routeProvider.when('/users', routeDefinition);
}])
.controller('UsersCtrl', ['users', 'usersService', 'User', function (users, usersService, User ) {
  var self = this;

  self.users = users;

  self.newUser = User();

  self.addUser = function () {
    // Make a copy of the 'newUser' object
    var user = User(self.newUser);

    // Add the user to our service
    usersService.addUser(user).then(function () {
      // If the add succeeded, remove the user from the users array
      self.users = self.users.filter(function (existingUser) {
        return existingUser.userId !== user.userId;
      });

      // Add the user to the users array
      self.users.push(user);
    });

    // Clear our newUser property
    self.newUser = User();
  };
}]);

// A little string utility... no biggie
app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

app.factory('sharesService', ['$http', '$log', function($http, $log) {

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function remove(url) {
    return processAjaxPromise($http.delete(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/res');
    },

    getByShareId: function (shareId) {
      if (!shareId) {
        throw new Error('getByShareId requires a share id');
      }

      return get('/api/res/' + shareId);
    },

    addShare: function (share) {
      return processAjaxPromise($http.post('/api/res', share));
    },

    removeShare: function (shareId) {
      if (!shareId) {
        throw new Error('removeShare requires a share id');
      }

      return remove('/api/res/' + shareId);
    },

    voteShare: function (share, vote) {
      console.log("hello", share, vote);
      return processAjaxPromise($http.post('/api/res/'+ share._id +'/votes', vote));
    }
  };
}]);

app.factory('usersService', ['$http', '$log', function($http, $log) {

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    list: function () {
      return get('/api/users');
    },

    getByUserId: function (userId) {
      if (!userId) {
        throw new Error('getByUserId requires a user id');
      }

      return get('/api/users/' + userId);
    },

    addUser: function (user) {
      return processAjaxPromise($http.post('/api/users', user));
    }
  };
}]);

//# sourceMappingURL=app.js.map