var app = angular.module("myApp", ["ngRoute","xeditable"]);
app.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs4'; // bootstrap3 theme. Can be also 'bs4', 'bs2', 'default'
}]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/user/anon/templates/list.template.html",
    controller: "myApps"
  })
  .when("/userdetails", {
    templateUrl : "/Template/account.template.html",
    controller: "userControl"
  })
  .when("/user", {
    templateUrl : "/Template/user.template.html",
    controller: "user"
  })
  .when("/games", {
    templateUrl : "/Template/adminGame.template.html",
    controller: "gameControl"
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
  $scope.loadGames = function (name) {
    var ws = new WebSocket("ws://localhost:9000/game/load");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'name': name
      }));
    }
    ws.onmessage = function (event) {
      var result = JSON.parse(event.data)[0];
      $scope.game = result;
      $scope.$apply();
      $('#exampleModal').modal('show');
    }
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
app.controller('user',function ($scope,$http) {
  $scope.load = function () {
    $http.get('/users').then(function (res) {
      $scope.userList = res.data;
    })
  }
  $scope.addUser = function () {
    $http.post('/users',$scope.newUser)
    .then(function (res) {
      $scope.load();
    })
  }
  $scope.delUser =function (id) {
    $http.delete('/users/'+id)
    .then(function (res) {
      $scope.load();
    })
  }
  $scope.load();
})
app.controller('gameControl', function($scope, $http) {
    $http.get("/readgames")
      .then(function(response) {
      $scope.myWelcome = response.data;
    });
  $scope.addGame = function () {
    $scope.nGame.equipment = ['test','test1'];
    $http.post("/newgame",$scope.nGame)
    .then(function (res) {
      console.log(res);
    })
  }


  $scope.users = [
   {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
   {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
   {id: 3, name: 'awesome user3', status: 2, group: null}
 ];

 $scope.statuses = [
   {value: 1, text: 'status1'},
   {value: 2, text: 'status2'},
   {value: 3, text: 'status3'},
   {value: 4, text: 'status4'}
 ];

 $scope.groups = [];


})
function nav() {
}
