/*
 Copyright 2014 Chen xiaowei (github:https://github.com/blackderby)

 Version: 0.0.1 Timestamp: Tue Jul 22 18:58:56 EDT 2014

 This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
 General Public License version 2 (the "GPL License"). You may choose either license to govern your
 use of this software only upon the condition that you accept all of the terms of either the Apache
 License or the GPL License.

 You may obtain a copy of the Apache License and the GPL License at:

 http://www.apache.org/licenses/LICENSE-2.0
 http://www.gnu.org/licenses/gpl-2.0.html

 Unless required by applicable law or agreed to in writing, software distributed under the Apache License
 or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the Apache License and the GPL License for the specific language governing
 permissions and limitations under the Apache License and the GPL License.
 */
console.log("%cWelcome to MaterialUI!\n%cBase on AngularJs & Bootstrap.by 陈晓伟 xiaowei_8868@126.com",
    "font-size:1.5em;color:#4558c9;", "color:#d61a7f;font-size:1em;");
/**
 * 名称:material-ui指令模块
 * 说明:基于angularjs的指令功能,实现material-design风格的界面.并基于可复用的目标,对每个指令进行封装,尽可能减少对其它css
 *      或js的依赖.
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
var directives = angular.module('material-ui', []);
/**
 * 圆角矩形服务类
 */
directives.factory("$clip", function () {
    var reg_width = new RegExp("#width", "gmi");
    var reg_height = new RegExp("#height", "gmi");
    var reg_x = new RegExp("#x", "gmi");
    var reg_y = new RegExp("#y", "gmi");
    var reg_radius = new RegExp("#radius", "gmi");
    var tpl = "polygon(#radius 0, #x 0px, #width #radius, #width #y, #x #height, #radius #height, 0px #y, 0 #radius)";
    return {
        /**
         * 根据宽高,创建圆角矩形css参数
         * @param width 目标宽度(number)
         * @param height 目标高度(number)
         * @param radius 圆角大小(number)
         * @returns {string} clip-path的polygon值
         */
        rectangle: function (width, height, radius) {

            var x = width - radius;
            var y = height - radius;
            var polygon = tpl
                .replace(reg_width, width + "px")
                .replace(reg_height, height + "px")
                .replace(reg_x, x + "px")
                .replace(reg_y, y + "px")
                .replace(reg_radius, radius + "px");
            return polygon;
        }
    };
});
directives.directive('touchStart', ["$parse", "$swipe", function ($parse, $swipe) {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            var model = $parse($attrs["touchStart"]);
            $swipe.bind($element, {
                start: function () {
                    model($scope);
                    $scope.$apply();
                }
            })
        }
    }
}]);
directives.directive('touchEnd', ["$parse", "$swipe", function ($parse, $swipe) {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            var model = $parse($attrs["touchEnd"]);
            $swipe.bind($element, {
                end: function () {
                    model($scope);
                    $scope.$apply();
                }
            })
        }
    }
}]);

