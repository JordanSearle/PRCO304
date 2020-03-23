var app = angular.module("myApp", ["ngRoute"]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/user/anon/templates/list.template.html",
    controller: "myApps"
  })
  .when("/userdetails", {
    templateUrl : "/Template/user.template.html",
    controller: "userControl"
  })
  .when("/user", {
    templateUrl : "/Template/user.template.html",
    controller: "userControl"
  })
  .when("/games", {
    templateUrl : "/Template/user.template.html",
    controller: "userControl"
  })
  .when("/request", {
    templateUrl : "/Template/user.template.html",
    controller: "userControl"
  })
  $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
         });

    }]);
app.controller('myApps', function($scope, $http) {
    $http.get("/readgames")
      .then(function(response) {
      $scope.myWelcome = response.data;
    });
    $http.get("/user")
      .then(function(response) {
        $scope.user = response.data.username;
    });
  $scope.logout = function () {
    $http.get("/logout")
    .then(function (res) {
      window.location.href = "/";
    })
  }
  $scope.addGame = function () {
    $scope.nGame.equipment = ['test','test1'];
    $http.post("/newgame",$scope.nGame)
    .then(function (res) {
      console.log(res);
    })
  }
});
app.controller('userControl', function($scope, $http) {

  $scope.load = function () {

  $http.get("/user")
  .then(function(response) {
    $scope.user = response.data;
    var test = new Date($scope.user.user_DOB).toISOString().substr(0, 10);
    $scope.dInput = test
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
      $scope.logout();
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
function nav() {
  if ($('#mySidebar').width() != 250) {
    $('#mySidebar').width('250px');
    $(".main").css( { marginLeft : "250px"} );
  }
  else{
    $('#mySidebar').width('0px');
    $(".main").css( { marginLeft : "0px"} );
  }
}
