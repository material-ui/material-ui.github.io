
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
    return{
        restrict: "C",
        link: function ($scope, $element, $attrs) {
            var $parent = $element.parent();

            var parentWidth = $parent.width()
            var parentHeight = $parent.height();
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
    return{
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
    return{restrict: 'A', compile: function ($element, attrs) {
        $element.prepend("<i class='ripple'></i>");
        return function (scope, el, attrs) {
        }
    }};
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
    return {restrict: 'AC', link: function (scope, element, attr) {
        var ts = 0;
        $swipe.bind(element, {
            end: function (pos, event) {

                if (event.timeStamp - ts < 500) {
                    return;
                }
                ts = event.timeStamp;
                var classes = attr.uiToggleClass.split(','),
                    targets = (attr.target && attr.target.split(',')) || Array(el),
                    key = 0;
                angular.forEach(classes, function (_class) {
                    var target = targets[(targets.length && key)];
                    (_class.indexOf('*') !== -1) && magic(_class, target);
                    $(target).toggleClass(_class);
                    key++;
                });
                element.toggleClass('active');
                function magic(_class, target) {
                    var patt = new RegExp('\\s' + _class.
                        replace(/\*/g, '[A-Za-z0-9-_]+').
                        split(' ').
                        join('\\s|\\s') + '\\s', 'g');
                    var cn = ' ' + $(target)[0].className + ' ';
                    while (patt.test(cn)) {
                        cn = cn.replace(patt, ' ');
                    }
                    $(target)[0].className = $.trim(cn);
                }
            }
        });
    }};
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
    return{
        restrict: 'E',
        compile: function ($element, $attrs) {
            var style = "";
            var file = "svg-icons";
            if ($attrs["size"]) {
                var size = $attrs["size"].split(",");
                style += ";width:" + size[0];
                style += ";height:" + size[1];
            }
            if ($attrs["color"]) {
                style += ";fill:" + $attrs["color"];
            }
            if ($attrs["file"]) {
                file = $attrs["file"];
            }
            $element.html("<svg style='" + style + "'  width='48' height='48' viewBox='0 0 48 48'><use xlink:href='svg/" + file + ".svg#" + $attrs["name"] + "'></use></svg>");
        }
    };

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
            console.info(rectangle);
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
        transclude: true,
        link: function ($scope, $element, $attrs) {
            if ($attrs["class"]) {
                $element.addClass($attrs["class"]);
            }
        }
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
    return{restrict: 'E', compile: function ($element, $attrs) {
        var icon = "<svg ><use xlink:href='css/svg-icons.svg#" + $attrs["icon"] + "'></use></svg>";
        $element.html('<div class="icon-button"><i class="touchable"></i><a  class="button">' + icon + '</a></div>');
        return function ($scope, $element, $attrs) {
            var button = $element.find(".button").first();
            var width = parseInt($attrs.radius);
            var centerPos = "circle(" + $attrs.radius + " at " + width / 2 + "px " + width / 2 + "px)";
            button.css("width", $attrs.radius)
                .css("height", $attrs.radius)
                .css("-webkit-clip-path", centerPos)
                .css("clip-path", centerPos);
            $element.css("width", $attrs.radius)
                .css("height", $attrs.radius);
        }
    }};

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
    html += '<div class="ui-checkbox"><span class="box-panel"> <i class="touchable"></i><span class="box">';
    html += '<svg class="unchecked" width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'><use xlink:href=\'css/svg-icons.svg#unchecked\'></use></svg>';
    html += '<svg class="checked" width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'><use xlink:href=\'css/svg-icons.svg#checked\'></use></svg></span></span><span class="checkbox-label"  ng-transclude></span></div>';
    return{
        restrict: "E",
        template: html,
        replace: true,
        transclude: true,

        link: function ($scope, $element, $attrs) {
            var box = $element.find(".box").first();

            var hasBindModel = $attrs["ngModel"];
            var hasChecked = false;
            var model = null;
            /**
             * 如果绑定了变量(即使用了ng-model指令),则读取变量值,设置给checkbox为默认值
             */
            if (hasBindModel) {
                model = $parse($attrs["ngModel"]);
                hasChecked = model($scope);
            }
            toogleCheckbox(hasChecked);
            var ts = 0;
            $swipe.bind($element, {
                start: function (pos, event) {
                    if (event.timeStamp - ts < 500) {
                        return;
                    }
                    ts = event.timeStamp;
                    hasChecked = !hasChecked;
                    toogleCheckbox(hasChecked);
                    /**如果绑定了变量,则更新变量值**/
                    if (hasBindModel) {
                        model.assign($scope, hasChecked);
                    }
                    $scope.$apply();
                }
            });

            /**
             * 根据hasChecked值,设置checkbox是否被选中
             * @param hasChecked
             */
            function toogleCheckbox(hasChecked) {
                if (hasChecked) {
                    box.removeClass("off").addClass("on");
                } else {
                    box.removeClass("on").addClass("off");
                }
            }
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

    return{
        restrict: "E",
        template: '<div class="ui-radio"><span class="box-panel"><i class="touchable"></i><span class="box"><i class="outer"></i><i class="inner"></i></span></span><span class="radio-label" ng-transclude></span></div>',
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) {
            var box = $element.find(".box").first();
            var hasBindValue = $attrs["value"];
            var hasBindModel = $attrs["ngModel"];
            var color = $attrs["color"];
            var hasChecked = false;
            var model = null;
            var value = null;
            if (color) {
                $element.find(".inner").css("background", color);
            }
            /**
             * 如果绑定了变量(即使用了ng-model指令),则读取变量值,设radio为默认值
             */
            if (hasBindModel) {
                model = $parse($attrs["ngModel"]);
                $scope.$watch(model, function () {
                    if (model($scope) == value($scope)) {
                        box.removeClass("off").addClass("on");
                    } else {
                        box.removeClass("on").addClass("off");
                    }
                });
                /**
                 * 如果绑定了值,则比较value和model是否相等
                 */
                if (hasBindValue) {
                    value = $parse($attrs["value"]);
                    hasChecked = model($scope) == value($scope);
                }
            }
            if (hasChecked) {
                box.removeClass("off").addClass("on");
            }
            $swipe.bind($element, {
                start: function () {
                    hasChecked = true;
                    box.removeClass("off").addClass("on");
                    /**如果绑定了变量,则更新变量值**/
                    if (hasBindModel) {
                        model.assign($scope, value($scope));
                    }
                    $scope.$apply();
                }
            });


        }
    }
}]);
/**
 *
 */
directives.directive("uiToggleButton", ["$parse", "$swipe", function ($parse, $swipe) {
    var html = '<div class="ui-toggle-button off" ><i class="line"></i><div class="radio-panel"><div class="ui-radio" > <span class="box-panel"><span class="box-panel"> <i class="touchable"></i><span class="box off" > <i class="outer"></i><i class="inner"></i> </span> </span></div> </div> </div>'
    return{
        restrict: "E",
        template: html,
        replace: true,
        link: function ($scope, $element, $attrs) {
            var box = $element.find(".box").first();
            var hasBindModel = $attrs["ngModel"];
            var color = $attrs["color"];
            var hasChecked = false;
            var model = null;
            var value = null;
            if (color) {
                $element.find(".inner").css("background", color);
            }
            /**
             * 如果绑定了变量(即使用了ng-model指令),则读取变量值,设radio为默认值
             */
            if (hasBindModel) {
                model = $parse($attrs["ngModel"]);
                $scope.$watch(model, function () {
                    if (model($scope)) {
                        $element.removeClass("off").addClass("on");
                    } else {
                        $element.removeClass("on").addClass("off");
                    }
                });

            }
            if (hasChecked) {
                $element.removeClass("off").addClass("on");
                box.removeClass("off").addClass("on");
            } else {
                $element.removeClass("on").addClass("off");
                box.removeClass("on").addClass("off");
            }
            var timeStamp = 0;
            /**
             * 绑定触摸事件
             */
            $swipe.bind($element, {
                end: function (pos, event) {
                    if (event.timeStamp - timeStamp < 500) {
                        return;
                    }
                    timeStamp = event.timeStamp;
                    hasChecked = !hasChecked;
                    if (hasChecked) {
                        $element.removeClass("off").addClass("on");
                        box.removeClass("off").addClass("on");
                    } else {
                        $element.removeClass("on").addClass("off");
                        box.removeClass("on").addClass("off");
                    }
                    /**如果绑定了变量,则更新变量值**/
                    if (hasBindModel) {
                        model.assign($scope, hasChecked);
                    }
                    $scope.$apply();
                }
            });

        }
    }
}]);
/**
 * 输入框指令
 */
directives.directive("uiInput", function ($parse) {
    return{
        restrict: "E",
        template: '<div class="ui-input"><span class="placeholder"></span><input type="text"/> <i class="line"></i></div>',
        replace: true,
        link: function ($scope, $element, $attrs) {
            var input = $element.find("input");
            var hasBindModel = $attrs["ngModel"];
            var model = null;
            if (hasBindModel) {
                model = $parse($attrs["ngModel"]);
                input.val(model($scope));

                $scope.$watch(model, function () {
                    input.val(model($scope));
                    if (input.val().length > 0) {
                        $element.addClass("focus").addClass("hasVal").removeClass("blur");
                    }
                });

            }
            if ($attrs["placeholder"]) {
                $element.find(".placeholder").text($attrs["placeholder"]);
            }
            if ($attrs["type"]) {
                input.attr("type", $attrs["type"]);
            }
            input.on("focus", function () {
                if (input.val().length > 0) {
                    $element.removeClass("hasVal");
                }
                $element.addClass("focus").removeClass("blur");
            });
            input.on("blur", function () {
                if (input.val() == "") {
                    $element.addClass("blur").removeClass("focus");
                } else {
                    $element.addClass("hasVal");
                }
                if (hasBindModel) {
                    model.assign($scope, input.val());
                    $scope.$apply();
                }
            });
        }
    }
});
/**
 * 选项卡指令
 */
directives.directive("uiTabSet", ["$compile", "$swipe" , function ($compile, $swipe) {
    return{
        restrict: "E",
        template: '<div class="ui-tab-set" ><ul class="tabs" ng-transclude></ul><div class="content-panel" ></div></div>',
        transclude: true,
        replace: true,
        link: function ($scope, $element, $attrs) {
            var winWidth = $element.width();
            var ul = $element.find("ul").first();
            var tabs = $element.find("ui-tab");
            var panel = $element.find(".content-panel");
            for (var i = 0; i < tabs.size(); i++) {
                var tab = tabs.eq(i);
                var heading = tab.attr("heading");
                var contents = tab.contents();
                var li = $('<li class="tab" material ><span>' + heading + '</span></li>');
                var tabContent = $("<div class='tab-content'></div>");
                if (i == 0) {
                    li.addClass("active");
                    tabContent.addClass("active");
                }
                tabContent.css("width", winWidth + "px");
                li.appendTo(ul);
                contents.appendTo(tabContent);
                tabContent.appendTo(panel);
                tab.remove();
            }
            var tabTitles = ul.find("li");
            tabTitles.each(function () {
                var that = this;
                $swipe.bind($(that), {
                    start: function () {
                        var index = tabTitles.index(that);
                        panel.css("left", (winWidth * index * -1) + "px");
                        ul.find(".active").removeClass("active");
                        ul.find("li").eq(index).addClass("active");
                    }
                });
            });
            $compile(ul.contents())($scope);
            var count = tabs.size();
            var index = 0;
            var old = {x: 0, y: 0};
            var minLeft = (count - 1) * winWidth * -1;
            var left = 0;
            $swipe.bind(panel, {
                start: function (cur) {
                    old = cur;
                    left = panel.offset().left;
                },
                end: function (cur) {
                    var m = cur.x - old.x;
                    if (m < -50) {
                        index = index < count - 1 ? index + 1 : index;
                    }
                    if (m > 50) {
                        index = index > 0 ? index - 1 : index;
                    }
                    panel.css("left", (winWidth * index * -1) + "px");
                    ul.find(".active").removeClass("active");
                    ul.find("li").eq(index).addClass("active");
                },
                move: function (cur) {
                    var m = cur.x - old.x;
                    var newLeft = left + m;
                    if (newLeft > 0) {
                        newLeft = 0;
                    }
                    if (newLeft < minLeft) {
                        newLeft = minLeft;
                    }
                    panel.css("left", newLeft + "px");
                }
            });
        }
    };
}]);
/**
 * 对话框指令
 */
directives.directive("uiDialog", ["$compile", "$swipe", "$parse" , function ($compile, $swipe, $parse) {
    return{
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="ui-dialog"><div class="overlay"></div> <div class="dialog" > <h1 class="title">提示</h1> <div class="content" ng-transclude></div><div class="actions"></div></div></div>',
        link: function ($scope, $element, $attrs) {
            //解析绑定的属性,该属性指定对话框是否显示
            var dialog = {};
            var model = $attrs["ngModel"];
            if (model) {
                model = $parse(model);
                dialog = model($scope);
                $scope.$watch(model, function () {
                    dialog = model($scope);
                    setDialog(dialog);
                }, true);
            }

            //给背景遮盖层绑定点击事件
            var overlay = $element.find(".overlay");
            $swipe.bind(overlay, {
                end: function () {
                    $element.removeClass("active");
                    if (model) {
                        dialog.show = false;
                        model.assign($scope, dialog);
                        $scope.$apply();
                    }
                }
            });
            function setDialog(dialog) {
                if (dialog.show) {
                    $element.addClass("active");
                } else {
                    $element.removeClass("active");
                }
                if (dialog.title) {
                    $element.find(".title").html(dialog.title);
                }
                if (dialog.buttons) {
                    var actions = $element.find(".actions").first();
                    actions.empty();
                    for (var i = 0; i < dialog.buttons.length; i++) {
                        var aButton = dialog.buttons[i];
                        var tpl = "<ui-flat-button >";
                        if (aButton.icon) {
                            tpl += ' <ui-icon name="' + aButton.icon + '" size="18px,18px" file="navigation" color="#999"></ui-icon>';
                        }
                        tpl += aButton.text + "</ui-flat-button>";
                        $(tpl).appendTo(actions)
                    }
                    $compile(actions.contents())($scope);
                    var action_btns = actions.find(".ui-flat-button");
                    action_btns.each(function () {
                        var index = action_btns.index(this);
                        $swipe.bind($(this), {
                            end: function () {
                                dialog.buttons[index].click();
                                $scope.$apply();
                            }
                        });
                    });

                }
            }
        }
    };
}]);
/**
 * 抽屉导航指令
 */
directives.directive("uiNavigation", [ "$swipe", "$parse" , function ($swipe, $parse) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="ui-navigation"><div class="overlay"></div><div class="content" ng-transclude></div></div>',
        link: function ($scope, $element, $attrs) {

            if ($attrs["active"]) {
                var model = $parse($attrs["active"]);
                $scope.$watch(model, function () {
                    var isActive = model($scope);
                    if (isActive) {
                        $element.addClass("active");
                    } else {
                        $element.removeClass("active");
                    }
                })
            }
            //给导航父元素绑定划屏事件
            var handle = $element.parent();
            var fromX = 0;
            $swipe.bind(handle, {
                start: function (pos) {
                    fromX = pos.x;
                },
                move: function (pos) {
                    if ((pos.x - fromX > 5) && fromX < 10) {
                        model.assign($scope, true);
                        $scope.$apply();
                    }
                }
            });
            var x = 0;
            $swipe.bind($element.find(".content"), {
                start: function (pos) {
                    x = pos.x;
                },
                move: function (pos) {
                    console.info(pos.x - x);
                    if (pos.x - x < -80) {
                        model.assign($scope, false);
                        $scope.$apply();
                    }
                }
            });
            $swipe.bind($element.find(".overlay"), {
                end: function () {
                    model.assign($scope, false);
                    $scope.$apply();
                }
            });
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                event.targetScope.$watch('$viewContentLoaded', function () {
                    model.assign($scope, false);
                })
            });
        }
    };
}]);

