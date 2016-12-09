
const {shell} = require('electron');

angular
.module('MainView', ['Menu'])
.controller('MainCtrl', ['$scope', 'StorageService', '$sce', function($scope, StorageService, $sce) {
    var vm = this;
    
    StorageService.init().then(function () {
        $scope.urls = StorageService.getCollection().data;

        createDom($scope.urls);
    });

    $scope.trustUrl = function (data) {
        return $sce.trustAsResourceUrl(data.url);
    };

    ipcRenderer.on('main-change-subdomain', function(event, changeUrl) {
        // TO ME : changer la classe de la bonne url
        var webviews = document.getElementsByTagName('webview');
        for (var i = 0; i < webviews.length; i++) {
            webviews[i].setAttribute('class', 'link-webview');
        }

        var selectedWebview = document.getElementById('link-webview-' + changeUrl.slug);
        selectedWebview.setAttribute('class', 'link-webview active');
    });

    ipcRenderer.on('main-sync-urls', function(event, urls) {
        $scope.urls = urls;
        resetDom();
        createDom(urls);
    });

    var createDom = function (links) {
        var container = document.getElementById("webview-container");
        links.forEach(function(link, index) {
            var newWebviewNode = document.createElement("webview");
            var classes = 'link-webview ' + (link.active ? 'active' : '');
            newWebviewNode.setAttribute('class', classes);
            newWebviewNode.setAttribute('src', link.url);
            newWebviewNode.setAttribute('id', 'link-webview-' + link.slug);
            newWebviewNode.setAttribute('partition', 'persist:link-webview-' + link.slug);
            
            container.appendChild(newWebviewNode);

            newWebviewNode.addEventListener('new-window', (e) => {
                const protocol = require('url').parse(e.url).protocol;
                if (protocol === 'http:' || protocol === 'https:') {
                    shell.openExternal(e.url)
                }
            });
        });
    };

    var resetDom = function () {
        var container = document.getElementById("webview-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    };
}]);