/**
 * 名称:material-ui的触摸效果指令
 * 功能:实现触摸效果
 * 使用: <div style='width:100%;height:48px' class="touchable">点我</div>
 * 说明:
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('touchable', ["$swipe", function ($swipe) {
    return {
        restrict: "C",
        link: function ($scope, $element, $attrs) {

            var $parent = $element.parent();
            var parentWidth = $parent.width()
            var parentHeight = $parent.height();
            //TODO
            var size = Math.max(parentWidth, parentHeight);
            $parent.css("position", "relative");
            $element.css("width", size + 'px');
            $element.css("height", size + 'px');
            var centerPos = "circle(" + size + " at " + size / 2 + "px " + size / 2 + "px)";
            $parent.css("-webkit-clip-path", centerPos)
                .css("clip-path", centerPos);
            $swipe.bind($parent, {
                start: function () {
                    $element.removeClass("touchstart");
                    $element.removeClass("touchend");
                    $element.addClass("touchstart");
                },
                end: function () {
                    $element.removeClass("touchstart");
                    $element.removeClass("touchend");
                    $element.addClass("touchend");
                }
            });
        }
    }
}]);

/**
 * 名称:material-ui的涟漪效果指令
 * 功能:实现涟漪效果(material ripple effect),
 * 使用: <div style='width:100%;height:48px'><i class='ripple'></i></div>
 * 说明:一般情况下不会主动使用该指令,因为对指令所有的父元素样式有要求.请考虑使用material指令
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('ripple', ["$compile", "$swipe", function ($compile, $swipe) {
    return {
        restrict: "C",
        link: function ($scope, $element, $attrs) {
            var $parent = $element.parent();
            var parentWidth = $parent.width()
            var parentHeight = $parent.height();
            /**取父元素的宽高最大值**/
            var size = Math.max(parentWidth, parentHeight);
            $parent.css("position", "relative");
            /**把父元素大小放大2倍,作为指令元素的宽和高**/
            $element.css("width", size * 2 + 'px');
            $element.css("height", size * 2 + 'px');
            /**
             * 给父元素绑定事件,
             * 一般来说,移动web只需要绑定touchstart事件即可,但为了方便PC测试,这里也增加绑定了鼠标的事件
             */

            $swipe.bind($parent, {
                start: function (coords, event) {
                    $element.removeClass("animate");
                    var eventType = event.type;
                    var x , y;
                    if (eventType == 'mousedown') {
                        x = event.pageX;
                        y = event.pageY;
                    } else if (eventType == 'touchstart') {
                        var touches = event["originalEvent"].changedTouches[0];
                        x = touches.pageX;
                        y = touches.pageY;
                    }
                    /**计算出动画开始点**/
                    x = x - $parent.offset().left - $element.width() / 2;
                    y = y - $parent.offset().top - $element.height() / 2;
                    $element.css("top", y + 'px');
                    $element.css("left", x + 'px');
                    $element.addClass("animate");
                }
            });

        }
    }
}]);
/**
 * 名称:material-ui的基本指令
 * 功能:给指令的元素增加点击后的涟漪效果
 * 使用:<div class="user-icon" material></div>
 * 说明:如果需要给元素增加涟漪效果,只需要给元素增加material属性即可
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('material', function () {
    return {
        restrict: 'A', compile: function ($element, attrs) {
            $element.prepend("<i class='ripple'></i>");
            return function (scope, el, attrs) {
            }
        }
    };
});
/**
 * 名称:jquery toggle class 的指令
 * 功能:实现jquery的toggleclass的功能
 * 使用:
 * 说明:如果需要给元素增加涟漪效果,只需要给元素增加material属性即可
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiToggleClass', ['$swipe', function ($swipe) {
    return {
        restrict: 'A', link: function (scope, element, attr) {
            var target = attr["target"];
            if (target) {
                target = angular.element(target)
            } else {
                target = element;
            }
            var toggleClass = attr["uiToggleClass"];
            $swipe.bind(element, {
                end: function () {
                    if (target.hasClass(toggleClass)) {
                        target.removeClass(toggleClass);
                    } else {
                        target.addClass(toggleClass);
                    }
                }
            });
        }
    };
}]);

/**
 * 名称:图标 指令
 * 功能:根据图标代码,显示图片
 * 使用: <ui-icon width="32px" height="32px" color="red" name="ic-user"></ui-icon>
 * 说明:width:图标宽度,height:图标高度,color:图标姿色,name:图标代码.图标代码参照[图标集]
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiIcon', function () {
    return {
        restrict: 'E',replace:true,
        scope: true,
        template: '<svg ng-style="{\'width\':width,\'height\':height,\'fill\':color}"  width="48" height="48" viewBox="0 0 48 48"><use xlink:href="{{svg_link}}"></use></svg>',
        link: function (scope, $element, $attrs) {

            scope.color = $attrs["color"];
            if ($attrs["size"]) {
                var size = $attrs["size"].split(",");
                if (size.length != 2) {
                    console.error("[ui-icon]无效的size属性,size属性格式必需为:size='width,height'");
                    return;
                }
                scope.width = size[0];
                scope.height = size[1];
            }
            scope.svg_link = "svg/" + $attrs["file"] + ".svg#" + $attrs["name"];
        }
    }
});
/**
 * 名称:普通按钮 指令
 * 功能:实现按钮功能,替代系统的<button>
 * 使用: <ui-button ng-click="clickMe()">Button</ui-button>
 * @param class{string} 按钮附加样式类 可选
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiButton', ["$clip", function ($clip) {
    return {
        restrict: "E",
        template: '<button material  class="ui-button"><span ng-transclude></span></button>',
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) {
            if ($attrs["class"]) {
                $element.addClass($attrs["class"]);
            }
            var width = parseInt($element.css("width"));
            var height = parseInt($element.css("height"));
            var rectangle = $clip.rectangle(width, height, 2);
            $element.css("-webkit-clip-path", rectangle)
                .css("clip-path", rectangle);
        }
    }
}]);
/**
 * 名称:扁平按钮 指令
 * 功能:实现扁平按钮,替代系统的<button>
 * 使用: <ui-flat-button ng-click="clickMe()">Raised Button</ui-flat-button>
 * 说明:
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiFlatButton', ["$clip", function ($clip) {
    return {
        restrict: "E",
        template: '<div material class="ui-flat-button"><div ng-transclude></div></div>',
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) {
            var width = parseInt($element.css("width"));
            var height = parseInt($element.css("height"));
            var rectangle = $clip.rectangle(width, height, 2);
            $element.css("-webkit-clip-path", rectangle)
                .css("clip-path", rectangle);
        }
    }
}]);


/**
 * 名称:凸起按钮 指令
 * 功能:实现凸起按钮,替代系统的<button>
 * 使用: <ui-raised-button class="bg-success">Raised Button</ui-raised-button>
 * 说明:通过指令的class属性指令按钮附加样式
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiRaisedButton', ["$clip", function ($clip) {
    return {
        restrict: "E",
        template: '<button material raised class="ui-raised-button"><span ng-transclude></span></button>',
        replace: true,
        transclude: true

    }
}]);

/**
 * 名称:圆形按钮 指令
 * 功能:实现圆形按钮
 * 使用: <ui-round-button radius="48px" ng-click="clickMe()">Home</ui-round-button>
 * 说明:通过指令的radius属性指令按钮大小
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiRoundButton', function () {
    return {
        restrict: "E",
        template: '<div class="ui-round-button"><button material ><span ng-transclude></span></button></div>',
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) {
            var button = $element.find("[material]").first();
            var width = parseInt($attrs.radius);
            var centerPos = "circle(" + $attrs.radius + " at " + width / 2 + "px " + width / 2 + "px)";
            button.css("width", $attrs.radius)
                .css("height", $attrs.radius)
                .css("-webkit-clip-path", centerPos)
                .css("clip-path", centerPos);
            $element.css("width", $attrs.radius)
                .css("height", $attrs.radius);
            button.find(".ripple").css("background-color", $attrs.rippleColor);
        }
    }
});
/**
 * 名称:图标按钮 指令
 * 功能:实现带图标按钮
 * 使用: <ui-icon-button icon="nav-menu" ng-click="clickMe()"></ui-icon-button>
 * 说明:按钮的图标是通过指令的icon属性指定,并通过svg格式显示,各个图片的代码请参考[图标集]
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiIconButton', function () {
    return {
        restrict: 'E',
        template:'<div class="icon-button"><i class="touchable"></i><a  class="button"><svg ><use xlink:href="{{svg_icon}}"></use></svg></a></div>',
        compile: function ($element, $attrs) {
            $element.find("use").attr("xlink:href","svg/" + $attrs["file"] + ".svg#" + $attrs["icon"]);
        }
    };

});
/**
 * 名称:多选框指令
 * 功能:提供checkbox的多选功能,添加了CSS3动画效果,可以替代系统的checkbox工作
 * 使用:<ui-checkbox ng-model="agree">我同意以上条款</ui-checkbox>
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiCheckbox", ["$parse", "$swipe", function ($parse, $swipe) {
    var html = "";
    html += '<div class="ui-checkbox" touch-end="model=!model"><span class="box-panel"> <i class="touchable"></i><span class="box" ng-class="{true:\'on\',false:\'off\',undefined:\'off\'}[model]">';
    html += '<ui-icon class="unchecked" name="ic-check-box-outline-blank" file="toggle"></ui-icon>';
    html += '<ui-icon class="checked" name="ic-check" file="navigation"></ui-icon></span></span><span class="checkbox-label"  ng-transclude></span></div>';
    return {
        restrict: "E",
        template: html,
        replace: true,
        transclude: true,
        scope: {
            model: "=ngModel"
        }
    }
}]);
/**
 * 名称:单选框指令
 * 功能:提供radio的单选功能,添加了CSS3动画效果,可以替代系统的radio工作
 * 使用:<ui-radio ng-model="agree" value="1">同意</ui-radio><ui-radio ng-model="reject" value="0">拒绝</ui-radio>
 * 说明:ng-model绑定$scope中的值,value指令radio的选项值
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiRadio", ["$parse", "$swipe", function ($parse, $swipe) {

    return {
        restrict: "E",
        template: '<div class="ui-radio" touch-end="model=value"><span class="box-panel"><i class="touchable"></i>' +
        '<span class="box" ng-class="{true:\'on\',false:\'off\'}[model==value]"><i class="outer"></i><i class="inner" ng-style="{background:color}"></i></span></span><span class="radio-label" ng-transclude></span></div>',
        replace: true,
        scope: {
            model: "=ngModel",
            color: "=color",
            value: "=value"
        },
        transclude: true

    }
}]);
/**
 *
 */
