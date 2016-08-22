/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-12-16 11:57:02
 * @version $Id$
 */
var module = angular.module('mynepapp.directives', []);

module.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});
module.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            console.log(scope);
            if (scope.$last === true) {
                console.log('finish');
                $timeout(function() {
                    scope.$emit('ngHtmlFinished');
                });
            }
            //console.log(attr.ngBindHtml);
            //return scope.$emit('ngHtmlFinished');
            /*if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngHtmlFinished');
                });
            }*/
        }
    };
});

module.directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            if (attrs.focusMeDisable === "true") {
                return;
            }
            alert('aaa');
            $timeout(function () {
                console.log(element);
                element[0].focus();
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.show(); //open keyboard manually
                }
            }, 350);
        }
    };
});