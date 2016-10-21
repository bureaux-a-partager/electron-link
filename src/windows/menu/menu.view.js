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

            scope.removeUrl = function (data) {
                var dialog = document.querySelector('#dialog');
                dialog.showModal();
                dialog.querySelector('button:not([disabled])').addEventListener('click', function() {
                    StorageService.reload()
                    .then(function() { 
                        return StorageService.removeDoc(data); 
                    })
                    .then(function(collection) {
                            scope.urls = collection.data;
                            dialog.close();
                        });
                });
                
            };

            scope.changeUrl = function (url) {
                resetActive();
                url.active = true;

                

                var promises = [];
                scope.urls.forEach(function(url) { 
                    //promises.push(StorageService.updateDoc(url)); 
                });

                ipcRenderer.send('change-subdomain', url);
                // StorageService.reload().then(function() {
                //     $q.all(promises).then(function() {
                //     }, function (err) {
                //         console.log(err);
                //     });
                // });
            };
        }
    };
}]);
