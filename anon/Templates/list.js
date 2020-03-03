var app = angular.module("myApp", ["ngRoute"]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/Templates/list.template.html",
    controller: "myApps"
  })
  $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
         });

    }]);
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
  $scope.createAccount = function () {
    $http.post("/createuser",$scope.nUser)
    .then(function (res) {
      console.log(res);
    })
  }
});
