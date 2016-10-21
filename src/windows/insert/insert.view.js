const {ipcRenderer} = require('electron');

angular
.module('InsertView', ['Utils'])
.controller('InsertCtrl', ['$scope', 'StorageService', function($scope, StorageService) {
    var vm = this;
    vm.form = { url: "", active: false};
    $scope.cancelAdding = function cancelAdding() {
        ipcRenderer.send("toggle-add-url-view");
    };

    StorageService.init();
   
    $scope.add = function add() {
        
        var data = {url: vm.form.url + ".espace.link"};
        StorageService.addDoc(data).then(function(collection) {
            vm.form.url = "";
            var result = ipcRenderer.sendSync("sync-urls", collection.data);
            if (result) {
                ipcRenderer.send("toggle-add-url-view");
            }
        }, function err(e) {
        });
    }
}]);
