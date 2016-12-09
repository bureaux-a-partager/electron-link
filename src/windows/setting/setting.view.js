const {ipcRenderer} = require('electron');

angular
.module('SettingView', ['Utils'])
.controller('SettingCtrl', ['$scope', 'StorageService', function($scope, StorageService) {
    var vm = this;
    vm.form = { url: "", active: false};
    $scope.cancelAdding = function cancelAdding() {
        ipcRenderer.send("toggle-add-url-view");
    };

    StorageService.init().then(function () {
        $scope.urls = StorageService.getCollection().data;
    });

    $scope.removeUrl = function (data) {
        var dialog = document.querySelector('#dialog');
        dialog.showModal();
        dialog.querySelector('button:not([disabled])').addEventListener('click', function() {
            StorageService.reload()
            .then(function() { 
                return StorageService.removeDoc(data); 
            })
            .then(function(collection) {
                    $scope.urls = collection.data;
                    ipcRenderer.send('sync-urls', collection.data);
                    dialog.close();
                });
        });
    };
    
    $scope.toggleSettingView = function() {
        ipcRenderer.send('toggle-setting-view');
    };

    ipcRenderer.on('main-sync-urls', function (event, urls) {
        $scope.urls = urls;
    });
}]);
