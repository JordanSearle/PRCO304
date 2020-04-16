
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
    $http.get("/game")
    .then(function(response) {
      $scope.myWelcome = response.data;
      $scope.filter = response.data;
    });
  }
  $scope.load();
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
      console.log(event);
      $scope.load();
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
});
app.controller('userLoad',function ($scope,$http) {
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
  $scope.logout = function () {
    $http.get("/logout")
    .then(function (res) {
      window.location.href = "/";
    })
  }
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
    $http.delete("/user",{data: {userID:$scope.user._id}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
    .then(function (res) {
      $scope.logout();
    })
  }
  $scope.editAccount= function () {
    if ($scope.eUser) {
      $scope.editUser = $scope.user;
      if ($scope.eUser.hasOwnProperty('username')) {
        $scope.editUser.username = $scope.eUser.username
      }
      if ($scope.eUser.hasOwnProperty('email')) {
        $scope.editUser.email = $scope.eUser.email
      }
      if ($scope.eUser.hasOwnProperty('password')) {
        $scope.editUser.password = $scope.eUser.password
      }
      if ($scope.eUser.hasOwnProperty('user_DOB')) {
        $scope.editUser.user_DOB = $scope.eUser.user_DOB
      }
      $http.put("/user/"+$scope.user.userID,$scope.editUser)
      .then(function (res) {
        $scope.load();
      })
    }
  }
  $scope.load();
});
app.controller('bookmarkControl',function ($scope,$http) {
  $scope.load = function () {
    $http.get('/user/bookmarks').then(function (res) {
      $scope.bookmarks = res.data;
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
  $scope.delBookmark = function (id) {
    $http.delete('/game/bookmark',{data: {gameID:id}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (res) {
      console.log(res);
      $scope.load();
    })
  }
})
app.controller('requestControl',function ($scope,$http) {
  var ruleMDE = new SimpleMDE({ element: document.getElementById("ruleInput"),toolbar: ["ordered-list", "|", "preview"],forceSync:true});
  var summaryMDE = new SimpleMDE({ element: document.getElementById("summaryInput"),toolbar: ["bold", "italic", "heading", "|", "unordered-list","ordered-list","|","preview"],forceSync:true  });

  $scope.addRequest = function () {
    $scope.nGame.game_Equipment = ['item'];
    $scope.nGame.game_Rules = ruleMDE.value();
    $scope.nGame.game_Summery = summaryMDE.value();
    console.log($scope.nGame);
    $http.post('/pending',$scope.nGame).then(function (res) {
      console.log(res);
    })
    $scope.load();
  }
  $scope.change = function () {
    $scope.nGame.game_Rules = ruleMDE.value();
    $scope.nGame.game_Summery = summaryMDE.value();
    console.log(  $scope.nGame);
    $scope.$apply();
  }
  $scope.load = function () {

    $http.get('/user/pending').then(function (res) {
      $scope.pList = res.data;
      console.log(res);
    })
  }
  $scope.load();

})
app.controller('gameUIControl',function ($scope,$http,$routeParams) {
  $('#exampleModal').modal('hide');
  $('.modal-backdrop').remove();
  var ruleMDE = new SimpleMDE({ element: document.getElementById("ruleInput"),toolbar: ["ordered-list", "|", "preview"],forceSync:true});
  var summaryMDE = new SimpleMDE({ element: document.getElementById("summaryInput"),toolbar: ["bold", "italic", "heading", "|", "unordered-list","ordered-list","|","preview"],forceSync:true  });
  $scope.editRequest = function () {
    $scope.eGame.game_Summery = summaryMDE.value();
    $scope.eGame.game_Rules = ruleMDE.value();
    $http.post('/pending',$scope.eGame).then(function (res) {
      console.log(res);
    })
  }
  $scope.load = function () {
    console.log(encodeURIComponent($routeParams.param));
    $http.get('/game/'+encodeURIComponent($routeParams.param))
    .then(function (res) {
      $scope.game = res.data[0];
      $scope.eGame = res.data[0];
      summaryMDE.value($scope.game.game_Summery)
      ruleMDE.value($scope.game.game_Rules)
    })
  }
  $scope.load();
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
