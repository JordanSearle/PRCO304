
var app = angular.module("user", ["ngRoute",'ui.filters']);
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
  }).when('/request',{
    templateUrl:"/Template/request.template.html",
    controller:"requestControl"
  }).when('/games/:param',{
    templateUrl:'/Template/game.template.html',
    controller:"gameUIControl"
  })

    }]);
app.controller('gameControl', function($scope, $http) {
  $scope.myWelcome = [];
  $scope.filter = [];
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
  $scope.load = function () {
    $http.get("/user")
    .then(function(res) {
      $scope.user = res.data;
      $http.get("/game")
      .then(function(response) {
        response.data.forEach((item, i) => {
          if (item.game_IsNSFW == true) {
            console.log(calculate_age(new Date($scope.user.user_DOB)));
            if (calculate_age(new Date($scope.user.user_DOB)) >= 18) {
              $scope.myWelcome.push(item);
              $scope.filter.push(item);
            }
          }
          else{
            $scope.myWelcome.push(item);
            $scope.filter.push(item);
          }
        });


      });

    });

  }
  $scope.load();


  $scope.logout =function () {
    logout($http);
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
  $scope.bookmark = function (id) {
    $http.post('/game/bookmark',JSON.stringify({'gameID':id}))
    .then(function (res) {
      //Replace Console.Log with Alert Show...
      alertStatusShow(res,$scope)
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    })
  }
  $scope.like = function (id) {
    var ws = new WebSocket("ws://localhost:9000/game/like");
    ws.onopen = function () {
      ws.send(JSON.stringify({
        'gameID': id
      }));
    }
    ws.onmessage = function (event) {
      alertStatusShow(event,$scope)
      $scope.load();
    }
  }
  $scope.loadGamePage = function (name) {
    loadAGame(name,$scope)
  }
  $scope.arr = ['text-white bg-secondary','text-white bg-info','bg-light']
  $scope.getRandomClass = function(){
    return Math.random()*$scope.arr.length;
  }
});
app.controller('userLoad',function ($scope,$http) {
  hideAllAlerts();
  $scope.search = function () {
    search($scope);
  }
  $scope.logout =function () {
    logout($http);
  }

  $http.get('/game').then(function (res) {
    $scope.test = res.data.slice(0,5);
  })
  $http.get("/user")
  .then(function(response) {
    $scope.user = response.data;
    var test = new Date($scope.user.user_DOB).toISOString().substr(0, 10);
    $("#selector").flatpickr({defaultDate:new Date($scope.user.user_DOB)});
    $scope.dInput = test;
  });


  $scope.load = function (name) {
    $scope.selGame = name;
    $scope.loadGame();
  }
  $scope.loadGame = function () {
    $scope.test.forEach((item, i) => {
      if ($scope.selGame == item.game_Name) {
        $scope.selected = encodeURIComponent($scope.selGame);
        window.location.href = "#!/games/"+$scope.selected;
      }
    });
  }
})
app.controller('userControl', function($scope, $http) {
  hideAllAlerts();
$scope.alert = {}
  $scope.load = function () {
    loadSelfUser($scope,$http)
  }
  $scope.logout =function () {
    logout($http);
  }
  $scope.alertDelete = function () {
    alertDelete()
  }
  $scope.delete= function () {
    deleteAcc($scope,$http)
  }
  $scope.editAccount= function () {
    editAccount($scope,$http);
  }
  $scope.load();
});
app.controller('bookmarkControl',function ($scope,$http) {
  $scope.load = function () {
    $http.get('/user/bookmarks').then(function (res) {
      $scope.bookmarks = res.data;
      $scope.list = $scope.bookmarks;
      $scope.dropdowns = [];
      if ($scope.bookmarks.length > 0) {
        $scope.bookmarks.forEach((item, i) => {
            item.tags.forEach((items, i) => {
              $scope.dropdowns.push(items.name);
            });
        });
      }
    })
  }
  $scope.load();
  $scope.filter = function () {
    if ($scope.filterValue == '') {
      $scope.list = $scope.bookmarks;
    }
    else{
      $scope.list = [];
      $scope.bookmarks.forEach((item, i) => {
        item.tags.forEach((item1, i) => {
          if (item1.name == $scope.filterValue) {
            $scope.list.push(item);
          }
        });
      });
    }
  }
  $scope.saveTag = function (id,tag) {
    $scope.data = {gameID:id,tagName:$scope.tag.name};
    $http.post('/user/bookmarks/tag',$scope.data).then(function (res) {
      alertStatusShow(res,$scope)
      $scope.load();
    })
  }
  $scope.delTag = function (id,tag) {
    $http.delete('/user/bookmarks/tag',{data: {gameID:id,tagName:tag}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (res) {
      alertStatusShow(res,$scope)
      $scope.load();
    })
  }
  $scope.delBookmark = function (id) {
    $http.delete('/game/bookmark',{data: {gameID:id}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (res) {
      alertStatusShow(res,$scope)
      $scope.load();
    })
  }
})
app.controller('requestControl',function ($scope,$http) {
  $scope.categories = ['Movie','Coin','Card','Video Games','Sport','Misc','Board Games','Dinner Party','Birthdays','Retirement','Family Gathering']
  var ruleMDE = new SimpleMDE({ element: document.getElementById("ruleInput"),toolbar: ["ordered-list", "|", "preview"],forceSync:true});
  var summaryMDE = new SimpleMDE({ element: document.getElementById("summaryInput"),toolbar: ["bold", "italic", "heading", "|", "unordered-list","ordered-list","|","preview"],forceSync:true  });
  $scope.newGame = {
    game_Equipment:[]
  };
  $scope.addRequest = function () {
    $scope.nGame.game_Rules = ruleMDE.value();
    $scope.nGame.game_Summery = summaryMDE.value();
    $scope.nGame.game_Equipment = $scope.newGame.game_Equipment

    $http.post('/game',$scope.nGame).then(function (res) {
      alertStatusShow(res,$scope)
      $scope.load();
    })
  }

  $scope.addEquipment = function () {
    $scope.newGame.game_Equipment.push($scope.newEquipment);
    $scope.$apply;
  }
  $scope.delEquipment = function (name) {
    var rtnValue = $scope.newGame.game_Equipment.findIndex(function (item,i) {
      return item === name;
    })
    $scope.newGame.game_Equipment.splice(rtnValue,1);
  }
  $scope.load = function () {
    $http.get('/user/pending').then(function (res) {
      $scope.pList = res.data;
      alertStatusShow(res,$scope)
    })
  }
  $scope.load();

})
app.controller('gameUIControl',function ($scope,$http,$routeParams) {
  $('#exampleModal').modal('hide');
  $('.modal-backdrop').remove();
  var ruleMDE = new SimpleMDE({ element: document.getElementById("ruleInput"),toolbar: ["ordered-list", "|", "preview"],forceSync:true});
  var summaryMDE = new SimpleMDE({ element: document.getElementById("summaryInput"),toolbar: ["bold", "italic", "heading", "|", "unordered-list","ordered-list","|","preview"],forceSync:true  });

  $scope.load = function () {
    $http.get('/game/'+encodeURIComponent($routeParams.param))
    .then(function (res) {
      $scope.game = res.data[0];
      $scope.eGame = res.data[0];
      summaryMDE.value($scope.game.game_Summery)
      ruleMDE.value($scope.game.game_Rules)
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
//Navbar functions (will be moved to own file)
