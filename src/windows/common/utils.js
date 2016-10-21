const loki = require('lokijs');
const path = require('path');

angular
.module('Utils',[])
.service('StorageService', ['$q', function StorageService($q) {
    this.db = new loki(path.resolve(__dirname, '../..', 'app.db'));
    this.collection = null;
    this.loaded = false;

    this.init = function init() {
        var deferred = $q.defer();

        this.reload().then(function () {
            this.collection = this.db.getCollection('url');
            deferred.resolve(this);
        }.bind(this))
        .catch(function (err) {
            this.db.addCollection('url');
            this.db.saveDatabase();
            this.collection = this.db.getCollection('url');
            deferred.resolve(this);
        }.bind(this));

        return deferred.promise;
    };

    this.reload = function () {
        var deferred = $q.defer();

        this.loaded = false;

        this.db.loadDatabase({}, function(err) {
            
            if (err) {
                return deferred.reject(err);
            } 

            this.loaded = true;
            return deferred.resolve(this);
        }.bind(this));

        return deferred.promise;
    }

    this.getCollection = function () {
        this.collection = this.db.getCollection('url');
        return this.collection;
    }

    this.isLoaded = function() {
        return this.loaded;
    }

    this.addDoc = function(data) {
        var deferred = $q.defer();

        if (this.isLoaded() && this.getCollection()) {
            this.getCollection().insert(data);
            this.db.saveDatabase();
            deferred.resolve(this.getCollection());
        } else {
            deferred.reject(new Error('DB NOT READY'));
        }

        return deferred.promise;
    };

    this.updateDoc = function(doc) {
         var deferred = $q.defer();

        if (this.isLoaded() && this.getCollection()) {
            this.getCollection().update(doc);
            this.db.saveDatabase();
            deferred.resolve(this.getCollection());
        } else {
            deferred.reject(new Error('DB NOT READY'));
        }

        return deferred.promise;
    };

    this.getDocs = function () {
        return (this.getCollection()) ? this.getCollection().data : null;
    };

    this.removeDoc = function (doc) {
        var deferred = $q.defer();

        if (this.isLoaded() && this.getCollection()) {
            this.getCollection().remove(doc);
            this.db.saveDatabase();
            deferred.resolve(this.getCollection());
        } else {
            deferred.reject(new Error('DB NOT READY'));
        }

        return deferred.promise;
    };

}]);