directives.directive("uiToggleButton", ["$parse", "$swipe", function ($parse, $swipe) {
    var html = '<div class="ui-toggle-button" ng-class="{active:hasChecked}"  touch-end="hasChecked=!hasChecked"><i class="line"></i>' +
        '<div class="radio-panel">' +
        '<div class="ui-radio" > ' +
        '<span class="box-panel"> <i class="touchable"></i>' +
        '<span class="box" ng-class="{true:\'on\',false:\'off\'}[hasChecked]"> <i class="outer"></i><i class="inner" ng-style="{background:color}"></i> </span> ' +
        '</span></div> </div> </div>'
    return {
        restrict: "E",
        template: html,
        replace: true,
        scope: {
            hasChecked: "=ngModel",
            color: "=color"
        }
    }
}]);
/**
 * 输入框指令
 */
directives.directive("uiInput", function ($parse) {
    return {
        restrict: "E",
        template: '<div class="ui-input" ng-class="{hasVal:model!=null,focus:model!=null}"><span class="placeholder">{{placeholder}}</span><input type="{{type}}" ng-model="model" ng-blur="blur()" ng-focus="focus()"/> <i class="line"></i></div>',
        replace: true,
        scope: {
            model: "=ngModel",
            placeholder: "@placeholder",
            type: "@type"
        },
        link: function (scope, $element, $attrs) {
            scope.focus = function () {
                if (scope.model && scope.model.length > 0) {
                    $element.removeClass("hasVal");
                }
                $element.addClass("focus").removeClass("blur");
            };
            scope.blur = function () {
                if (scope.model == "" || !scope.model) {
                    $element.addClass("blur").removeClass("focus");
                } else {
                    $element.addClass("hasVal");
                }
            };
        }
    }
});
/**
 * 选项卡指令
 */
