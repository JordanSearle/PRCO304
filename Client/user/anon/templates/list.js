
var app = angular.module("myApp", ["ngRoute"]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/Templates/list.template.html",
    controller: "myApps"
  })
  .when('/games/:param',{
    templateUrl:'/Templates/game.template.html',
    controller:"gameControl"
  })
  $locationProvider.html5Mode({
                enabled: false,
                requireBase: true
         });

    }]);
app.controller('myApps', function($scope, $http) {
  $scope.categories = ['Movie','Coin','Card','Video Games','Sport','Misc','Board Games','Dinner Party','Birthdays','Retirement','Family Gathering']
  $scope.filterGame = function () {
    if ($scope.selIndex == '') {
        $scope.myWelcome = $scope.filter;
    }
    else{
      $scope.myWelcome = [];
      $scope.filter.forEach((item, i) => {
        if (item.hasOwnProperty('game_Categories')) {
          if (item.game_Categories.hasOwnProperty($scope.selIndex)) {
            if (item.game_Categories[$scope.selIndex] == true) {
              $scope.myWelcome.push(item);
            }
          }
        }
      });
    }

  }
  $("#selector").flatpickr({defaultDate:new Date(1997, 0, 10)});
  $http.get("/game")
  .then(function(response) {
    $scope.myWelcome = response.data;
    $scope.test = response.data;
    $scope.filter = response.data;
    console.log($scope.selIndex);
  });
  $scope.search = function () {
    if ($scope.selGame) {
      var ws = new WebSocket("ws://localhost:9000/game/search");
      ws.onopen = function () {
        ws.send(JSON.stringify({
          'name': $scope.selGame
        }));
        ws.onmessage = function (event) {
          var result = JSON.parse(event.data);
          $scope.test = result;
          $scope.apply
        }
      }
    }
  }
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
    $http.post("/user",$scope.nUser)
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

      console.log($scope.game);
      $('#exampleModal').modal('show');
    }
  }
  $scope.load = function (name) {
    $scope.selGame = name;
    $scope.loadGame();
  }
  $scope.loadGame = function () {
    $scope.myWelcome.forEach((item, i) => {
      if ($scope.selGame == item.game_Name) {
        $scope.selected = encodeURIComponent($scope.selGame);
        console.log($scope.selected);
        window.location.href = "#!/games/"+$scope.selected;
      }
    });
  }
  $scope.arr = ['text-white bg-secondary','text-white bg-info','bg-light']
  $scope.getRandomClass = function(){
    return Math.random()*$scope.arr.length;
  }
});
app.controller('gameControl',function ($scope,$http,$routeParams) {
  $('#exampleModal').modal('hide');
  $('.modal-backdrop').remove();
  $scope.load = function () {
    console.log(encodeURIComponent($routeParams.param));
    $http.get('/game/'+encodeURIComponent($routeParams.param))
    .then(function (res) {
      $scope.game = res.data[0];
    })
  }
  $scope.load();
})
