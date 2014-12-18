/*
 Copyright 2014 Chen xiaowei (Github:https://github.com/material-ui)

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
 * 名称:touch服务
 * 功能:提供界面元素的触摸事件的绑定操作,用于替换angular-touch的$swipe
 * 说明: 因为$swipe只提供左右滑动事件监听,不提供上下滑动监听,使用上和$swpie没有差别
 * 使用:
 *  $touch.bind(element,{
 *      start:function(pos,evt){
 *          ...
 *      },
 *      move:function(pos,evt){
 *          ...
 *      },
 *      end:function(pos,evt){
 *          ...
 *      }
 * });
 * 版本:0.0.1
 * 日期:2014.12.17
 * 作者:陈晓伟
 */
directives.service("$touch", function () {
    var POINTER_EVENTS = {
        'mouse': {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        },
        'touch': {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        }
    };
    var POINT_TYPE=isMobile()?"touch":"mouse";
    /**
     * 检测是否是移动端
     * @returns {boolean}
     */
    function isMobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 得到触摸坐标
     * 本函数参考于:angular-touch中源码
     * @param event
     * @returns {{x: (number|Number), y: (number|Number)}}
     */
    function getCoordinates(event) {
        var touches = event.touches && event.touches.length ? event.touches : [event];
        var e = (event.changedTouches && event.changedTouches[0]) ||
            (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
            touches[0].originalEvent || touches[0];
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
    function getPosition(event){
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
        return {x:x,y:y};
    }

    return {
        /**
         * 对外操作函数,用于绑定事件
         * bind函数使用上和angular-touch的$swipe服务一样
         * @param element 要绑定的元素
         * @param param 参数
         */
        bind: function (element, param) {
            var keydown = false;
            /**触摸开始事件绑定**/
            if (param.start) {
                element.on(POINTER_EVENTS[POINT_TYPE]["start"], start);
            }
            //触摸拖动事件绑定
            if (param.move) {
                element.on(POINTER_EVENTS[POINT_TYPE]["move"], move);
            }
            //触摸结束事件绑定
            if (param.end) {
                element.on(POINTER_EVENTS[POINT_TYPE]["end"], end);
            }
            /**
             * 触摸开始函数
             * @param evt
             */
            function start(evt) {
                keydown = true;
                param.start(getCoordinates(evt), evt,getPosition(evt));
            }

            /**
             * 触摸拖动函数
             * @param evt
             */
            function move(evt) {
                //判断是否已经按下(mousedown|touchstart),如果没有按下,并不触发拖动事件
                if (keydown) {
                    var pos = getCoordinates(evt);
                    var offset = element.offset();
                    if (pos.x < offset.left || pos.y < offset.top) {
                        keydown = false;
                        return;
                    }
                    param.move(pos, evt);
                }
            }

            /**
             * 触摸结束事件
             * @param evt
             */
            function end(evt) {
                keydown = false;
                param.end(getCoordinates(evt), evt);
            }
        }
    }
});

/**
 * 名称:圆角矩形服务
 * 功能:根据提供的宽,高和圆角半径,绘制圆角矩形路径
 * 说明:主要用于button指令的背景
 * 版本:0.0.1
 * 日期:2014.12.17
 * 作者:陈晓伟
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
            return tpl
                .replace(reg_width, width + "px")
                .replace(reg_height, height + "px")
                .replace(reg_x, x + "px")
                .replace(reg_y, y + "px")
                .replace(reg_radius, radius + "px");

        }
    };
});
/**
 * 名称:触摸开始指令
 * 功能:用于给元素绑定触摸开始的事件
 * 说明:该指令调用$touch的start函数,主要绑定mousedown和touchstart事件
 * 版本:0.0.1
 * 日期:2014.12.17
 * 作者:陈晓伟
 */
directives.directive('touchStart', ["$parse", "$touch", function ($parse, $touch) {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            var model = $parse($attrs["touchStart"]);
            $touch.bind($element, {
                start: function () {
                    model($scope);
                    $scope.$apply();
                }
            })
        }
    }
}]);
/**
 * 名称:触摸结束指令
 * 功能:用于给元素绑定触摸结束的事件
 * 说明:该指令调用$touch的end函数,主要绑定mouseup和touchend事件
 * 版本:0.0.1
 * 日期:2014.12.17
 * 作者:陈晓伟
 */
