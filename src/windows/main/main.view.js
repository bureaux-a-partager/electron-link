angular
.module('MainView', ['Menu'])
.controller('MainCtrl', ['$scope', 'StorageService', function($scope, StorageService) {
    var vm = this;
    
    StorageService.init().then(function () {
        $scope.urls = StorageService.getCollection().data;
    });

    ipcRenderer.on('main-change-subdomain', function(event, changeUrl) {
        // TO ME : changer la classe de la bonne url
        $scope.urls.forEach(function (urlData) {
            urlData.active = false;
            if (urlData.url === changeUrl.url) {
                urlData.active = true;
            }
        })
    });
}]);
