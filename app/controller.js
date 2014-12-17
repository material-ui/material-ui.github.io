/**
 * Created by chenshiqi on 2014/12/11.
 */
var controllers = angular.module('app.controller', []);
/**
 * 这个指令是为了显示所有svg图标用的,不是主要的指令,只是测试用
 */
controllers.directive('icon', function () {
    return {
        restrict: 'E',replace:true,
        scope: true,
        template: '<svg ng-style="{\'width\':width,\'height\':height,\'fill\':color}"   width="48" height="48" viewBox="0 0 48 48"><use xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{svg_link}}"></use></svg>',
        link: function (scope, $element, $attrs) {

            scope.color = $attrs["color"];
            if ($attrs["size"]) {
                var size = $attrs["size"].split(",");
                if (size.length != 2) {
                    console.error("[icon]无效的size属性,size属性格式必需为:size='width,height'");
                    return;
                }
                scope.width = size[0];
                scope.height = size[1];
            }
            scope.svg_link = "svg/svg-icons.svg#" + $attrs["name"];
        }
    }
});
controllers.controller("AppCtrl",function($scope){
    $scope.showNavigation=false;
});
/**
 * 对话框控制器
 */
controllers.controller("DialogCtrl",function($scope){
    /**
     * 对话框
     * @type {{showDialog: boolean}}
     */
    $scope.dialog={
        title:"Tips",
        show:false,
        buttons:[
            {text:"Confirm",icon:"ic-check",click:function(){
                console.info("Click:Confirm");
                $scope.dialog.show=false;
            }},
            {text:"Cancel",icon:"ic-close",click:function(){
                console.info("Click:Cancel");
                $scope.dialog.show=false;
            }}
        ]
    };
    $scope.open=function(){
        $scope.dialog.show=true;
    };

});
controllers.controller("DropdownMenuCtrl",function($scope){
    $scope.category={id:1,name:"Java"};
    $scope.list=[
        {id:1,name:"Java"},
        {id:2,name:"C++"},
        {id:3,name:"PHP"},
        {id:4,name:".Net"},
        {id:5,name:"Ruby"},
        {id:6,name:"Nodejs"}
    ];
    $scope.users=[];

});
controllers.controller("CheckboxCtrl",function($scope){
    $scope.arr=[false,false,false];
});