directives.directive("uiTabSet", ["$swipe", function ($swipe) {
    return {
        restrict: "E",
        template: '<div class="ui-tab-set" ><ul class="tabs" ><li class="tab" material ng-repeat="th in tabHeaders" touch-end="selectTab($index)"><span>{{th}}</span></li></ul>' +
        '<span class="selectionBar" ng-style="{transform:selection_bar_left,\'-webkit-transform\':selection_bar_left}"></span>' +
        '<div class="content-panel" ng-transclude ng-style="{width:(winWidth*tabHeaders.length)+\'px\',transform:panel_left,\'-webkit-transform\':panel_left}"></div></div>',
        transclude: true,
        replace: true,
        $scope: true,
        require: "uiTabSet",
        controller: function ($scope) {
            $scope.tabHeaders = [];
            this.addHeader = function (name) {
                $scope.tabHeaders.push(name);
            };
            this.getTabCount = function () {
                return $scope.tabHeaders.length;
            };
        },
        link: function (scope, element, attrs, ctrl) {
            scope.winWidth = element.width();
            console.info(scope.winWidth);
            scope.panel_left = "0";
            scope.selection_bar_left = "0";
            scope.selectTab = function (index) {
                scope.panel_left = "translateX(" + (scope.winWidth * index * -1) + "px)";
                scope.selection_bar_left = "translateX(" + scope.winWidth / 3 * index + "px)";
            };
            var panel = element.find(".content-panel");
            var count = ctrl.getTabCount();
            var index = 0;
            var start_pos = {x: 0, y: 0};
            var minLeft = (count - 1) * scope.winWidth * -1;
            var left = 0;
            $swipe.bind(panel, {
                start: function (pos, event) {
                    start_pos = pos;
                    left = panel.offset().left;
                    //在拖动开始的时候,要把transition属性去掉,不然会影响拖动效果
                    panel.css("transition", "none").css("-webkit-transition", "none");
                },
                end: function (cur) {
                    var m = cur.x - start_pos.x;
                    if (m < -50) {
                        index = index < count - 1 ? index + 1 : index;
                    }
                    if (m > 50) {
                        index = index > 0 ? index - 1 : index;
                    }
                    //拖动结束后,再添加transition属性,
                    panel.css("transition", "all 0.3s").css("-webkit-transition", "all 0.3s");
                    scope.selectTab(index);
                    scope.$apply();
                },
                move: function (cur) {
                    var newLeft = left + (cur.x - start_pos.x);
                    if (newLeft > 0) {
                        newLeft = 0;
                    }
                    if (newLeft < minLeft) {
                        newLeft = minLeft;
                    }
                    scope.panel_left = "translateX(" + newLeft + "px)";
                    scope.$apply();
                }
            });
        }
    }
}]);
/**
 * 单个选项卡,该指令依赖uiTabSet
 */
