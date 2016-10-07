const {ipcRenderer} = require('electron');

angular
.module('Menu', [])
.directive('menu', [function() {
    
    return {
        restrict: 'A',
        templateUrl: './menu.html',
        link: function (scope, element, attribute) {
            
      
        }
    };
}]);
