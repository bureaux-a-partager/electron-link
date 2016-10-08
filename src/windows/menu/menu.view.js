const {ipcRenderer} = require('electron');

angular
.module('Menu', [])
.directive('bapElectronLinkLeftMenu', [function() {
    return {
        restrict: 'A',
        templateUrl: '../menu/menu.html', // because executed in main
        link: function (scope, element, attribute) {
        }
    };
}]);
