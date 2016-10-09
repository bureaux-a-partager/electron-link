const {ipcRenderer} = require('electron');

angular
.module('InsertView', [])
.controller('InsertCtrl', ['$scope', function($scope) {
    $scope.cancelAdding = function cancelAdding() {
        ipcRenderer.send("toggle-add-url-view");
    }
}]);