/**
 * rangestepper.js 0.1
 *
 *
 * (c) 2014+ Radu-Sebastian Amarie
 * http://skidding.mit-license.org
 */

(function ($) {

    $.fn.rangestepper = function ( options ) {

        var settings = $.extend({
            inputName: "rangestepper",
            minVal: 0,
            maxVal: 10
        }, options );
        
        //If it doesn't have the rangestepper class, add it.
        if (!this.hasClass('rangestepper')) {
            this.addClass('rangestepper');
        }
        //Check if settings.minVal and settings.maxVal are integers
        if (!(settings.minVal === parseInt(settings.minVal, 10)) || !(settings.maxVal === parseInt(settings.maxVal, 10)))
            return;

        //Compute the number of steps required
        var steps = settings.maxVal - settings.minVal;

        //If there aren't any steps, exit.
        if (steps <= 0)
            return;

        //Create the actual steps and their value
        for (var i = 0; i <= steps; i++) {
            var newstep = $("<div class='step' data-val='" + (settings.minVal + i) + "' />");
            this.append(newstep);

            //We need a space to center them with variable space between.
            this.append(' ');
        }
        this.append('<span class="stretch"></span><div class="rangeline"></div><input type="hidden" name="' + settings.inputName + '" />');

        $(document).on('click', '.rangestepper .step', function () {
            if( !$(this).children('.dragger').length ){

                //Empty other active steps
                $('.rangestepper .step').html('');

                //Creat the active node
                $(this).html("<div class='dragger'><div class='arrow'>&#8801;</div><div class='active'></div></div>");

                //Update the current value
                $('.rangestepper input[name="' + settings.inputName + '"]').val($(this).data('val'));

            }
        });


        //==================== DRAGGABLE ====================\\
        var lastLeftOffset = 0;
        $('body').on('mousedown', '.rangestepper .dragger', function() {
            $(this).addClass('draggable').parents().on('mousemove', function(e) {
                var draggable = $('.draggable');

                if( draggable.length ){
                    lastLeftOffset = e.pageX - draggable.outerWidth() / 2;

                    draggable.offset({
                        left: lastLeftOffset
                    });
                }

            });
        }).on('mouseup', function() {
            var closestSnap = {};
            var closestSnapDiff = 9999;

            $( ".rangestepper .step" ).each(function() {
                var leftOffset = $(this).offset().left;
                var diff = lastLeftOffset - leftOffset;

                if(diff < 0){
                    diff *= -1;
                }

                if(diff <= closestSnapDiff){
                    closestSnapDiff = diff;
                    closestSnap = $(this);
                }

            });
            $('.dragger').remove();
            closestSnap.html("<div class='dragger'><div class='arrow'>&#8801;</div><div class='active'></div></div>");
            $('.rangestepper input[name="' + settings.inputName + '"]').val(closestSnap.data('val'));

        });

        return this;
    };

}(jQuery));