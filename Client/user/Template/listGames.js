
var app = angular.module("user", ["ngRoute"]);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "anon/templates/list.template.html",
    controller: "gameControl"
  }).when("/userdetails", {
    templateUrl : "/Template/curruser.template.html",
    controller: "userControl"
  }).when('/bookmarks',{
    templateUrl:"/Template/bookmarks.template.html",
    controller:"bookmarkControl"
  })

    }]);
app.controller('gameControl', function($scope, $http) {
  $http.get("/readgames")
  .then(function(response) {
    $scope.myWelcome = response.data;
  });
  $http.get("/user")
  .then(function(response) {
    $scope.user = response.data;
  });
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
  $scope.bookmark = function (id) {
    $http.post('/game/bookmark',JSON.stringify({'gameID':id}))
    .then(function (res) {
      console.log(res);
    })
  }
});
app.controller('userLoad',function ($scope,$http) {
  $http.get("/user")
  .then(function(response) {
    $scope.user = response.data;
    var test = new Date($scope.user.user_DOB).toISOString().substr(0, 10);
    $("#selector").flatpickr({defaultDate:new Date($scope.user.user_DOB)});
    $scope.dInput = test
  });
  $scope.logout = function () {
    $http.get("/logout")
    .then(function (res) {
      window.location.href = "/";
    })
  }
})
app.controller('userControl', function($scope, $http) {

  $scope.load = function () {
    $http.get("/user")
    .then(function(response) {
      $scope.user = response.data;
      var test = new Date($scope.user.user_DOB).toISOString().substr(0, 10);
      $("#selector").flatpickr({defaultDate:new Date($scope.user.user_DOB)});
      $scope.dInput = test
    });
    $http.get('/user/bookmarks')
    .then(function (res) {
      $scope.bookmarks = res.data;
    })
    }
  $scope.logout = function () {
    console.log('log');
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
  $scope.delBookmark = function (id) {
    $http.delete('/game/bookmark',{data: {gameID:id}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
    .then(function (res) {
      console.log(res);
      $scope.load();
    })
  }
  $scope.load();
});
app.controller('bookmarkControl',function ($scope,$http) {
  $scope.load = function () {
    $http.get('/user/bookmarks').then(function (res) {
      $scope.bookmarks = res.data;
    })
  }
  $scope.load();
  $scope.saveTag = function (id,tag) {
    $scope.data = {gameID:id,tagName:$scope.tag.name};
    $http.post('/user/bookmarks/tag',$scope.data).then(function (res) {
      console.log(res);
      $scope.load();
    })
  }
  $scope.delTag = function (id,tag) {
    $http.delete('/user/bookmarks/tag',{data: {gameID:id,tagName:tag}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (res) {
      console.log(res);
      $scope.load();
    })
  }
})
//Navbar functions (will be moved to own file)
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
