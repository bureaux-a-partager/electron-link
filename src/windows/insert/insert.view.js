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
        
        slug = vm.form.url.replace(/[^a-zA-Z ]/g, "")
        var data = {url: vm.form.url, slug: slug, active: false};
        StorageService.reload()
            .then(function () {
                return StorageService.addDoc(data);
            })
            .then(function(collection) {
                vm.form.url = "";
                var result = ipcRenderer.sendSync("sync-urls", collection.data);
                if (result) {
                    ipcRenderer.send("toggle-add-url-view");
                }
        });
    }
}])
.directive('urlValidator', [ function urlValidator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            ngModel.$validators.isUrlValid = function (modelValue, viewValue) {
                var url = viewValue || modelValue;
                var isUrlValid = false;

                var pattern = new RegExp(/^http(s)?:\/\/([a-zA-Z0-9\.])+\.espace\.link$/);
                isUrlValid = pattern.test(url);
                
                return isUrlValid;
            };
        }
    };
}]);
