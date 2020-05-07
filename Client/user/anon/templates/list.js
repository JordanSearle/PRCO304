
var app = angular.module("myApp", ["ngRoute"]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/templates/list.template.html",
    controller: "myApps"
  })
  .when('/games/:param',{
    templateUrl:'/templates/game.template.html',
    controller:"gameUIControl"
  })
  .otherwise({
    templateUrl : "/templates/list.template.html",
    controller: "myApps"
  });
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
  });
  $scope.search = function () {
    search($scope);
  }

  $scope.login = function() {
    $http.post('/login',$scope.user)
    .then(function (response) {
      $scope.loginUsername = '';
      $scope.loginPassword = '';
      if (response.data == "username") {
        //show error
        console.log(response.data);
        $scope.loginUsername = 'Username does not exist';
      }
      else if (response.data == "password") {
        //Show error
        console.log(response.data);
        $scope.loginPassword = 'Incorrect Password';
      }else{
        window.location.href = "/";
      }
    })
  }
  $scope.createAccount = function () {
    $http.post("/user",$scope.nUser)
    .then(function (res) {
      $scope.accountStatus = res.data;
    })
  }
  $scope.nextGame =function () {
    nextGame($scope);
  }
  $scope.randGame = function () {
    randGame($scope);
  }
  $scope.prevGame = function () {
    prevGame($scope);
  }

  $scope.loadGames = function (name) {
    loadModalGame(name,$scope)
  }

  $scope.loadGamePage = function (name) {
    loadAGame(name,$scope)
  }
  $scope.arr = ['text-white bg-secondary','text-white bg-info','bg-light']
  $scope.getRandomClass = function(){
    return Math.random()*$scope.arr.length;
  }
});

app.controller('gameUIControl',function ($scope,$http,$routeParams) {
  $('#exampleModal').modal('hide');
  $('.modal-backdrop').remove();
  $scope.load = function () {
    $http.get('/game/'+encodeURIComponent($routeParams.param))
    .then(function (res) {
      $scope.game = res.data[0];
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
          window.location.href = "#!/games/"+encodeURIComponent(result.game_Name)
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
      var result = JSON.parse(event.data);
        window.location.href = "#!/games/"+encodeURIComponent(result.game_Name)
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
        window.location.href = "#!/games/"+encodeURIComponent(result.game_Name)
    }
  }

  $scope.load();
})
