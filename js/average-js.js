if (window.location.href.indexOf("https://gesco.bearzi.it/") == 0) {
    $(document).ready(function() {
        $valutazioniNew = $('[data-scheda="valutazioni-new"]');
        if($valutazioniNew.length) {
            $('body .container-fluid').first().find('.row div').prepend('<button id="create-averages" class="float-right btn btn-success d-inline calc-average" style="position: absolute; right: 20px;" data-toggle="modal" data-target="#averagesModal">Calcola media</button>');

            // Create modal
            $modal = $('' +
                '<div class="modal fade bd-example-modal-lg" id="averagesModal" tabindex="-1" role="dialog" aria-labelledby="averagesModalLabel" aria-hidden="true">' +
                '   <div class="modal-dialog modal-lg">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                   <span aria-hidden="true">&times;</span>' +
                '               </button>' +
                '               <h5 class="modal-title">Calcolo delle medie</h5>' +
                '           </div>' +
                '       <div class="modal-body"></div>' +
                '   </div>' +
                '</div>');
            $('body').append($modal);
            createTable();
            calcAverages();
        }
    });

    $(document)
        .on('click', '.mark-el', function() {
            $(this).toggleClass('no-calc');
        })
        .on('click', '.calc-average, .mark-el', function() {
            calcAverages();
        });

    function getSubjects() {
        var subjects = [];
        var subject;
        var tempMark;
        var tempPercentage;
        $valutazioniNew = $('[data-scheda="valutazioni-new"]');
        if($valutazioniNew.length) {
            $subjects = $valutazioniNew.find('tbody tr');
            $.each($subjects, function(idx, subject) {
                $subject = $(subject);

                subjects.push({
                    name: $subject.find('td').first().html(),
                    marks: getMarks($subject)
                });
            });
        }
        subjects.maxNumMarks = 0;
        $.each(subjects, function(idx, subject) {
            if(subjects.maxNumMarks<subject.marks.length)
                subjects.maxNumMarks = subject.marks.length
        });
        return subjects;
    }

    function createTable() {
        var tempMark, tempAverage;
        var subjects = getSubjects();
        $modal = $('#averagesModal');
        $body = $modal.find('.modal-body');
        $table = $('<table />').addClass('average-table table table-bordered table-striped table-hover');
        $tbody = $table.append('<tbody />');
        $.each(subjects, function(idx, el) {
            $row = $('<tr />');
            $row.append('<td class="subject-name center-vert col-sm-2">' + el.name + '</td>');

            $.each(el.marks, function(idx, mark) {
                tempMark = mark.mark;
                $row.append('<td class="text-center mark-el" data-value="' + mark.mark + '" data-percentage="' + mark.percentage + '">' +
                    '<span style="font-size: small;">' + mark.time + '</span><br />' +
                    '<span class="label label-' + (tempMark<6 ? 'warning' : 'success') + '">' + mark.mark + '</span><br />' +
                    '<span class="data" style="font-size: small;">(' + mark.percentage + '%)</span>' +
                    '</td>');
            });

            for(var i=0;i<subjects.maxNumMarks-el.marks.length; i++)
                $row.append('<td></td>');

            // Add average column
            $row.append('<td class="average"><br /><span class="label"></span></td>');

            $tbody.append($row);
        });

        $body.empty();
        $table.append($tbody);
        $body.append($table);
    }

    function getMarks($subject) {
        var tempData, tempMark;
        var marks = [];
        $marks = $subject.find('td');
        $.each($marks, function(idx, mark) {
            $mark = $(mark);
            tempMark = $mark.find('span.label').html();
            tempData = $mark.find('span.data');
            if(tempMark) {
                marks.push({
                    time: tempData.first().html(),
                    mark: tempMark.replace(' *', ''),
                    percentage: tempData.last().html().replace('(', '').replace(')', '').replace('%', '')
                });
            }
        });
        return marks;
    }

    function calcAverages() {
        var tempMark, tempMarksSum, tempPercentageSum;
        $modal = $('#averagesModal');
        $subjects = $modal.find('table tr');
        $.each($subjects, function(idx, subject) {
            $subject = $(subject);
            $marks = $subject.find('.mark-el:not(.no-calc)');
            tempMarksSum = 0;
            tempPercentageSum = 0;
            $.each($marks, function (idx, mark) {
                $mark = $(mark);
                tempMarksSum += $mark.data('value')*$mark.data('percentage');
                tempPercentageSum += $mark.data('percentage');
            });
            tempMark = Math.floor(tempMarksSum/tempPercentageSum*100)/100;
            console.log(tempMark);
            $subject.find('.average .label')
                .removeClass('label-warning')
                .removeClass('label-danger')
                .addClass('label-' + (tempMark<6 ? 'warning' : 'success'))
                .html(tempMark);
        });
    }
}