"use strict";
/* The MIT License (MIT)

Copyright (c) 2014 Piero Toffanin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/* Code inspired by http://eightmedia.github.io/hammer.js/examples/carousel.html */
var HScroller = {
	create: function(container){
		var $container = $(container);
		var $pages = $(">li", $container);
		var panel_width = 0;
		var pages_count = $pages.length;
		var current_page = 0;
        var resizeHandler;
        var $window = $(window);
        var KEYS = {
            ARROW_LEFT : 37,
            ARROW_RIGHT : 39
        };

        // Handle hashchange states
        var handleHashChange = (function(){
            var routes = (function(){
                var map = {};
                $("a[data-page]").each(function(){
                    map[$(this).attr('href').replace('#', '')] = $(this).data('page');
                });
                return map;
            })();

            return function(){
                var hash = $.param.fragment();
                if (routes[hash] !== undefined){
                    $container.showPage(routes[hash], false);
                }
            }
        })();

		$container.setOffset = function(percent, animate){
			$container.removeClass("animate");
			if (animate) $container.addClass("animate");

			if(Modernizr.csstransforms3d) {
                $container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
            }else if(Modernizr.csstransforms) {
                $container.css("transform", "translate("+ percent +"%,0)");
            }else{
                var px = ((panel_width*pages_count) / 100) * percent;
                $container.css("left", px + "px");
            }
		};

		$container.showPage = function(index, animate){
			current_page = Math.max(0, Math.min(index, pages_count - 1));
			$container.setOffset(-((100 / pages_count) * current_page), animate);
            setTimeout(function(){
                $.event.trigger("pagechanged", current_page);
            }, animate ? 300 : 0);
		}

		$container.next = function(){
			$container.showPage(current_page + 1, true);
		};

		$container.prev = function(){
			$container.showPage(current_page - 1, true);
		};

		resizeHandler = function(){
            panel_width = $window.width();
            $pages.width(panel_width);
            $container.width(panel_width * pages_count);
		};

		$window.on("orientationchange resize", resizeHandler);
		resizeHandler(); // call right away first time

        // Bind keys
        $window.on("keydown", function(e){
            switch(e.which){
                case KEYS.ARROW_LEFT:
                    $container.prev();
                    break;
                case KEYS.ARROW_RIGHT:
                    $container.next();
                    break;
            }
        });

		// Bind gestures (if hammer is available)
        if (typeof(Hammer) !== 'undefined'){
    		var hammer = new Hammer($container[0], { drag_min_distance: 1 });

            hammer.on("pinch pinchin pinchout", function(ev){
                ev.gesture.preventDefault();
            });

    		hammer.on("release dragleft dragright swipeleft swiperight", function(ev){
                ev.gesture.preventDefault();

                switch(ev.type) {
                    case 'dragright':
                    case 'dragleft':
                        // Stick to the finger
                        var pane_offset = -(100 / pages_count) * current_page;
                        var drag_offset = ((100 / panel_width) * ev.gesture.deltaX) / pages_count;

                        // Slow down at the first and last pane
                        if((current_page == 0 && ev.gesture.direction == "right") ||
                           (current_page == pages_count - 1 && ev.gesture.direction == "left")) {
                            drag_offset *= .4;
                        }

                        $container.setOffset(drag_offset + pane_offset);
                        break;
                    case 'swipeleft':
                        $container.next();
                        ev.gesture.stopDetect();
                        break;

                    case 'swiperight':
                        $container.prev();
                        ev.gesture.stopDetect();
                        break;

                    case 'release':
                        // More then 25% moved, navigate                    

                        if(Math.abs(ev.gesture.deltaX) > panel_width / 4) {
                            if(ev.gesture.direction == 'right') {
                                $container.prev();
                            }else{
                                $container.next();
                            }
                        }else{
                            $container.showPage(current_page, true);
                        }
                        break;
                }
            });
        }

        $(window).bind('hashchange', handleHashChange);
        handleHashChange();

        $(document).on("pagechanged", function(e, current_page){
            var $link = $("a[data-page='" + current_page + "']");
            $.bbq.pushState($link.attr('href'), 2);
        });

		return {
			showPage: function(index, animate){
				$container.showPage(index, animate);
			}
		}
	}	
};

$(function onLoad(){
    var scroller = HScroller.create("#pages"); // specify container element

    // showPage allows you to pragmatically change a change
    // the second parameter allows you specify whether you want to animate the transition

    //scroller.showPage(pagenum, true); 
});