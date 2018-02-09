/**
 * JS library: Calc Averages Gesco Extension
 * Require jQuery to run
 * Free to use and edit with this doc
 * Contact me for help: progettialessandro(at)gmail.com
 */

if (window.location.href.indexOf("https://gesco.bearzi.it/") == 0) {
    $(document).ready(function() {
        $valutazioniNew = $('[data-scheda="valutazioni-new"]');
        if($valutazioniNew.length) {
            replaceTable($(document).find('[data-scheda="valutazioni-new"] table'));
            calcAverages();
        }

        checkUpdate();
        notify();
    });

    $(document)
        .on('click', '.mark-el .mark-content', function() {
            $(this).parent().toggleClass('no-calc');
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

    function createTable($content) {
        var tempMark, tempAverage;
        var subjects = getSubjects();
        $table = $('<table />').addClass('average-table table table-bordered table-striped table-hover');
        $tbody = $table.append('<tbody />');
        $.each(subjects, function(idx, el) {
            $row = $('<tr />');
            $row.append('<td class="subject-name center-vert col-sm-2">' + el.name + '</td>');

            $.each(el.marks, function(idx, mark) {
                tempMark = mark.mark;
                $row.append('' +
                    '<td class="text-center mark-el" data-value="' + mark.mark + '" data-percentage="' + mark.percentage + '">' +
                    '   <span class="mark-content d-block">' +
                    '       <span style="font-size: small;">' + mark.time + '</span><br />' +
                    '       <span class="label label-' + (tempMark<6 ? 'warning' : 'success') + '">' + mark.mark + '</span><br />' +
                    '       <span class="data" style="font-size: small;">(' + mark.percentage + '%)</span><br />' +
                    '   </span>' +
                    '   <button class="btn btn-default fa fa-info mark-info" style="" onclick="' + mark.onclick + '"></button>' +
                    '</td>');
            });

            for(var i=0;i<subjects.maxNumMarks-el.marks.length; i++)
                $row.append('<td></td>');

            // Add average column
            $row.append('<td class="average center-vert text-center"><span class="label"></span></td>');

            $tbody.append($row);
        });

        $content.empty();
        $table.append($tbody);
        $content.append($table);
    }

    function replaceTable($table) {
        var tempMark, tempAverage;
        var subjects = getSubjects();
        $table = $table.addClass('average-table');
        $tbody = $('<tbody />');
        $.each(subjects, function(idx, el) {
            $row = $('<tr />');
            $row.append('<td class="subject-name center-vert col-sm-2">' + el.name + '</td>');

            $.each(el.marks, function(idx, mark) {
                tempMark = mark.mark;
                $row.append('' +
                    '<td class="text-center mark-el" data-value="' + mark.mark + '" data-percentage="' + mark.percentage + '">' +
                    '   <span class="mark-content d-block">' +
                    '       <span style="font-size: small;">' + mark.time + '</span><br />' +
                    '       <span class="label label-' + (tempMark<6 ? 'warning' : 'success') + '">' + mark.mark + '</span><br />' +
                    '       <span class="data" style="font-size: small;">(' + mark.percentage + '%)</span><br />' +
                    '   </span>' +
                    '   <button class="btn btn-default fa fa-info mark-info" style="" onclick="' + mark.onclick + '"></button>' +
                    '</td>');
            });

            for(var i=0;i<subjects.maxNumMarks-el.marks.length; i++)
                $row.append('<td></td>');

            // Add average column
            $row.append('<td class="average center-vert text-center"><span class="label"></span></td>');

            $tbody.append($row);
        });

        $table.empty();
        $table.append($tbody);
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
                    percentage: tempData.last().html().replace('(', '').replace(')', '').replace('%', ''),
                    onclick: $mark.attr('onclick')
                });
            }
        });
        return marks;
    }

    function calcAverages() {
        var tempMark, tempMarksSum, tempPercentageSum;
        $table = $('.average-table');
        $subjects = $table.find('tr');
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
            $subject.find('.average .label')
                .removeClass('label-warning')
                .removeClass('label-danger')
                .addClass('label-' + (tempMark<6 ? 'warning' : 'success'))
                .html(tempMark);
        });
    }

    function checkUpdate() {
        if(!chrome.storage)
            return;

        var storage = chrome.storage.sync;
        var lastUpdate = storage.get("gescoLastLocalUpdate", function(data) {
            var lastLocalUpdate = data.gescoLastLocalUpdate;
            if(!lastLocalUpdate || Date.now() > (lastLocalUpdate+(60*60*24*100))) {
            // if(true) {
                var data = new FormData();

                $.ajax({
                    url: "https://raw.githubusercontent.com/AleProjects/Calc-Averages-Gesco-Extension/master/manifest.json",
                    type: "get",
                    dataType: "json",
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function (data, status) {
                        var manifestData = chrome.runtime.getManifest();
                        if(manifestData.version != data.version) {
                            storage.set({"gescoLastLocalUpdate": Date.now()}, function () {
                                notifyUpdate();
                            });
                        }
                    },
                    error: function (xhr, desc, err) {
                        console.log(xhr);
                        console.log(desc);
                        console.log(err);
                        notifyNoConnection();
                    }
                });

                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            }
        })
    }

    function notifyUpdate() {
        chrome.runtime.sendMessage({type: "update-notification"}, function(){});
    }

    function notifyNoConnection() {
        chrome.runtime.sendMessage({type: "update-error-notification"}, function(){});
    }

    function notify(title, message) {
        var opt = {
            type: "basic",
            title: title,
            message: message
        };
        chrome.runtime.sendMessage({type: "notification", opt: opt}, function(){});
    }
}