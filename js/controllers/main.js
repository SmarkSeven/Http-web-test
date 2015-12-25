angular.module("controllers.main",[])
.controller("Main",function(
	$scope,
	$rootScope,
	$init,
	$state,
	$test,
	$sce,
	md5,
	FileUploader
){
	var type = $state.params.type;
	console.log("$state",$state);
	var hash = decodeURIComponent(location.hash.split("#")[1]);
	$scope.uploaderHash = {};//记录所有uploader的hash表
	$scope.apiList = [];
	$scope.currentApi = {api:{}};
	$init.getApi(type,function(err,result){
		if(result && typeof result == 'object'){
			var iterateApi = function(api,indent,parentUrl){ //indent 缩进的倍数 indent * 50px;
				if(!api)return;
				var apiJson = {};
				apiJson.title = api.title || "";
				apiJson.uri = api.uri || "";
				apiJson.apis = api.apis || [];
				//重新拼接接口的url
				apiJson.apis.forEach(function(apiItem){
					if(!apiItem.absolute){
						apiItem.uri = parentUrl + apiJson.uri + apiItem.uri;
					}
				});
				apiJson.indent = indent;
				$scope.apiList.push(apiJson);
				var sub = api.sub;
				if(sub && sub.length){
					var indent2 = indent + 1;
					for(var index in sub){
						iterateApi(sub[index],indent2,parentUrl + apiJson.uri);
					}
				}
			}
			var parentUrl = "";
			for(var index in $rootScope.headerList){
				var url = $rootScope.headerList[index].url;
				if(url == ("/" + type)){
					parentUrl = $rootScope.headerList[index].uri || "";
					break;
				}
			}
			for(var index in result){
				iterateApi(result[index],0,parentUrl);
			}
		}
		console.log("apiList",$scope.apiList);
	})
	$scope.setCurrentApi = function(api,alias){
		if(alias == 'title'){
			var apis = api.apis;
			if(apis && apis[0]){
				$scope.currentApi.api = apis[0];
			}else{
				var sub = api.sub;
				if(sub && sub[0]){
					apis = sub[0].api;
					if(apis && apis[0]){
						$scope.currentApi.api = apis[0];
					}
				}
			}
		}else{
			$scope.currentApi.api = api;
		}
	}
	$scope.test = function(_api){
		var api = angular.copy(_api);
		//如果接口是上传文件
		if(api.method == "FILE-UPLOAD"){
			var uploader = $scope.uploaderHash[api.hash];
			uploader.uploadAll();
		}else{
			$test.api(api);
		}
		
	}
	$scope.popoverContent = function(data){
		var htmlStr = "<table class='table paramsTable'><thead>$$THEAD$$</thead><tbody>$$CONTENT$$</tbody></table>"
		var thead = "<th>字段</th><th>类型</th><th>说明</th>"
		htmlStr = htmlStr.replace("$$THEAD$$",thead);
		if(data && data.constructor == Array && data.length){
			var content = "";
			data.forEach(function(item){
				var rowContent = "<tr><td>$$NAME$$</td><td>$$TYPE$$</td><td>$$DESC$$</td></tr>";
				var itemArr = item.split(" | ");
				rowContent = rowContent.replace("$$NAME$$",itemArr[0] || "");
				rowContent = rowContent.replace('$$TYPE$$',itemArr[1] || "");
				rowContent = rowContent.replace('$$DESC$$',itemArr[2] || "");
				content += rowContent;
			})
			htmlStr = htmlStr.replace("$$CONTENT$$",content);
			return htmlStr;
		}else{
			return "";
		}
	}
	$scope.trustAsHtml = function(value){
    	return $sce.trustAsHtml(value);
    }
    $scope.getUploader = function(api){
    	var hash = md5.createHash(api.title);//对api的title进行md5计算，用来唯一标识method=FILE-UPLOAD的接口
    	api.hash = hash;
    	var qiniuUploader = new FileUploader({
	        url: api.uri
	    });
	    qiniuUploader.onBeforeUploadItem = function (item) {
		    item.formData = [api.testParams];
		};
	    $scope.uploaderHash[hash] = qiniuUploader;
	    return qiniuUploader;
    }
})