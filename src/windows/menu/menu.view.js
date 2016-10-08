const {ipcRenderer} = require('electron');

angular
.module('Menu', [])
.directive('bapElectronLinkLeftMenu', [function() {
    return {
        restrict: 'A',
        templateUrl: '../menu/menu.html', // because executed in main
        link: function (scope, elt, attribute) {
            
            var toggleAddUrlView = angular.element(document.querySelector("#toggle-add-url-view"));
            var toggleSettingView = angular.element(document.querySelector("#toggle-setting-view"));

            console.log(toggleAddUrlView, toggleSettingView);

            toggleAddUrlView.bind("click", function(evt) {
                evt.preventDefault();
                ipcRenderer.send('toggle-add-url-view');
            });

            toggleSettingView.bind("click", function(evt) {
                evt.preventDefault();
                ipcRenderer.send('toggle-setting-view');
            });
        }
    };
}]);
