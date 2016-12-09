const {ipcRenderer} = require('electron');

angular
.module('Menu', ['Utils'])
.directive('bapElectronLinkLeftMenu', ['StorageService', '$q', function(StorageService, $q) {
    return {
        restrict: 'A',
        templateUrl: '../menu/menu.html', // because executed in main
        link: function (scope, elt, attribute) {
            
            var toggleAddUrlView = angular.element(document.querySelector("#toggle-add-url-view"));
            var toggleSettingView = angular.element(document.querySelector("#toggle-setting-view"));

            var resetActive = function () {
                scope.urls.forEach(function(url) {
                    url.active = false;
                    StorageService.updateDoc(url);
                });
            }

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


            scope.changeUrl = function (url) {
                resetActive();
                url.active = true;

                StorageService.reload().then(function() {
                    StorageService.updateDoc(url).then(function() {
                        ipcRenderer.send('change-subdomain', url);
                    });
                });
            };
        }
    };
}])
.filter('check', function() {
    return function(url) {
        var pattern = new RegExp(/^http(s)?:\/\/(([a-zA-Z0-9\.])+?)\.espace\.link$/);
        var trigram = pattern.exec(url)[2];
        if (!trigram) {
            return "ERR";
        }
        return trigram.substring(0,3);
    }
});
