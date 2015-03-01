app.factory('sharesService', ['$http', '$log', function($http, $log) {

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
      return get('/api/res');
    },

    getByShareId: function (shareId) {
      if (!shareId) {
        throw new Error('getByShareId requires a share id');
      }

      return get('/api/res/:id' + shareId);
    },

    addShare: function (share) {
      return processAjaxPromise($http.post('/api/res', share));
    }
  };
}]);