directives.directive("uiTab", function () {
    return {
        restrict: "E",
        require: "^uiTabSet",
        transclude: true,
        replace: true,
        template: "<div class='tab-content' ng-transclude></div>",
        link: function (scope, element, attrs, uiTabSet) {
            uiTabSet.addHeader(attrs["heading"])
        }
    }
});

/**
 * 对话框指令
 */
directives.directive("uiDialog", ["$compile", "$swipe", "$parse", function ($compile, $swipe, $parse) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            dialog: "=ngModel"
        },
        template: '<div class="ui-dialog" ng-class="{active:dialog.show}"><div class="overlay" touch-end="dialog.show=false"></div> <div class="dialog" > <h1 class="title">{{dialog.title}}</h1> <div class="content" ng-transclude></div>' +
        '<div class="actions"><ui-flat-button ng-repeat="btn in dialog.buttons" touch-end="btn.click()"><ui-icon name="{{btn.icon}}" ng-if="btn.icon" file="navigation"  size="18px,18px"  color="#999"></ui-icon>{{btn.text}}</ui-flat-button></div></div></div>',

    };
}]);
/**
 * 抽屉导航指令
 */
directives.directive("uiNavigation", ["$swipe", "$parse", function ($swipe, $parse) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            active: "=active"
        },
        template: '<div class="ui-navigation" ng-class="{\'active\':active}"><div class="overlay" touch-end="active=false"></div><div class="content" ng-transclude></div></div>',
        link: function (scope, element, attrs) {

            //给导航父元素绑定划屏事件
            var parent = element.parent();
            var fromX = 0;
            $swipe.bind(parent, {
                start: function (pos) {
                    fromX = pos.x;
                },
                move: function (pos) {
                    //如果是从最左边(x小于10)开始划动就认为是要打开
                    if ((pos.x - fromX > 5) && fromX < 10) {
                        scope.active = true;
                        scope.$apply();
                    }
                }
            });
            var x = 0;
            $swipe.bind(element.find(".content"), {
                start: function (pos) {
                    x = pos.x;
                },
                move: function (pos) {
                    if (pos.x - x < -80) {
                        scope.active = false;
                        scope.$apply();
                    }
                }
            });
            scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                event.targetScope.$watch('$viewContentLoaded', function () {
                    scope.active = false;
                })
            });
        }
    };
}]);
/**
 * 顶部滚动ActionBar指令
 */