directives.directive("uiList", function () {
    return{
        restrict: 'C',
        compile: function ($element, attrs) {
            var all = $element.find(">li");
            all.each(function () {
                var $this = $(this);
                var index = all.index(this);
                var delay = 0.1;
                var a = $this.find("a");
                a.attr("material", true);
                a.css("transition", "all 0.3s ease " + (delay + (index * 0.05)) + "s");
                a.css("-webkit-transition", "all 0.3s ease " + (delay + (index * 0.05)) + "s");
            });

            return function (scope, el, attrs) {
            }
        }
    };

});
directives.directive("uiScrollHeader", function () {

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="ui-scroll-header"><div class="wrapper"  ng-transclude></div></div>',
        link: function ($scope, $element, $attrs) {
            var $wrapper = $element.find(">.wrapper").first();
            var $header = $('<div class="header"><div class="bg"></div></div>');
            if ($attrs["backgroundImage"]) {
                $header.find(".bg").css("background-image", "url('" + $attrs["backgroundImage"] + "')")
            }
            if ($attrs["backgroundColor"]) {
                $header.css("background-color", $attrs["backgroundColor"]);
            }
            $wrapper.prepend($header);
            var $actionbar = $element.find(".action-bar").first();
            var $bg = $wrapper.find(">.header>.bg");
            $wrapper.scroll(function (pa) {
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
directives.directive("uiDropdown", [ "$swipe", "$parse", "$document", "$compile" , function ($swipe, $parse, $document, $compile) {
    var UI_OPTIONS_REG = /^([\S]+)\sfor\s+([\S]+)\sin\s([\S]+)$/;
    return {
        restrict: 'E',
        template: "<ul class='ui-dropdown'></ul>", replace: true,
        link: function ($scope, $element, $attrs) {
            var exp = $attrs["uiOptions"];
            var match = exp.match(UI_OPTIONS_REG);
            var model = $parse($attrs["ngModel"]);
            var key = match[1].split(".")[1];
            var options = $parse(match[3])($scope);
            angular.forEach(options, function (opt) {
                var li = $("<li><i class='ripple'></i>" + opt[key] + "</li>");
                $swipe.bind(li, {
                    end: function () {
                        model.assign($scope, opt);
                        $scope.$apply();
                    }
                });
                li.appendTo($element);
            });
            $compile($element.contents())($scope);
        }
    }

}]);
/**
 * @param ng-model(required)
 * @param ui-options (required)
 *
 */
directives.directive("uiDropdownMenu", [ "$swipe", "$parse", "$document", "$compile" , function ($swipe, $parse, $document, $compile) {
    var UI_OPTIONS_REG = /^([\S]+)\sfor\s+([\S]+)\sin\s([\S]+)$/;
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="ui-dropdown-menu"><span></span><i class="arrow"></i></div>',
        compile: function ($element, $attrs) {
            var exp = $attrs["uiOptions"];
            var match = exp.match(UI_OPTIONS_REG);
            var key = match[1].split(".")[1];
            var dropdown = $("<ui-dropdown></ui-dropdown>");
            dropdown.attr("ng-model", $attrs["ngModel"]);
            dropdown.attr("ui-options", $attrs["uiOptions"]);
            dropdown.appendTo($element);
            return function ($scope, $element, $attrs) {
                var span = $element.find(">span");
                $swipe.bind(span, {
                    end: function () {
                        $element.addClass("active");
                        $document.bind("click", closeDropdown)
                    }
                });
                var model = $parse($attrs["ngModel"]);
                $scope.$watch(model, function () {
                    var val = model($scope);
                    if (val)
                        span.html(val[key]);
                    $element.removeClass("active");
                });
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

directives.directive("uiMenuButton", [ "$swipe", "$parse", "$document", "$compile" , function ($swipe, $parse, $document, $compile) {
    return {
        restrict: 'C',
        link: function ($scope, $element, $attrs) {
            $swipe.bind($element, {
                end: function () {
                    $element.addClass("active");
                    $document.bind("click", closeDropdown)
                }
            });
            function closeDropdown(evt) {
                if (evt && $element.get(0).contains(evt.target)) {
                    return;
                }
                $element.removeClass("active");
                $document.unbind("click", closeDropdown)
            }
        }
    };
}]);

