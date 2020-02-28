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
  $scope.login = function() {
    $http.post('http://localhost:9000/login',$scope.user)
    .then(function (response) {
       window.location.href = "/";
    })
  }
});
