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

  $http.get("/readgames")
  .then(function(response) {
    $scope.myWelcome = response.data;
  });
  $scope.login = function() {
    $http.post('/login',$scope.user)
    .then(function (response) {
      if (response.data == "username") {
        //show error
        console.log(response.data);
      }
      else if (response.data == "password") {
        //Show error
        console.log(response.data);
      }else{
        window.location.href = "/";
      }
    })
  }
  $scope.createAccount = function () {
    $scope.nUser.user_DOB = new Date($scope.user_DOB.year,$scope.user_DOB.month-1,$scope.user_DOB.day)
    console.log($scope.nUser.user_DOB);
    $http.post("/createuser",$scope.nUser)
    .then(function (res) {
      console.log(res);
    })
  }
  $scope.nextGame = function () {
    var ws = new WebSocket("ws://localhost:9000/game/next");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': $scope.game.game_Name
      }));
      ws.onmessage = function (event) {
        var result = JSON.parse(event.data)[0];
        $scope.game = result;
        $scope.$apply();
      }
    }
  }
  $scope.randGame = function () {
    var ws = new WebSocket("ws://localhost:9000/game/random");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'rand': "random"
      }));
    }
    ws.onmessage = function (event) {
      $scope.game = JSON.parse(event.data);
      $scope.$apply();
    }
  }
  $scope.prevGame = function () {
    var ws = new WebSocket("ws://localhost:9000/game/prev");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': $scope.game.game_Name
      }));
    }
    ws.onmessage = function (event) {
      var result = JSON.parse(event.data)[0];
      $scope.game = result;
      $scope.$apply();
    }
  }
});
