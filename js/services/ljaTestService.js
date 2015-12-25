angular.module("services.ljaTestService",[])
.service("$init",function(
	$http,
	$rootScope
){
	return {
		getHeader:function(callback){
			$http.get("./api/v" + $rootScope.v + "/header.json")
			.success(function(data){
				if(callback)callback(null,data);
			})
		},
		getApi:function(type,callback){
			$http.get("./api/v" + $rootScope.v + "/" + type + "_api.json")
			.success(function(data){
				if(callback)callback(null,data);
			})
		},
		getTemplate:function(type,callback){
			$http.get("./api/v" + $rootScope.v + "/" + type + "_api.html")
			.success(function(data){
				if(callback)callback(null,data);
			})
		}
	}
})
.service("$test",function(
	$http,
	$rootScope
){
	return {
		api:function(_api,callback){
			var api = angular.copy(_api);
			var method = api.method.toLowerCase();
			var testParams = api.testParams;
			var paramJson = {};
			var uri = api.uri;
			//检查url里是否有参数,如果有，就把testParams里对应的字段用来替换
			if(/\/:\S+/.test(uri) && testParams){
				for(var index in testParams){
					if(uri.match(":" + index)){
						uri = uri.replace(":" + index,testParams[index]);
						delete testParams[index];
					}
				}
			}
			if(method == 'post' || method == 'put'){
				paramJson = testParams;
			}else if(method == 'get'){
				paramJson["params"] = testParams;
			}
			if($http[method]){
				$http[method](uri,paramJson)
				.success(function(data){
					//如果接口需要把返回的数据缓存起来，则缓存到$rootScope
					if(api.saveData){
						$rootScope[api.uri] = data;
					}
				})
			}
		},

	}
})
