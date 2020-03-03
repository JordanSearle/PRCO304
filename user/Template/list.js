var app = angular.module("myApp", ["ngRoute"]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/Template/list.template.html",
    controller: "myApps"
  })
  .when("/userdetails", {
    templateUrl : "/Template/user.template.html",
    controller: "userControl"
  })
  $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
         });

    }]);
app.controller('myApps', function($scope, $http) {
  $http.get("/readgames")
  .then(function(response) {
    $scope.myWelcome = response.data;
  });
  $scope.logout = function () {
    $http.get("/logout")
    .then(function (res) {
      window.location.href = "/";
    })
  }
});
app.controller('userControl', function($scope, $http) {

  $scope.load = function () {
  $http.get("/user")
  .then(function(response) {
    $scope.user = response.data;
  });
    }
  $scope.logout = function () {
    $http.get("/logout")
    .then(function (res) {
      window.location.href = "/";
    })
  }
  $scope.delete= function () {
    $http.delete("/user")
    .then(function (res) {
      window.location.href = "/";
    })
  }
  $scope.editAccount= function () {
    $http.put("/user",$scope.eUser)
    .then(function (res) {
      $scope.load();
    })
  }
  $scope.load();
});
