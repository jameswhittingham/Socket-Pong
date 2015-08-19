'use strict';

angular.module('myApp.directives', ['myApp.services'])

.directive('pongGame', ['$interval', function($interval) {
   return {
        link: function(scope, element){
            $interval(scope.moveball, scope.ball.speed)
        }
    };
}]);