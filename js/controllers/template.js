angular.module("controllers.template",[])
.controller("Template",function(
	$scope,
	$state,
	$init,
	$sce
){
	var type = $state.params.type;
	$init.getTemplate(type,function(err,data){
		$scope.template = $sce.trustAsHtml(data);
	})
})