directives.directive("uiScrollHeader", function () {

    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        replace: true,
        template: '<div class="ui-scroll-header"><div class="wrapper"  ng-transclude=""></div></div>',
        link: function (scope, $element, $attrs) {
            var $wrapper = $element.find(".wrapper");
            var $header =angular.element('<div class="header"><div class="bg"></div></div>');
            var $bg=$header.find(".bg");
            if ($attrs["backgroundImage"]) {
                $bg.css("background-image", "url('" + $attrs["backgroundImage"] + "')")
            }
            if ($attrs["backgroundColor"]) {
                $header.css("background-color", $attrs["backgroundColor"]);
            }
            var $actionbar = $wrapper.find(".action-bar");
            $wrapper.prepend($header);
            $wrapper.bind("scroll",function (pa) {
                var scrollTop = $wrapper.scrollTop();
                var alpha = scrollTop / 100;
                alpha = alpha > 1 ? 0.99 : alpha;
                $bg.css("opacity", 1 - alpha);
                if (scrollTop > 100) {
                    $actionbar.css("background-color", $attrs["backgroundColor"]);
                } else {
                    $actionbar.css("background-color", "transparent");
                }
                $header.css("transform", "translate3d(0px, " + (scrollTop * -1) + "px, 0px)");
            });
        }
    };
});
directives.directive("uiDropdown", ["$swipe", "$parse", function ($swipe, $parse) {
    var UI_OPTIONS_REG = /^([\S]+)\sfor\s+([\S]+)\sin\s([\S]+)$/;
    return {
        restrict: 'E',
        template: "<ul class='ui-dropdown'><li ng-repeat='item in items' ng-click='selectItem($index)' material=''>{{item}}</li></ul>",
        replace: true,
        require: "ngModel",

        link: function ($scope, $element, $attrs, ngModel) {
           var exp=$attrs["uiOptions"];
            var match = exp.match(UI_OPTIONS_REG);

            if (match && match.length == 4) {
                var key = match[1];
                if (key.indexOf(".") > 0) {
                    key = key.split(".")[1];
                }
                var options = $parse(match[3])($scope);
                $scope.selectItem = function (index) {
                    ngModel.$setViewValue(options[index]);
                };
                $scope.items = [];
                for (var i = 0; i < options.length; i++) {
                    $scope.items.push(options[i][key]);
                }

            }
        }
    }

}]);
/**
 * @param ng-model(required)
 * @param ui-options (required)
 *
 */
directives.directive("uiDropdownMenu", ["$swipe", "$parse", "$document", function ($swipe, $parse, $document) {
    var UI_OPTIONS_REG = /^([\S]+)\sfor\s+([\S]+)\sin\s([\S]+)$/;
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="ui-dropdown-menu" ui-toggle-class="active" ><span touch-end="bindDocumentClickEvent()">{{menuText}}</span><i class="arrow"></i>' +
        '<ui-dropdown ng-model="model" ui-options="{{uiOptions}}"></ui-dropdown></div>',
        compile:function(element,attrs){
          var dropdown=element.find("ui-dropdown");
            dropdown.attr("ui-options",attrs["uiOptions"]);
            /**
             * link function
             */
            return function ($scope, $element, $attrs) {
                var model = $parse($attrs["ngModel"]);
                $scope.uiOptions=$attrs["uiOptions"];
                var match = $scope.uiOptions.match(UI_OPTIONS_REG);
                var key = "";
                if (match && match.length == 4) {
                    key = match[1];
                    if (key.indexOf(".") > 0) {
                        key = key.split(".")[1];
                    }
                    $scope.key = key;
                }
                $scope.$watch(model, function () {
                    var val = model($scope);
                    if (val) {
                        $scope.menuText = val[key];
                    }
                });
                /**
                 * 给document绑定点击事件.如果下拉框已经打开,用户没有点击下拉框,而点击了页面的其它位置,通过给document绑定事件
                 * 来关闭下拉框
                 */
                $scope.bindDocumentClickEvent = function () {
                    $document.bind("click", closeDropdown)
                };
                /**
                 * 关闭下拉框,并解除document的点击事件
                 * @param evt
                 */
                function closeDropdown(evt) {
                    if (evt && $element.get(0).contains(evt.target)) {
                        return;
                    }
                    $element.removeClass("active");
                    $document.unbind("click", closeDropdown)
                }

            }
        }
    };
}]);
