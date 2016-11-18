
const {shell} = require('electron');

angular
.module('MainView', ['Menu'])
.controller('MainCtrl', ['$scope', 'StorageService', '$sce', function($scope, StorageService, $sce) {
    var vm = this;
    
    StorageService.init().then(function () {
        $scope.urls = StorageService.getCollection().data;
        $scope.urls[0].active = true;
    });

    $scope.trustUrl = function (data) {
        return $sce.trustAsResourceUrl(data.url);
    };

    ipcRenderer.on('main-change-subdomain', function(event, changeUrl) {
        // TO ME : changer la classe de la bonne url
        $scope.urls.forEach(function (urlData) {
            urlData.active = false;
            if (urlData.url === changeUrl.url) {    
                urlData.active = true;
            }
        })
    });


// TODO
    var onNewWebview = function (webview) {
        webview.addEventListener('new-window', (e) => {
            const protocol = require('url').parse(e.url).protocol;
            if (protocol === 'http:' || protocol === 'https:') {
                shell.openExternal(e.url)
            }
        });
    };
}]);