directives.directive('touchEnd', ["$parse", "$touch", function ($parse, $touch) {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            var model = $parse($attrs["touchEnd"]);
            var ts=0;
            $touch.bind($element, {
                end: function (coords,evt) {
                    model($scope);
                    $scope.$apply();
                }
            })
        }
    }
}]);

/**
 * 名称:material-ui的触摸效果指令
 * 功能:给元素添加触摸阴影背景效果
 * 使用: <div style='width:100%;height:48px' class="touchable">点我</div>
 * 说明:
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('touchable', ["$touch", function ($touch) {
    return {
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
            $touch.bind($parent, {
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
directives.directive('ripple', ["$compile", "$touch", function ($compile, $touch) {
    return {
        restrict: "C",
        link: function ($scope, $element, $attrs) {
            var $parent = $element.parent();
            var parentWidth = $parent.width();
            var parentHeight =$parent.height();
            /**取父元素的宽高最大值**/
            var size = Math.max(parentWidth, parentHeight);

            $parent.css("position", "relative");
            /**把父元素大小放大2倍,作为指令元素的宽和高**/
            $element.css("width", size * 2 + 'px');
            $element.css("height", size * 2 + 'px');
            /**
             * 给父元素绑定触摸事件,
             */
            $touch.bind($parent, {
                start: function (coords, event,pos) {
                    $element.removeClass("animate");
                    /**计算出动画开始点**/
                   var x = pos.x - $parent.offset().left - $element.width() / 2;
                   var y = pos.y - $parent.offset().top - $element.height() / 2;
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
            return function (scope, el, attrs) { }
        }
    };
});
/**
 * 名称:Toggle class 的指令
 * 功能:实现jquery的toggleclass的功能
 * 使用:<a ui-toggle-class="active" target="#applist">点我</a> 或者<a ui-toggle-class="active">点我</a>
 * 说明:如果元素有target属性,则是切换target指定元素的class,否则是切换元素本身
 * @attribute ui-toggle-class 必需
 * @attribute target 可选
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiToggleClass', ['$touch', function ($touch) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var target = attr["target"];
            if (target) {
                /**
                 * 这里很坑爹!作者只想减少对jquery的依赖,这里用angular的jqlite,但是,如果页面没有引jquery,这行代码将得到
                 * 的是undefined,因为jqlite不支持selector,所以为了支持target功能,作者只能做到这样了
                 */
                target = angular.element(target)
            } else {
                target = element;
            }
            var toggleClass = attr["uiToggleClass"];
            $touch.bind(element, {
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
 * 使用: <ui-icon width="32px" height="32px" color="#ff0000" name="ic-user"></ui-icon>
 * 说明:width:图标宽度,height:图标高度,color:图标姿色,name:图标代码.图标代码参照[图标集]
 * @attribute name 图标名称(必需)
 * @attribute width 图标宽度(可选)
 * @attribute height 图标高度(可选)
 * @attribute color 图标填充色(可选)
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiIcon', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: "@name",
            color: "@color"
        },
        template: '<svg ng-style="{\'width\':width,\'height\':height,\'fill\':color}"   width="48" height="48" viewBox="0 0 48 48">' +
        '<use xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{svg_link}}"></use></svg>',
        link: function (scope, $element, $attrs) {
            if ($attrs["size"]) {
                var size = $attrs["size"].split(",");
                if (size.length != 2) {
                    console.error("[ui-icon]无效的size属性,size属性格式必需为:size='width,height'");
                    return;
                }
                scope.width = size[0];
                scope.height = size[1];
            }
            scope.svg_link = "css/svg-icons.svg#" + scope.name;
        }
    }
});
/**
 * 名称:普通按钮 指令
 * 功能:实现按钮功能,替代系统的<button>
 * 使用: <ui-button ng-click="clickMe()">Button</ui-button>
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
            /**画圆角背景,如果只用border-radius,并不能解决ripple指令动画溢出,所这里用clip-path**/
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
            /**画圆角背景,如果只用border-radius,并不能解决ripple指令动画溢出,所这里用clip-path**/
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
 * @attribute radius 圆角半径(必需)
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive('uiRoundButton', function () {
    return {
        restrict: "E",
        template: '<div class="ui-round-button" ng-style="{width:radius,height:radius}">' +
        '<button material ng-style="{\'-webkit-clip-path\':centerPos,\'clip-path\':centerPos}">' +
        '<span ng-transclude></span></button></div>',
        replace: true,
        transclude: true,
        scope:{
            radius:"@radius"
        },
        link: function (scope, $element, $attrs) {
            var width = parseInt($attrs.radius);
            scope.centerPos = "circle(" + $attrs.radius + " at " + width / 2 + "px " + width / 2 + "px)";
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
        template: '<div class="icon-button"><i class="touchable"></i><a  class="button"><svg ><use xlink:href="{{svg_icon}}"></use></svg></a></div>',
        compile: function ($element, $attrs) {
            $element.find("use").attr("xlink:href", "css/svg-icons.svg#" + $attrs["icon"]);
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
directives.directive("uiCheckbox",  function () {
    var html = '<div class="ui-checkbox" touch-end="model=!model"><span class="box-panel"> <i class="touchable"></i><span class="box" ng-class="{true:\'on\',false:\'off\',undefined:\'off\'}[model]">';
    html += '<ui-icon class="unchecked" name="ic-unchecked" ></ui-icon>';
    html += '<ui-icon class="checked" name="ic-check" ></ui-icon></span></span><span class="checkbox-label"  ng-transclude></span></div>';
    return {
        restrict: "E",
        template: html,
        replace: true,
        transclude: true,
        scope: {
            model: "=ngModel"
        }
    }
});
/**
 * 名称:单选框指令
 * 功能:提供radio的单选功能,添加了CSS3动画效果,可以替代系统的radio工作
 * 使用:<ui-radio ng-model="agree" value="1">同意</ui-radio><ui-radio ng-model="reject" value="0">拒绝</ui-radio>
 * 说明:ng-model绑定$scope中的值,value指令radio的选项值
 * @attribute ngModel 数据绑定 必需
 * @attribute color 实心颜色 可选
 * @attribute value 单选框的值
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiRadio",  function () {
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
});
/**
 * 名称:切换框指令
 * 功能:提供开关功能,
 * 使用: <ui-toggle-button   ng-model="open"></ui-toggle-button>
 * 说明:ng-model绑定$scope中的值,
 * @attribute ngModel 数据绑定 必需
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiToggleButton", function () {
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
});
/**
 * 名称:单行输入框指令
 * 功能:提供<input>标签功能
 * 使用: <ui-input type="text" placeholder="Please input your account" ng-model="username"></ui-input>
 * 说明:ng-model绑定$scope中的值,
 * @attribute ngModel 数据绑定 必需
 * @attribute placeholder 占位字符
 * @attribute type 输入类型
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiInput", function ($parse) {
    return {
        restrict: "E",
        template: '<div class="ui-input" ng-class="{hasVal:model!=null && model!=\'\',focus:model!=null}"><span class="placeholder">{{placeholder}}</span>' +
        '<input type="{{type==\'date\'?\'text\':type}}" ng-readonly="type==\'date\'" ng-model="model" ng-blur="blur()" ng-focus="focus()"/> <i class="line"></i>' +
        '<ui-datepicker ng-class="{active:active}"  ng-model="date" ng-if="type==\'date\'"></ui-datepicker></div>',
        replace: true,
        scope: {
            model: "=ngModel",
            placeholder: "@placeholder",
            type: "@type"
        },
        controller: function ($scope) {
            /**
             * 设置值
             * @param val
             */
            this.setValue = function (val) {
                $scope.model = val;
                $scope.active = false;
            };
            /**
             * 获取值
             * @returns {*}
             */
            this.getValue = function () {
                return $scope.model;
            };
            /**
             * 关闭日期选择器
             */
            this.closeDatepicker = function () {
                $scope.active = false;
            };
        },
        link: function (scope, $element, $attrs) {
            /****监听数据变化********/
            scope.$watch("model", function () {
                if (scope.model) {
                    $element.addClass("focus").removeClass("blur");
                }
            });
            scope.focus = function () {
                if (scope.model && scope.model.length > 0) {
                    $element.removeClass("hasVal");
                }
                $element.addClass("focus").removeClass("blur");
                if (scope.type == "date") {
                    scope.active = true;
                }
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
 * 名称:Tab选项卡指令
 * 功能:提供多页面切换功能
 * 使用: <ui-tabset>...</ui-tabset>
 * 说明:必需和<ui-tab>指令结合使用 例如:
 *      <ui-tabset>
 *          <ui-tab heading='TAB1'>TAB1 Content</ui-tab>
 *          <ui-tab heading='TAB2'>TAB2 Content</ui-tab>
 *          <ui-tab heading='TAB3'>TAB3 Content</ui-tab>
 *      </ui-tabset>
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiTabSet", ["$touch", function ($touch) {
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
            /**
             * 添加标签名
             * @param name
             */
            this.addHeader = function (name) {
                $scope.tabHeaders.push(name);
            };
            /**
             * 得到选项卡数量
             * @returns {Number}
             */
            this.getTabCount = function () {
                return $scope.tabHeaders.length;
            };
        },
        link: function (scope, element, attrs, ctrl) {
            scope.winWidth = element.width();
            scope.panel_left = "0";
            scope.selection_bar_left = "0";
            scope.selectTab = function (index) {
                scope.panel_left = "translateX(" + (scope.winWidth * index * -1) + "px)";
                scope.selection_bar_left = "translateX(" + scope.winWidth / 3 * index + "px)";
            };
            /************************下面代码有点乱,以后再整理***************************************/
            var panel = element.find(".content-panel");
            var count = ctrl.getTabCount();
            var index = 0;
            var start_pos = {x: 0, y: 0};
            var minLeft = (count - 1) * scope.winWidth * -1;
            var left = 0;
            $touch.bind(panel, {
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
 * 名称:单个选项卡指令,该指令依赖uiTabSet
 * 功能:请参照<ui-tabset>
 * 使用: <ui-tab>...</ui-tab>
 * 说明:必需和<ui-tabset>指令结合使用
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
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
 * 名称:对话框指令
 * 功能:提供动态对话框功能
 * 使用: <ui-dialog  ng-model="dialog">...</ui-dialog>
 * 说明:
 * @attribute ng-model 对话框数据 必需
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiDialog", ["$compile", "$touch", "$parse", function ($compile, $touch, $parse) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            dialog: "=ngModel"
        },
        template: '<div class="ui-dialog" ng-class="{active:dialog.show}">' +
        '<div class="overlay" touch-end="dialog.show=false"></div> ' +
        '<div class="dialog" > <h1 class="title">{{dialog.title}}</h1> ' +
        '<div class="content" ng-transclude></div>' +
        '<div class="actions">' +
        '<ui-flat-button ng-repeat="btn in dialog.buttons" touch-end="btn.click()">' +
        '<ui-icon name="{{btn.icon}}" ng-if="btn.icon" file="navigation"  size="18px,18px"  color="#999"></ui-icon>{{btn.text}}' +
        '</ui-flat-button></div></div></div>'
    };
}]);

/**
 * 名称:抽屉导航指令
 * 功能:提供导航功能
 * 使用:<ui-navigation active="showNavigation">...</ui-navigation>
 * 说明:
 * @attribute active true or false,是否显示导航 必需
 * 版本:0.0.1
 * 日期:2014.11.25
 * 作者:陈晓伟
 */
directives.directive("uiNavigation", ["$touch", "$parse", function ($touch, $parse) {
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
            $touch.bind(parent, {
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
            /**内容滑屏事件***********/
            $touch.bind(element.find(".content"), {
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
            //监听页面加载事件
            scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                event.targetScope.$watch('$stateChangeStart', function () {
                    scope.active = false;
                })
            });
        }
    };
}]);
/**
 * 可顶部滚动ActionBar指令
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
            var $header = angular.element('<div class="header"><div class="bg"></div></div>');
            var $bg = $header.find(".bg");
            if ($attrs["backgroundImage"]) {
                $bg.css("background-image", "url('" + $attrs["backgroundImage"] + "')")
            }
            if ($attrs["backgroundColor"]) {
                $header.css("background-color", $attrs["backgroundColor"]);
            }
            var $actionbar = $wrapper.find(".action-bar");
            $wrapper.prepend($header);
            $wrapper.bind("scroll", function (pa) {
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

/**
 * select 指令
 * @param ng-model(required)
 * @param items (required)
 * @param key (required)
 *
 */
directives.directive("uiSelect", ["$touch", "$parse", "$document", function ($touch, $parse, $document) {
    //var UI_OPTIONS_REG = /^([\S]+)\sfor\s+([\S]+)\sin\s([\S]+)$/;
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: "=ngModel",
            items: "=items",
            key: "@key"
        },
        template: '<div class="ui-select" ui-toggle-class="active" ><span touch-end="bindDocumentClickEvent()">{{model[key]}}</span><i class="arrow"></i>' +
        '<ul class="ui-dropdown"><li ng-repeat="item in items" ng-click="setValue(item)" material>{{item[key]}}</li></ul></div>',
        link: function (scope, $element, $attrs) {
            /**
             * 设置选中值
             * @param val
             */
            scope.setValue = function (val) {
                scope.model = val;
            };
            /**
             * 给document绑定点击事件.如果下拉框已经打开,用户没有点击下拉框,而点击了页面的其它位置,通过给document绑定事件
             * 来关闭下拉框
             */
            scope.bindDocumentClickEvent = function () {
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
    };
}]);
/**
 * 评分指令
 */
directives.directive("uiRating", function () {
    return {
        restrict: 'E',
        template: '<ul class="ui-rating"><li ng-repeat="val in items" ng-click="setValue(val)"><i class="touchable"></i>' +
        '<ui-icon ng-if="val<=model" name="{{stateOn}}"></ui-icon><ui-icon ng-if="val>model" name="{{stateOff}}"></ui-icon></li></ul>',
        replace: true,
        require: "ngModel",
        scope: {
            model: "=ngModel",
            max: "=max",
            stateOn: "@stateOn",
            stateOff: "@stateOff"
        },
        link: function (scope, $element, $attrs, ngModel) {
            scope.items = [];
            for (var i = 1; i <= scope.max; i++) {
                scope.items.push(i);
            }
            scope.setValue = function (val) {
                ngModel.$setViewValue(val);
            }
        }
    }
});
/**
 * 滚动项
 */
directives.directive("uiScroll", ["$touch", "$parse", function ($touch, $parse) {
    return {
        restrict: 'C',
        require: "ngModel",
        scope: {
            model: "=ngModel"
        },
        link: function (scope, $element, $attrs, ngModel) {

            $element.attr("top", 0);
            var itemHeight = $attrs["itemHeight"];
            var start_pos;
            var new_top = 0;
            var timeStamp = 0;

            scope.$watch("model", function () {
                if (scope.model) {
                    var top = scope.model * -1 * itemHeight;
                    $element.attr("top", top);
                    $element.css("transform", "translateY(" + (top) + "px)");
                }

            });

            $touch.bind($element, {
                start: function (pos, evt) {
                    start_pos = pos;
                    $element.css("transition", "none");
                    timeStamp = evt.timeStamp;
                },
                move: function (pos) {
                    new_top = pos.y - start_pos.y;
                    var old_top = $element.attr("top");
                    new_top = parseInt(old_top) + new_top;
                    if (new_top > 0) {
                        new_top = 0;
                    }
                    var maxTop = $element.height() - itemHeight;
                    if (new_top < maxTop * -1) {
                        new_top = maxTop * -1;
                    }
                    $element.css("transform", "translateY(" + (new_top) + "px)");
                },
                end: function (pos, evt) {
                    var scrollTop = getScrollTop(pos, evt);
                    var old_top = parseInt($element.attr("top"));
                    new_top = old_top + scrollTop;
                    var maxTop = $element.height() - itemHeight;
                    if (new_top < maxTop * -1) {
                        new_top = maxTop * -1;
                    } else if (new_top > 0) {
                        new_top = 0;
                    }
                    var round = Math.round(new_top / itemHeight);
                    new_top = round * itemHeight;
                    $element.css("transition", "all 0.5s ease 0s");
                    $element.css("transform", "translateY(" + (new_top) + "px)");
                    $element.attr("top", new_top);
                    ngModel.$setViewValue(round * -1);
                }
            });
            function getScrollTop(pos, evt) {
                var speed = 1;
                var ts = evt.timeStamp - timeStamp;
                var d = pos.y - start_pos.y;
                if (ts < 200) {
                    speed = (200 / ts).toFixed(0);
                }
                return d * speed;
            }
        }
    }
}]);

/**
 * 年份选择器
 */
directives.directive("yearPicker", function () {
    return {
        restrict: 'E',
        scope: {
            year: "=year"
        },
        require: "^uiDatepicker",
        template: '<ul class="ui-scroll" item-height="48" ng-model="index"><li ng-repeat="y in years" ng-class="{active:$index==index}">{{y}}</li></ul>',
        link: function (scope, $element, $attrs, uiDatepicker) {
            scope.$watch("year", function () {
                var today = new Date();
                var years = [];
                for (var i = today.getFullYear() - 20; i <= today.getFullYear() + 20; i++) {
                    years.push(i);
                }
                scope.years = years;
                scope.index = scope.year - years[0];
                scope.$watch("index", function () {
                    uiDatepicker.setYear(scope.years[scope.index]);
                });
            });
        }
    }
});
/**
 * 月选择器
 */
directives.directive("monthPicker", function () {
    return {
        restrict: 'E',
        scope: {
            month: "=month"
        },
        require: "^uiDatepicker",
        template: '<ul class="ui-scroll" item-height="48" ng-model="index"><li ng-repeat="m in months" ng-class="{active:$index==index}">{{m}}</li></ul>',
        link: function (scope, $element, $attrs, uiDatepicker) {
            scope.$watch("month", function () {
                scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                scope.index = scope.month - scope.months[0];
                scope.$watch("index", function () {
                    uiDatepicker.setMonth(scope.months[scope.index]);
                });
            });
        }
    }
});
/**
 * 日选择器
 */
directives.directive("dayPicker", function () {
    return {
        restrict: 'E',
        scope: {
            year: "=year",
            month: "=month",
            day: "=day"
        },
        require: "^uiDatepicker",
        template: '<ul class="ui-scroll" item-height="48" ng-model="index"><li ng-repeat="m in days" ng-class="{active:$index==index}">{{m}}</li></ul>',
        link: function (scope, $element, $attrs, uiDatepicker) {
            scope.$watch("month", function () {
                var maxDay = new Date(scope.year, scope.month, 0).getDate();
                var days = [];
                for (var i = 0; i < maxDay; i++) {
                    days.push(i);
                }
                scope.days = days;
                scope.index = scope.day - scope.days[0];
                scope.$watch("index", function () {
                    uiDatepicker.setDay(scope.days[scope.index]);
                });
            });
        }
    }
});
/**
 * 日期选择指令
 */
directives.directive("uiDatepicker", function () {
    return {
        restrict: 'E',
        scope: true,
        require: "^uiInput",
        replace: true,
        controller: function ($scope) {
            /**
             * 设置月份
             * @param year
             */
            this.setYear = function (year) {
                $scope.date.year = year;
            };
            /**
             * 设置月份
             * @param month
             */
            this.setMonth = function (month) {
                $scope.date.month = month;
            }
            /**
             * 设置天
             * @param day
             */
            this.setDay = function (day) {
                $scope.date.day = day;
            }
        },
        template: '<div class="ui-datepicker">' +
        '<div class="overlay" ng-click="close()"/>' +
        '<div class="dialog">' +
        '<div class="title"> ' +
        '<ui-icon-button icon="ic-close" class="close"  ng-click="close()"></ui-icon-button><span>{{date.year}}-{{date.month}}-{{date.day}}</span>' +
        '<ui-icon-button icon="ic-check" class="confirm"  ng-click="setValue()"></ui-icon-button></div>' +
        '<div class="selector">' +
        '<year-picker year="date.year"></year-picker>' +
        '<month-picker month="date.month"></month-picker>' +
        '<day-picker year="date.year" month="date.month" day="date.day"></day-picker>' +
        '</div>' +
        '</div>' +
        '</div>',
        link: function (scope, $element, $attrs, uiInput) {
            var defaultValue = uiInput.getValue();
            var now = new Date();

            if (defaultValue && defaultValue != "") {
                var dateArray = defaultValue.split("-");
                scope.date = {
                    year: parseInt(dateArray[0]),
                    month: parseInt(dateArray[1]),
                    day: parseInt(dateArray[2])
                };
            } else {
                scope.date = {
                    year: now.getFullYear(),
                    month: now.getMonth(),
                    day: now.getDate()
                };
            }
            /**
             * 设置值,目前只以yyyy-MM-dd格式输出
             */
            scope.setValue = function () {
                var month = scope.date.month;
                var day = scope.date.day;
                var val = scope.date.year + "-" + (month > 9 ? month : "0" + month) + "-" + (day > 9 ? day : "0" + day);
                uiInput.setValue(val);
            };
            /**
             * 关闭日期选择器
             */
            scope.close = function () {
                uiInput.closeDatepicker();
            };
        }
    }
});