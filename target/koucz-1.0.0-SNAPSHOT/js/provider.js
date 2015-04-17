angular.module('starter.provider', [])

    .provider('couchbase', function () {
        var dbName,
            devUrl;
        function Couchbase($http) {
            var url,
                db,
                getConnectionString = function() {
                    return url + db + '/';
                };
            this.get = function (key) {
                return $http.get(getConnectionString() + key);
            };
            this.post = function (key, objectToPut) {
                return $http.post(getConnectionString() + key, objectToPut);
            };
            this.put = function (key, rev, objectToPut) {
                console.log("rev================ " + rev)
                if(rev) {
                	$http.defaults.headers.put = {
                			'Content-Type': "application/json"
              				,'If-Match': rev
// bitte noch nicht entfernen. Stichwort CORS (siehe wiki)
//                 'Origin': 'http://evil.com/'
//                 ,'Access-Control-Allow-Origin': '*'
//                 ,'Access-Control-Allow-Headers': 'accept, if-match, content-type'
//                 ,'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD'                        
//                 ,'Access-Control-Allow-Origin': '*',
//                 'Access-Control-Allow-Methods': 'PUT'
////               ,'Access-Control-Request-Headers': '*'                        
//                 ,'Access-Control-Allow-Headers': '*'
                	}
//                	$http.defaults.headers.common['If-Match'] = rev;                	
                } else {
                	$http.defaults.headers.put = {
                			'Content-Type': "application/json"
                    }
                }
                
                return $http.put(getConnectionString() + key, objectToPut);
            };
            this.delete = function (key) {
                return $http.delete(getConnectionString() + key);
            };
            this.getUrl = function () {
                return url;
            };
            this.setUrl = function (value) {
                url = value;
            };
            this.getDbName = function () {
                return url;
            };
            this.setDbName = function (value) {
                db = value;
            };
            this.createDb = function() {
                return $http.put(url + db);
            }
            this.getDbUrl = function() {
                return getConnectionString();
            }
            
        };

        this.setDevUrl = function(value) {
            devUrl = value;
        }

        this.setDbName = function(value) {
            dbName = value;
        };
        this.$get = ["$window", "$http", '$timeout', function ($window, $http, $timeout) {
            var couchbase = new Couchbase($http);

            $timeout(function() {
                if($window.cblite) {
                    $window.cblite.getURL(
                        function (err, url) {
                            if (err) {
                                couchbase.setUrl(err);
                            } else {
                                couchbase.setUrl(url);
                            }

                            couchbase.setDbName(dbName)
                            couchbase.createDb();
                        });
                } else {
                    couchbase.setUrl(devUrl);
                    couchbase.setDbName(dbName);
                    couchbase.createDb();
                }

            }, 1000);

            return couchbase;
        }];
    });
