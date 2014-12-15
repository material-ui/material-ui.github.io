var app = angular.module('app', [
    'app.controller',

    'material-ui',
    'ngTouch',
    'ngAnimate',
    'ui.router'
]);
app.run([ '$rootScope', '$state', '$stateParams','$window',
    function ($rootScope, $state, $stateParams,$window) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $locationProvider) {
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            $urlRouterProvider
                .otherwise('/app/welcome');
            $stateProvider
                .state("app", {
                    title: 'Home',
                    url: "/app",
                    abstract:true,
                    templateUrl: 'app/app.html'
                }) .state("app.welcome", {
                    title: 'MaterialUI',
                    url: "/welcome",
                    templateUrl: 'app/welcome.html'
                }).state("app.button", {
                    title: 'Button',
                    url: "/button",
                    templateUrl: 'app/button/button.html'
                }).state("app.input", {
                    title: 'Input',
                    url: "/input",
                    templateUrl: 'app/input/input.html'
                }).state("app.checkbox", {
                    title: 'Checkbox',
                    url: "/checkbox",
                    templateUrl: 'app/checkbox/checkbox.html'
                }).state("app.radio", {
                    title: 'Radio',
                    url: "/radio",
                    templateUrl: 'app/radio/radio.html'
                }).state("app.tab", {
                    title: 'Tab',
                    url: "/tab",
                    templateUrl: 'app/tab/tab.html'
                }).state("app.dialog", {
                    title: 'Dialog',
                    url: "/dialog",
                    templateUrl: 'app/dialog/dialog.html'
                }).state("app.actionbar", {
                    title: 'ActionBar',
                    url: "/actionbar",
                    templateUrl: 'app/actionbar/actionbar.html'
                }).state("app.dropdownmenu", {
                    title: 'DropdownMenu',
                    url: "/dropdownmenu",
                    templateUrl: 'app/dropmenu/dropmenu.html'
                }).state("app.togglebutton", {
                    title: 'ToggleButton',
                    url: "/togglebutton",
                    templateUrl: 'app/togglebutton/togglebutton.html'
                })
                .state("app.icon", {
                    title: 'Icon',
                    url: "/icon",
                    template:"<div ui-view></div>",
                    abstract:true
                }).state("app.icon.action", {
                    title: 'Action Icon',
                    url: "/action",
                    templateUrl: 'app/icon/action.html'
                 })
                    .state("app.icon.alert", {
                        title: 'Alert Icon',
                        url: "/alert",
                        templateUrl: 'app/icon/alert.html'
                    }).state("app.icon.av", {
                        title: 'AV Icon',
                        url: "/av",
                        templateUrl: 'app/icon/av.html'
                    }).state("app.icon.communication", {
                        title: 'Communication Icon',
                        url: "/communication",
                        templateUrl: 'app/icon/communication.html'
                    }).state("app.icon.content", {
                        title: 'Content Icon',
                        url: "/content",
                        templateUrl: 'app/icon/content.html'
                    }).state("app.icon.device", {
                        title: 'Device Icon',
                        url: "/device",
                        templateUrl: 'app/icon/device.html'
                    }).state("app.icon.editor", {
                        title: 'Editor Icon',
                        url: "/editor",
                        templateUrl: 'app/icon/editor.html'
                    }).state("app.icon.file", {
                        title: 'File Icon',
                        url: "/file",
                        templateUrl: 'app/icon/file.html'
                    }).state("app.icon.hardware", {
                        title: 'Hardware Icon',
                        url: "/hardware",
                        templateUrl: 'app/icon/hardware.html'
                    }).state("app.icon.image", {
                        title: 'Image Icon',
                        url: "/image",
                        templateUrl: 'app/icon/image.html'
                    }).state("app.icon.maps", {
                        title: 'Maps Icon',
                        url: "/maps",
                        templateUrl: 'app/icon/maps.html'
                    }).state("app.icon.navigation", {
                        title: 'Navigation Icon',
                        url: "/navigation",
                        templateUrl: 'app/icon/navigation.html'
                    }).state("app.icon.notification", {
                        title: 'Notification Icon',
                        url: "/notification",
                        templateUrl: 'app/icon/social.html'
                    }).state("app.icon.social", {
                        title: 'social Icon',
                        url: "/Social",
                        templateUrl: 'app/icon/social.html'
                    }).state("app.icon.toggle", {
                        title: 'Toggle Icon',
                        url: "/toggle",
                        templateUrl: 'app/icon/toggle.html'
                    })
        }
    ]
);
