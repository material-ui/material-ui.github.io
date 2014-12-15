/**
 * Created by chenshiqi on 2014/12/11.
 */
var controllers = angular.module('app.controller', []);

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

