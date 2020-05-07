//For shared JavaScript Functions.
function logout($http) {
  $http.get("/logout")
  .then(function (res) {
    window.location.href = "/";
  })
}

function search($scope) {
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

function nextGame($scope) {
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
function randGame($scope) {
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
function prevGame($scope){
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


function editAccount($scope,$http) {
  result = Object.assign({}, $scope.user, $scope.eUser);
  $http.put("/user",result)
  .then(function (res) {
    alertStatusShow(res,$scope)
    $scope.load();
  })
}
function deleteAcc($scope,$http) {
  $http.delete("/user",{data: {userID:$scope.user._id}, headers: {'Content-Type': 'application/json;charset=utf-8'}})
  .then(function (res) {
    $scope.logout();
  })
}
function loadModalGame(name,$scope) {
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
function loadAGame(name,$scope) {
  $scope.selGame = name;
  loadGame($scope);
}
function loadGame($scope) {
  $scope.myWelcome.forEach((item, i) => {
    if ($scope.selGame == item.game_Name) {
      $scope.selected = encodeURIComponent($scope.selGame);
      console.log($scope.selected);
      window.location.href = "#!/games/"+$scope.selected;
    }
  });
}

function loadSelfUser($scope,$http) {
    $http.get("/user")
    .then(function(response) {
      $scope.user = response.data;
      var test = new Date($scope.user.user_DOB).toISOString().substr(0, 10);
      $scope.dInput = test
    });
    $http.get('/user/bookmarks')
    .then(function (res) {
      $scope.bookmarks = res.data;
    })
  }
function nav() {
    if ($('#mySidebar').width() == 0) {
      if ($(window).width() > 1024) {
        $('#mySidebar').width('30vw');
      }
      else{
        $('#mySidebar').width($(window).width());
        $('html, body').css({'overflowY':'hidden'});
      }
      $(".main").css( { marginLeft : "30vw"} );
    }
    else{
      $('#mySidebar').width('0px');
      $(".main").css( { marginLeft : "0px"} );
      $('html, body').css({'overflowY':'auto'});
    }
  }
function hideAllAlerts() {
  $('#toast').toast('hide');
  $('#toast').css('z-index', -1)
  $('#delete').toast('hide');
  $('#delete').css('z-index', -1)
  $('#delete').children().children().attr("disabled", true);
}
function alertDelete() {
  $('#toast').toast('hide');
  $('#toast').css('z-index', -1)
  $('#delete').toast('show');
  $('#delete').css('z-index', 1000)
  $('#delete').children().children().removeAttr("disabled");
}
function alertStatusShow(json,$scope) {
  $("#alertTitle").text(json.statusText)
  $("#alertMessage").text(json.data)
  $('#toast').toast('show');
  $('#toast').css('z-index', 1000)
  $('#delete').toast('hide');
  $('#delete').css('z-index', -1)
  $('#delete').children().children().attr("disabled", true);
  }
