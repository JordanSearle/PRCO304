var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/Templates/list.template.html",
    controller: "myApps"
  })
});
app.controller('myApps', function($scope, $http) {
  console.log('test');
  $http.get("/readgames")
  .then(function(response) {
    $scope.myWelcome = response.data;
  });
});
