$(function(){
    
    $(document).ready(recountSizes);
    $(window).resize(recountSizes);
    
    if (window.$fxj) {
        $fxj('html').on('fx_infoblock_loaded', recountSizes);
    }

    function recountSizes() {
        var ratio = 0.364;
        var full_height = $(window).height();
        $('.full-back').height(full_height-120);
        $.each($('.banner, .slider'), function(i, item) {
            var $item = $(item);
            var width = $item.width();
            $item.height(width*ratio);
        });
        var $wrapper = $('body>.wrapper');
        ///var top_padding = $wrapper.css('padding-top').replace(/[^\d]+/g,'');
        $wrapper.css({
            'min-height': (full_height - 1 )+'px',
            'padding-bottom': $('>footer', $wrapper).outerHeight()-3+'px'
        });
    }
    
    toggleIconPane($('form.fx_form_sent').closest('li.icon'));
    
    function desk () {

        $('nav .main-menu').css('width', 'auto');
        $('html').on('mouseover.res', 'nav .main-menu .main-menu-item', function (e) {
            if ($('.main-menu .fx_selected').length > 0) {
                return;
            }
            show_menu_item($(this));
        });
        var menu_timeout;
        var menu_delay = 200;
        var menu_frozen = false;
        
        function freeze_menu() {
            clearTimeout(menu_timeout);
            menu_frozen = true;
        }
        
        function unfreeze_menu() {
            menu_frozen = false;
            //var $active = $('nav .main-menu .main-menu-item.active');
            //hide_menu_item($active);
        }
        
        function show_menu_item($item, delay) {
            if (delay === undefined) {
                delay = menu_delay;
            }
            clearTimeout(menu_timeout);
            if (menu_frozen) {
                return;
            }
            var show_closure = function() {
                $('nav .main-menu .main-menu-item.active').removeClass('active');
                $item.addClass('active');
                var $sub = $('ul.sub-menu', $item).first();
                var left_offset = $item.offset().left + ($item.width() / 2) - ($sub.width() / 2);
                $sub.css('margin-left', left_offset);
            };
            if (delay === 0) {
                show_closure();
                return;
            }
            menu_timeout = setTimeout(show_closure, delay);
        }
        
        function hide_menu_item($item) {
            clearTimeout(menu_timeout);
            if (menu_frozen) {
                return;
            }
            menu_timeout = setTimeout(
                function() {
                    $item.removeClass('active');
                }, menu_delay
            );
        }
        


        $('html').on('mouseout.res', 'nav .main-menu .main-menu-item', function (e) {
            if ($('.main-menu .fx_selected').length > 0) {
                return;
            }
            hide_menu_item($(this));
        });
        
        if (!window.$fxj) {
            return;
        }
        
        
        $fxj('html').on('fx_select', 'nav .main-menu .dropdown', function(e) {
            show_menu_item($(this), 0);
        });
        $fxj('html').on('fx_deselect', 'nav .main-menu .dropdown', function(e) {
            hide_menu_item($(this));
        });
        
        $fxj('html').on('fx_expand_inline_adder fx_select', function(e) {
            freeze_menu();
        });
        $fxj('html').on('fx_collapse_inline_adder fx_deselect', function(e) {
            if ($('.main-menu .fx_selected').length > 0) {
                return;
            }
            unfreeze_menu();
        });
        
        $fxj('html').on('fx_select', 'li.icon', function() {
            showIconPane($(this));
        });
    }

    function mob () {

        $('html').on('click.res', 'nav .menu-icon', function (e) {
            var ul = $(this).parent().find('.main-menu');
            if (!ul.hasClass('active'))
                ul.addClass('active');
            else
                ul.removeClass('active');
        });

        $('html').on('click.res', 'nav .main-menu .main-menu-item.dropdown a .more', function (e){
            e.preventDefault();
            var menu = $(this).closest('.main-menu-item');
            if (!menu.hasClass('active')) {
                menu.addClass('active');
                $(this).text('-');
            }
            else {
                menu.removeClass('active');
                $(this).text('+');
            }
        });

        $('html').on('click.res', 'nav .main-menu .close', function (e){
            var menu = $(this).parent();
            if (!menu.hasClass('active')) {
                menu.addClass('active');
            }
            else {
                menu.removeClass('active');
            }

        });

        function setMenuWidth() {
            var width = $(window).width();
            $('nav .main-menu').width(width);
        }
        $(document).on('ready.res', setMenuWidth);
        $(window).on('resize.res', setMenuWidth);
    }
    
    function showIconPane($node) {
        $('.icon').removeClass('active');
        $node.addClass('active');
        $node.find('form input').not('[type="hidden"]').eq(0).focus();
        $('html').on('click.clickover', '*', function(e) {
            if (!$.contains($node.get(0), e.target)) {
                hideIconPane($node);
            }
        });
        $node.off('keydown').on('keydown', function(e) {
            if (e.which === 27) {
                hideIconPane($node);
            }
        });
    }
    
    function hideIconPane($node) {
        $node.removeClass('active');
        $('html').off('click.clickover');
    }
    
    function toggleIconPane($node) {
        if (!$node || $node.length === 0) {
            return;
        }
        if (!$node.hasClass('active')) {
            showIconPane($node);
        } else {
            hideIconPane($node);
        }
    };
    
    $('html').on('click', '.icon > a', function (e) {
        toggleIconPane($(this).parent());
    });

    function WidthChange(mq) {
        $('html').off('.res');
        $(document).off('.res');
        $(window).off('.res');
        if (mq.matches) {
            mob();
        } else {
            desk();
        }
    }

    if (window.matchMedia) {
        var mq = window.matchMedia("(min-width:320px) and (max-width:1000px)");
        mq.addListener(WidthChange);
        WidthChange(mq);
    }


window.keyScroll = {
    active: true,
    _speed: 300,
    _distance: 550,
    speed: function(speed) {
        this._speed = speed;
        return this;
    },
    distance: function(distance) {
        this._distance = distance;
        return this;
    },
    init: function() {
        $('html').on('keydown', function(e) {
            return keyScroll.handle(e);
        });
    },
    handle: function(e) {
        if (!this.active) {
            return;
        }
        if (e.which === 40) {
            this.move('down');
            return false;
        } else if (e.which === 38) {
            this.move('up');
            return false;
        }
    },
    off: function () {
        this.active = false;
    },
    on: function() {
        this.active = true;
    },
    move: function(dir) {
        $('body').scrollTo( (dir === 'up' ? '-' : '+') + '='+this._distance+'px', this._speed);
        return this;
    },
    up:function() {
        this.move('up');
        return this;
    },
    down:function(){
        this.move('down');
        return;
    }
};
//window.keyScroll.init();

});