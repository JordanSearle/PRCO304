var app = angular.module("myApp", ["ngRoute","xeditable"]);
app.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs4'; // bootstrap3 theme. Can be also 'bs4', 'bs2', 'default'
}]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/Template/dash.template.html",
    controller: "dashboard"
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
    templateUrl : "/Template/request.template.html",
    controller: "requestControl"
  })
  .when('/games/:param',{
    templateUrl:'/user/anon/Templates/game.template.html',
    controller:"gameUIControl"
  }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
         });

    }]);
app.controller('myApps', function($scope, $http) {
    $http.get("/game")
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
    $scope.load = function (name) {
      $scope.selGame = name;
      console.log('here');
      $scope.loadGame();
    }
    $scope.loadGame = function () {
      $scope.myWelcome.forEach((item, i) => {
        if ($scope.selGame == item.game_Name) {
          $scope.selected = encodeURIComponent($scope.selGame);
          window.location.href = "#!/games/"+$scope.selected;
        }
      });
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
    result = Object.assign({}, $scope.user, $scope.eUser);
    $http.put("/user",result)
    .then(function (res) {
      console.log(res.data);
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
    $http.post('/user',$scope.newUser)
    .then(function (res) {
      $scope.load();
    })
  }
  $scope.delUser =function (id) {
    console.log(id);
    $http.delete('/user',{data: {userID:id}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
    .then(function (res) {
      $scope.load();
    })
  }
  $scope.load();
})
app.controller('gameControl', function($scope, $http) {
  $scope.categories = ['Movie','Coin','Card','Video Games','Sport','Misc','Board Games','Dinner Party','Birthdays','Retirement','Family Gathering']
  $scope.delEquipment = function (name,id) {
    //Delete Equipment from the game

  var index = $scope.games.findIndex(function(item, i){
    return item._id === id
  });
  var equip = $scope.games[index].game_Equipment.findIndex(function (item,i) {
    return item === name;
  })
  $scope.games[index].game_Equipment.splice(equip,1);

  }
  $scope.addEquipment = function (id) {
    //Add Equipment to the game
    var index = $scope.games.findIndex(function(item, i){
      return item._id === id
    });
    $scope.games[index].game_Equipment.push($scope.newEquip[id])

    $scope.newEquip[id] = null;
  }
  $scope.load = function () {
    $http.get("/game")
      .then(function(response) {
      $scope.games = response.data;
    });
  }
  $scope.editGame = function ($data,game) {

      console.log($data);
      console.log(game);
    if (game._id != null) {
      //Add extra variables for the Equipment and categories
      game.game_Name = $data.game_Name;
      game.game_Summery = $data.game_Summery;
      game.game_Rules = $data.game_Rules;
      game.game_IsNSFW = $data.game_IsNSFW;
      game.game_Player_Count = $data.game_Player_Count;
      game.game_Categories = game.game_Categories;
      $http.put('/game',game).then(function (res) {
        console.log(res);
      })
    }
    else {
      game.game_Name = $data.game_Name;
      game.game_Summery = $data.game_Summery;
      game.game_Rules = $data.game_Rules;
      game.game_IsNSFW = $data.game_IsNSFW;
      game.game_Player_Count = $data.game_Player_Count;
      game.game_Categories = game.game_Categories;
      $http.post('/game',game).then(function (res) {
        console.log(res);
      })
    }
  }
  $scope.addGame = function() {
    $scope.inserted = {
      game_Name: '',
      game_Summery: '',
      game_Rules: '',
      game_IsNSFW: false,
      game_userID: null,
    };
    $scope.games.push($scope.inserted);
  };
  $scope.removeGame = function (id) {
    $http.delete('/game',{data: {id:id}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (res) {
      console.log(res);
    })
    $scope.load();
  }
$scope.load();

})
app.controller('requestControl',function ($scope,$http) {
  $scope.categories = ['Movie','Coin','Card','Video Games','Sport','Misc','Board Games','Dinner Party','Birthdays','Retirement','Family Gathering']
  $scope.delEquipment = function (name,id) {
    //Delete Equipment from the game

  var index = $scope.games.findIndex(function(item, i){
    return item._id === id
  });
  var equip = $scope.games[index].game_Equipment.findIndex(function (item,i) {
    return item === name;
  })
  $scope.games[index].game_Equipment.splice(equip,1);

  }
  $scope.addEquipment = function (id) {
    //Add Equipment to the game
    var index = $scope.games.findIndex(function(item, i){
      return item._id === id
    });
    $scope.games[index].game_Equipment.push($scope.newEquip[id])

    $scope.newEquip[id] = null;
  }
  $scope.load = function () {
    $http.get("/pending")
      .then(function(response) {
      $scope.games = response.data;
    });
  }
  $scope.editGame = function ($data,game) {
    game.game_Summery = $data.game_Summery;
    game.game_Rules = $data.game_Rules;
    game.game_Name = $data.game_Name;
    game.game_IsNSFW = $data.game_IsNSFW;
    game.game_Player_Count = $data.game_Player_Count;
    game.game_Categories = game.game_Categories;
      console.log(game);
      $http.post('/pending/save',game).then(function (res) {
        console.log(res);
        $scope.load();
      })
  }
  $scope.removeGame = function (id) {
    console.log(id);
    $http.delete('/pending',{data: {gameID:id}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(function (res) {
      console.log(res);
      $scope.load();
    })
  }
$scope.load();
})
app.controller('gameUIControl',function ($scope,$http,$routeParams) {
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
app.controller('dashboard',function ($scope,$http) {
  $scope.load = function () {
    $scope.cpuUsage = setInterval(callChart, 30000);
    $http.get('/game').then(function (res) {
      $scope.games = res.data;
      $scope.categories = {'Movie':0,'Coin':0,'Card':0,'Video Games':0,'Sport':0,'Misc':0,'Board Games':0,'Dinner Party':0,'Birthdays':0,'Retirement':0,'Family Gathering':0};
      $scope.games.forEach((item, i) => {
        if (item.hasOwnProperty("game_Categories")) {
          Object.keys(item.game_Categories).forEach(function(k){
              $scope.categories[k] = $scope.categories[k] +1;
          });
        }
      });
      console.log($scope.categories);

    })
    $http.get('/adminhome').then(function (res) {
      $scope.data = res.data;
      $scope.result.cpu = 0.3;
      $scope.result.totalMem = $scope.data.totalMem
      $scope.result.memm = $scope.data.memm
      console.log($scope.data);
    })
}
google.charts.load('current', {'packages':['corechart','bar']});
google.charts.setOnLoadCallback(drawCPUChart);

function drawCPUChart() {
  var data = google.visualization.arrayToDataTable([
    ['CPU Usage', 'Free Space'],
    ['Current Usage',     $scope.result.cpu*100],
    ['CPU Load',     100 - $scope.result.cpu*100],
  ]);
  var data2 = google.visualization.arrayToDataTable([
    ['CPU Usage', 'Free Space'],
    ['Memory Free',     $scope.result.totalMem],
    ['memory Used',     $scope.result.memm],
  ]);
  var data3 = google.visualization.arrayToDataTable([
    ['Average Time', 'Load Average'],
    ['One Minute Average',    $scope.data.loadavg[0]],
    ['Five Minute Average',     $scope.data.loadavg[1]],
    ['Fifteen Minute Average',     $scope.data.loadavg[2]],
  ]);
  var gameCateData = new google.visualization.arrayToDataTable([
    ['Category', 'Count'],
    ['Birthdays',$scope.categories.Birthdays],
    ['Board Games',$scope.categories['Board Games']],
    ['Dinner Party',$scope.categories['Dinner Party']],
    ['Card',$scope.categories.Card],
    ['Coin',$scope.categories.Coin],
    ['Family Gathering',$scope.categories['Family Gathering']],
    ['Misc',$scope.categories.Misc],
    ['Video Games',$scope.categories['Video Games']],
    ['Movie',$scope.categories.Movie],
    ['Sport',$scope.categories.Sport],
    ['Retirement',$scope.categories.Retirement]
  ]);

  var options = {
    title: 'CPU Usage',
    pieHole: 0.4,
    pieSliceTextStyle: {
      color: 'black',
    },
    backgroundColor: '#007bff',
    'chartArea': {'width': '100%', 'height': '100%'}
  };
  var options2 = {
    title: 'Ram Usage',
    pieHole: 0.4,
    pieSliceTextStyle: {
      color: 'black',
    },
    backgroundColor: '#ffc107',
    'chartArea': {'width': '100%', 'height': '100%'}
  };
  var options3 = {
    title: 'Average Usage',
    pieHole: 0.4,
    pieSliceTextStyle: {
      color: 'black',
    },
    backgroundColor: '#28a745',
    'chartArea': {'width': '100%', 'height': '100%'}
  };
  var optionsGameCat = {
    width: "100%",
    legend: { position: 'none' },
    bar: { groupWidth: "100%" }
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
  var chart = new google.visualization.PieChart(document.getElementById('donutchart2'));
  chart.draw(data, options);
  var chart = new google.visualization.PieChart(document.getElementById('ramchart'));
  chart.draw(data2, options2);
  var chart = new google.visualization.PieChart(document.getElementById('usagechart'));
  chart.draw(data3, options3);
  var chart = new google.charts.Bar(document.getElementById('gameCategories'));
  // Convert the Classic options to Material options.
  chart.draw(gameCateData, google.charts.Bar.convertOptions(optionsGameCat));
  var chart = new google.charts.Bar(document.getElementById('gameCategories1'));
  // Convert the Classic options to Material options.
  chart.draw(gameCateData, google.charts.Bar.convertOptions(optionsGameCat));
}

function callChart() {
  var ws = new WebSocket("ws://localhost:9000/adminhome");
  ws.onopen = function () {
    ws.send(JSON.stringify({
      'name': ''
    }));
    ws.onmessage = function (event) {
      $scope.result = JSON.parse(event.data);
      drawCPUChart()
        ws.close();
    }
  }
}
$scope.result = {};
$scope.load();
})
