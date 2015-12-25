angular.module("controllers.appCtrl",[])
.controller("AppCtrl",function(
	$scope,
	$init,
	$state,
	$rootScope
){
	$rootScope.v = $state.params.v;

	$init.getHeader(function(err,result){
		if(result){
			$rootScope.headerList = result;
		}else{
			$rootScope.headerList = [];
		}
	});
})