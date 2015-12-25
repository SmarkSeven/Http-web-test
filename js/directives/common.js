angular.module("directives.main",[])
//根据不同的indent来决定使用什么级别的标题
.directive("hTitle",function(

){
	return {
		restrict: "E",
		template: "<h1>{{value.title}} {{value.uri}}</h1>",
		replace: true,
		link: function(scope,element,attr){
			var level = parseInt(attr.level,10) || 0;
			level += 1;
			element.replaceWith("<a href='#"+ encodeURI(attr.title) +"'><h" + level + " id='"+ encodeURI(attr.title) +"' class='apiTitle'><span class='tip'>" + level + "</span>" + attr.title + "</h" + level + "></a>")
		}
	}
})
.directive("showPopover",function(

){
	return {
		restrict: "A",
		link: function(scope,element,attr){
			$(element[0]).popover({
				placement: 'right',
				content: attr.content,
				html: true,
				trigger: 'click'
			})
		}
	}
})