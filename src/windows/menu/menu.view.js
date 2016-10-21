const {ipcRenderer} = require('electron');

angular
.module('Menu', ['Utils'])
.directive('bapElectronLinkLeftMenu', ['StorageService', function(StorageService) {
    return {
        restrict: 'A',
        templateUrl: '../menu/menu.html', // because executed in main
        link: function (scope, elt, attribute) {
            
            var toggleAddUrlView = angular.element(document.querySelector("#toggle-add-url-view"));
            var toggleSettingView = angular.element(document.querySelector("#toggle-setting-view"));

            StorageService.init().then(function (db) {
                scope.urls = db.getDocs();
            }); 
                

            toggleAddUrlView.bind("click", function(evt) {
                evt.preventDefault();
                ipcRenderer.send('toggle-add-url-view');
            });

            toggleSettingView.bind("click", function(evt) {
                evt.preventDefault();
                ipcRenderer.send('toggle-setting-view');
            });

            ipcRenderer.on('main-sync-urls', function(event, urls) {
                scope.$apply(function() {
                    scope.urls = urls;
                });
            });

            scope.removeUrl = function (data) {
                StorageService.reload().then(function () {
                    StorageService.removeDoc(data).then(function(collection) {
                        scope.urls = collection.data;
                    });
                });
            };

            scope.changeUrl = function (url) {
                ipcRenderer.send('change-subdomain', url);
            };
        }
    };
}]);
