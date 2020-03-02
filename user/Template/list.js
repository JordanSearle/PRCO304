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
});
app.controller('userControl', function($scope, $http) {
  $http.get("/user")
  .then(function(response) {
    console.log(response.data);
    $scope.user = response.data;
  });
});
