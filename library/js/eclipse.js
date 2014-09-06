;(function ( $, window, document, undefined ) {
    var pluginName = "eclipse",
        defaults = {
            stage: "value"
        };
    function Plugin( element, options ) {
        this.$element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            // Make wrapper
            this.$wrapper = $('<div class="eclipse-wrapper"></div>').css('height', $(window).height());
            this.$wrapper.appendTo(this.$element);
            // Make line and hide it
            this.$lineWrapper = $('<div class="eclipse-line-wrapper"><div class="eclipse-line-object"></div></div>');
            this.$lineWrapper.appendTo(this.$wrapper); 
            this.$lineObject = this.$lineWrapper.find('.eclipse-line-object'); 
            // Make circle and hide it
            this.$circleWrapper = $('<div class="eclipse-circle-wrapper"><div class="eclipse-circle-object"><div class="eclipse-circle-fill"></div></div></div>')
            .hide(); 
            this.$circleWrapper.appendTo(this.$wrapper); 
            this.$circleObject = this.$circleWrapper.find('.eclipse-circle-object');
            this.$circleFill = this.$circleWrapper.find('.eclipse-circle-fill');

            $('#text .content').css('opacity', 0);

            var that = this; 
            setTimeout(function(){
                that.initFirstStage();
            }, 500);
        },
        initFirstStage: function(el, options) {
            this.$lineObject.velocity({
                translateX: ['0%', '-100%']
            }, {
                duration: 1000, 
                easing: 'easeOutQuad', 
                display: 'block',
                complete: $.proxy(this.firstStageLoading, this)
            });
        },
        firstStageLoading: function(el, options) {
            this.$circleWrapper.show(); 
            this.$circleObject.velocity({
              scale: [1, 0]
            }, 400, 'easeOutElastic');
            this.$circleFill.velocity({
                translateX: ['-5%', '-100%']
            }, 2000, 'linear', $.proxy(this.endFirstStage, this)); 
        },
        endFirstStage: function(el, options) {
            this.$lineObject.velocity({
                translateX: ['100%', '0%']
            }, 1000, 'easeOutExpo');
            this.$circleFill.velocity({
                translateX: '0%'
            }, 1000, 'easeOutQuad'); 
            
            this.$wrapper.addClass('eclipse-is-stage2');
            this.$circleObject.velocity({
                scale: [1.25, 1]
            }, {
                duration: 750, 
                easing: 'easeOutQuad', 
                delay: 300,
                complete: $.proxy(this.secondStageLoading, this)
            });
        },
        secondStageLoading: function(el, options){
            var that = this; 
            var count = 0; 
            function bounce(){
                if(count > 2){
                    that.$circleObject.velocity({
                        scale: 0 
                    }, {
                        duration: 700, 
                        easing: 'easeInQuad'
                    });

                    that.$wrapper.velocity({
                        translateY: ['-100%', '0%']
                    }, {
                        delay: 700,
                        duration: 1200, 
                        easing: 'easeOutExpo'
                    });
                    $('#text .content').velocity({
                        translateY: ['0%', '-50%'],
                        opacity: [1, 0]
                    }, {
                        delay: 700,
                        duration: 1500, 
                        easing: 'easeOutExpo'
                    });
                }else{
                    that.$circleObject.velocity({
                        scale: 0.5 
                    }, {
                        duration: 750, 
                        easing: 'easeInQuad',
                        complete: function(){
                            that.$circleFill.velocity({
                                scale: '-=0.33'
                            }, 250, 'easeOutQuart');      
                        }
                    })
                    .velocity({
                        scale: 1.25 
                    }, {
                        duration: 750, 
                        easing: 'easeOutQuad',
                        complete: bounce
                    });  
                    count++;            
                }
            }
            bounce(); 
        }
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };
})( jQuery, window, document );