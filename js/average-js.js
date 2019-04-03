/**
 * JS library: Calc Averages Gesco Extension
 * Require jQuery to run
 * Free to use and edit with this doc
 * Contact me for help: progettialessandro(at)gmail.com
 */

var updateAverages = function () {
    var table = $('#tabella-valutazioni_wrapper #tabella-valutazioni');

    $.each(table.find('.valutazione-riga'), function (idx, el) {
        el = $(el);

        var total = {
            mark: 0,
            percentage: 0,
        };

        $.each(el.find('.valutazione.selected'), function (idx, el) {
            el = $(el);

            var mark = el.attr('data-valutazione');
            var percentage = el.attr('data-peso');

            total.mark += mark * percentage;
            total.percentage += percentage * 1;

        });

        var mark = Math.floor(total.mark / total.percentage * 100) / 100;

        if (el.find('.average').length === 0) {
            el.append($('' +
                '<td class="text-center average">' +
                '   <div class="valutazione-label" style="display: flex; min-height: 78px;">' +
                '       <div class="label" style="margin: auto;"></div>' +
                '   </div>' +
                '</td>'));
        }

        el.find('.average .label')
            .html(mark)
            .removeClass('label-success')
            .removeClass('label-danger')
            .removeClass('label-warning')
            .addClass('label-' + (mark < 4 ? 'danger' : mark < 6 ? 'warning' : 'success'));
    });
};

if (window.location.href.indexOf("https://gesco.bearzi.it") === 0) {
    $(function () {
        updateAverages();

        $(document)
            .on('click', '.valutazione .valutazione-label', function () {
                var el = $(this);

                el.parent().toggleClass('selected');

                updateAverages();
            })
    });
}