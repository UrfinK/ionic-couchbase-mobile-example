var mod = angular.module('starter.controllers', []);

mod.controller('DashCtrl', function ($scope, couchbase, resultsFactory) {
        $scope.user = {
        };
        $scope.save = function () {
            console.log("$scope.user.name ===================== " + $scope.user.name);
            
            var prom = resultsFactory.all($scope.user.name, function(rev) {            	
            	couchbase.put($scope.user.name, rev, $scope.user);
            }
            );
//            prom.then(function (data) {
//	                $scope.data = data;
//	                $scope.prevRev = data._rev;
//	                console.log("prom data ===================== " +  data);   
//	                return data._rev;
//	            },
//	            function(data) {
//	            	console.log("prom data 1 ===================== " +  data);
//	            },
//	            function(data) {
//	            	console.log("prom data 2 ===================== " +  data);
//	            }
//            )
//            couchbase.put($scope.user.name, $scope.prevRev, $scope.user);
        }
	})
	.service('resultsFactory', function(couchbase, $http, $timeout, $q) { 
	    	var results = {};  
	    	function _all(key, callback){
	    			var d = $q.defer();
	    			var url = couchbase.getDbUrl();
	                $http.get(url + key).success(
	                        function (data) {
	                            console.log("data ===================== " + data);
	//                            $scope.prevRev = angular.fromJson(data);
	//                            console.log("callback $scope.prevRev ===================== " + $scope.prevRev);
	                            callback(data._rev);
	                            d.resolve(data);
	                        }
	                    )
	                    .error(
		                        function (data) {
		                            console.log("data ===================== " + data);
		                            var undef = undefined;
		                            callback(undef);
//		                            d.resolve(data);
		                        }	                    		
	                    );
	  
	    			return d.promise;       
	    	}
	  
	    	results.all = _all;
	    	return results;
	    })
    .controller('CarsCtrl', function ($scope, couchbase) {
        couchbase.get('_all_docs').success(
            function (data) {
                $scope.test = angular.fromJson(data);
            }
        );
    })

    .controller('CarDetailCtrl', function ($scope, $stateParams, couchbase) {
        couchbase.get($stateParams.carId).success(function (data) {
            $scope.user = angular.fromJson(data);
        });
    })

    .controller('SettingsCtrl', function ($scope, couchbase) {
        $scope.db = couchbase;
    });
