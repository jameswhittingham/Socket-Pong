'use strict';

angular.module('myApp.controllers', ['myApp.services'])

.controller('pongController', ['$scope', '$injector', 'competitionservice', '$q', '$timeout',
	function($scope, $injector, competitionservice, $q, $timeout) {

/*

TODO: 
1) Somehow 'sync' players so both players have 'player' and 'competitor'
2) Dont start ball on 'play' click start when both players are ready
3) Update scores
4) 

*/
		
		var $win = $(window),
			socket = io();

		$scope.win = {
			'height' : 0,
			'width' : 0,
			'padding' : 5,
			'gameOn' : false,
			'player' : {
				'username' : "",
				'score' : 0
			},
			'competitor' : {
				'username': "",
				'score' : 0
			},
			'roomName' : ''
		}

		resetBall();

		$scope.paddle = {
			'position' : {
				'left' : 5,
				'bottom' : 10
			},
			'increment' : 2.5,
			'width' : 20,
			'height' : 2.5,
			movePaddle : function(direction) {
				var paddleLeft = this.position.left - (this.increment * direction);

				if (paddleLeft <= $scope.win.padding) {
					paddleLeft = $scope.win.padding; 
				} else if (paddleLeft >= (100 - $scope.win.padding - $scope.paddle.width)) {
					paddleLeft = (100 - $scope.win.padding - $scope.paddle.width);
				}

				this.position.left = paddleLeft;		
			}
		}

		function resetBall() {
			$scope.ball = {
				'width' : 2.5,
				'position' : {
					'top' : 50,
					'left' : 50
				},
				'increment' : 1,
				'directionOffset' : {
					'top' : 0,
					'left' : 0
				},
				'speed' : 35,
				'opacity' : 0
			}

			$scope.win.gameOn = false;
		}

		$scope.moveball = function(){
			detectWalls();

			//move the ball
			$scope.ball.position.top += ($scope.ball.increment * $scope.ball.directionOffset.top);
			$scope.ball.position.left += ($scope.ball.increment * $scope.ball.directionOffset.left);

			detectPaddle();
		}

		$scope.movePaddle = function($event){
			//Detect keypress
			if ($event.keyCode == 39) { //Left
				$scope.paddle.movePaddle(-1);
			} else if ($event.keyCode == 37) { //Right
				$scope.paddle.movePaddle(+1);
			}
		}

		function detectWalls() {
			//Change direction if ball hits wall
			if(($scope.ball.position.left > 100 - $scope.win.padding) || ($scope.ball.position.left <= 0 + $scope.win.padding)) {
				$scope.ball.directionOffset.left = -$scope.ball.directionOffset.left;
			}
			//Detect ceiling
			if($scope.ball.position.top < 0 & $scope.ball.opacity != 0) {
				$scope.win.gameOn == true;

				console.log('sock it');

				var user = null;

				socket.emit('exitball', { 
					ball : $scope.ball,
					from : $scope.win.player.username,
					to : $scope.win.competitor.username
				});

				$scope.ball.directionOffset.top = 0;
				$scope.ball.directionOffset.left = 0;
				$scope.ball.opacity = 0;
			}
		}

		function detectPaddle() {
			var paddleMax = $scope.paddle.position.left + $scope.paddle.width;

			//detect ball passing paddle position
			if ($scope.ball.position.top >= (100 - $scope.paddle.position.bottom - ($scope.paddle.height*2))) {

				//detect ball hitting padle
				if (paddleMax > $scope.ball.position.left && $scope.ball.position.left > $scope.paddle.position.left) {
					$scope.ball.directionOffset.top = -$scope.ball.directionOffset.top;
				} 

				//loser condition
				if ($scope.ball.position.top > 100){
					resetBall();
				};
			} 
		}

		function setDimensions() {
			//set the dimensions of the screen on screen resize
			$scope.win.width = $win.width();
			$scope.win.height = $win.height();
		}

		socket.on('enterball', function(user, data){
			console.log('ball enter: ' + user + ', ' + $scope.win.player.username);
			if ($scope.win.player.username == user) {
				$scope.ball.position.top = 1;

				$scope.ball.directionOffset.top = -data.directionOffset.top; //1;
				$scope.ball.directionOffset.left = data.directionOffset.left; //-0.5;
				$scope.ball.opacity = 1;
			}
		});

		socket.on('playerEnter', function(data){
			if (data.username != $scope.win.player.username) {
				$scope.win.competitor.username = data.username;
			}
		});

		$scope.joinRoom = function(username, name) {
			$scope.win.roomName = name;
			//When a player joins a room
			socket.emit('join room', { 
				username : username,
				roomname : name
			});
		}

		$win.on('resize',setDimensions);
		setDimensions();
	}
])