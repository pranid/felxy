var from_date = '2016-10-01';
var date_range = 30;

$(function () {
    setCalendarDates();
    flexibleDateGrid();

    $('[name=from_date]').val(from_date);
    if ($('[name=from_date]').val() != '') {
        from_date = $('[name=from_date]').val();
    }

    $('[name=from_date]').change(function (event) {
        from_date = $(this).val();
        flexibleDateGrid();
        setDateHead();
        $('.floating-calender').animate({left: 0}, '500');
        console.clear();
    });

    $('#find-dates').click(function (event) {
        flexibleDateGrid();
        setDateHead();
        $('.floating-calender').animate({left: 0}, '500');
        console.clear();
    });


    function setDividedDates(dates) {
        var sorted_date = new Array;
        var prev_date = null;
        var first_date = dates[0];
        var last_date = dates[(dates.length) - 1];

        if (first_date == last_date) {
            var date_range = first_date + ' to ' + last_date;
            var nights = getDays(new Date(last_date) - new Date(first_date));
            nights = (nights == 0) ? 1 : nights;
            var temp_arr = {date_range: date_range, nights: nights};
            sorted_date.push(temp_arr);
        } else {
            $.each(dates, function (index, val) {
                var diff = null;
                if (prev_date != null) {
                    diff = getDays(new Date(val) - new Date(prev_date));
                    if (diff > 1) {
                        var date_range = first_date + ' to ' + prev_date;
                        var nights = getDays(new Date(prev_date) - new Date(first_date));
                        nights = (nights == 0) ? 1 : nights;
                        var temp_arr = {date_range: date_range, nights: nights};
                        first_date = val;
                        sorted_date.push(temp_arr);
                    } else if (diff == 1 && ((dates.length) - 1 == index)) {
                        var date_range = first_date + ' to ' + val;
                        var nights = getDays(new Date(val) - new Date(first_date));
                        nights = (nights == 0) ? 1 : nights;
                        var temp_arr = {date_range: date_range, nights: nights};
                        sorted_date.push(temp_arr);
                        prev_date = null;
                    }
                }

                if (((dates.length) - 1) == index && prev_date != null) {
                    var date_range = last_date + ' to ' + val;
                    var nights = getDays(new Date(val) - new Date(last_date));
                    nights = (nights == 0) ? 1 : nights;
                    var temp_arr = {date_range: date_range, nights: nights};
                    sorted_date.push(temp_arr);
                    first_date = val;
                }
                prev_date = val;
            });
        }

        return sorted_date;
    }


    function flexibleDateGrid() {
        var currency = $('#currencies_dropdown').val();
        $('.dgrid-loader').html(loader());
        $('.dgrid-main').slideUp('600');
        $('.dgrid-loader').slideDown('600');
        $.ajax({
            url: site_url + '/api.php',
            type: 'GET',
            dataType: 'json',
            data: {
                get_details: true
            },
            success: function (res) {
                /** Column Left */
                setDetailColumn(res);
                setActionColumn(res);
                setCalendarColumn(res);

                $('.dgrid-loader').hide('500');
                $('.dgrid-main').slideDown('600');


            },
            error: function (res) {

            }
        });

    }

    function generateFlexibleDateRoomInfo(argument) {
        // body...
    }

    $('#prev,#nxt').bind("click", function () {
        var width = 70;
        var left = width * 4;

        /* Current Position of the calender */
        var current_position = parseInt($('.floating-calender').css('left'));
        current_position = (isNaN(current_position)) ? 0 : current_position;


        /** Scroll to Right */
        if (this.id == 'prev') {
            if (current_position < 0) {
                left = current_position + left;
                if (left > width) {
                    left = 0;
                    $('.floating-calender').animate({
                        left: 5
                    }, '500').stop();

                    setTimeout(function () {
                        $('.floating-calender').animate({
                            left: 0
                        }, '500').stop();
                    }, 300);
                }

                $('.floating-calender').animate({
                    left: left
                }, '500', function (e) {
                    // console.log($(this).css('left'));
                });
            } else if (current_position == 0) {
                $('.floating-calender').animate({
                    left: 5
                }, '500').stop();

                setTimeout(function () {
                    $('.floating-calender').animate({
                        left: 0
                    }, '500').stop();
                }, 300);
            }

        }
        /** Scroll to left */
        else if (this.id == 'nxt') {
            /*console.info("Scroll to left");
             console.log(Math.abs(current_position) >= 0);*/
            if (Math.abs(current_position) >= 0) {
                left = current_position - left;
                if (Math.abs(left) > 1190) {
                    left = -1200;
                    console.log("No more");
                    $('.floating-calender').animate({
                        left: -1205
                    }, '500');

                    setTimeout(function () {
                        $('.floating-calender').animate({
                            left: -1200
                        }, '500');
                    }, 300);
                }

                $('.floating-calender').animate({
                    left: left
                }, '500', function (e) {
                    // console.log($(this).css('left'));
                });
            }
        }
    });

    $('body').on('ready', '.tooltip', function (e) {
        $('.tooltip').tooltipster();
    });
});

function setCalendarDates() {
    var dates = getDates();

    var date_row_html = "";

    $.each(dates, function(index, val) {
        var weekend = (val.is_weekend) ? "weekend" : "";
        date_row_html += '<div class="date-column date '+ weekend +'"><span class="text-center" id="'+val.fmt_date.date+'">';
        date_row_html += val.fmt_date.weekDay+'<br>'+val.fmt_date.date+'<br>'+val.fmt_date.month+'</span></div>';
    });


    $('#dgrid-dates').html(date_row_html);
    var date_column_width = 70;


    var width = (date_range * date_column_width) + date_column_width + "px";
    $('.floating-calender').css('width',width);


}

function getDates() {
    var today = new Date(from_date);
    var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var dates = new Array();

    for (var i = 0; i <= date_range; i++) {
        var getDate, getMonth = '';

        if(today.getDate() < 10) { getDate = ('0'+ today.getDate());}
        else{getDate = today.getDate();}

        if(today.getMonth() < 10) { getMonth = ('0'+ today.getMonth());}
        else{getMonth = today.getMonth();}

        var row_date = {day: getDate, month: getMonth, year: today.getFullYear()};
        var fmt_date = {weekDay: weekday[today.getDay()], date: getDate, month: months[today.getMonth()]};
        var is_weekend = false;
        if (today.getDay() == 0 || today.getDay() == 6) {
            is_weekend = true;
        }
        dates.push({row_date: row_date, fmt_date: fmt_date, is_weekend: is_weekend});
        today.setDate(today.getDate() + 1);
    }
    return dates;
}


/** Convert Milliseconds into days */
function getDays(ms) {
    // ms = 86400000;
    x = ms / 1000;
    seconds = x % 60;
    x /= 60;
    minutes = x % 60;
    x /= 60;
    hours = x % 24;
    x /= 24;
    days = x;
    return days;
}


function loader() {
    return '<div class="loader">\
        <span class="dot dot_1"></span>\
        <span class="dot dot_2"></span>\
        <span class="dot dot_3"></span>\
        <span class="dot dot_4"></span>\
        </div>';
}

function setDetailColumn(data) {
    var html = "";
    $.each(data, function (i, field) {
        html += '<div class="dgrid-row">' + '<span class="grd-room-name ' + field.id + '">' + field.name + '</span></div>';
    });
    $('#detail-column').html(html);

}

function setActionColumn(data) {
    var html = "";
    $.each(data, function (i, field) {
        html += '<div class="dgrid-row">' + '<span class="grd-room-name ' + field.id + '">' + field.name + '</span></div>';
    });
    $('#action-column').html(html);

}

function setCalendarColumn(data) {
    var dates = getDates();
    var available_room = "";

    $.each(data, function (i, field) {
        var data_id = field.id;
        available_room += '<div class="dgrid-row" id="row-' + i + '">';
            $.each(dates, function (i, date_i) {
                var weekend = (date_i.is_weekend) ? "weekend" : "";
                var date = date_i.row_date.year + "-" + date_i.row_date.month + "-" + date_i.row_date.date;

                available_room += '<div class="dcal-col '+weekend+'">';
                available_room += '<input type="text" data-id="'+data_id+'" data-date="'+date+'" class="form-control input-sm"/>';
                available_room += "</div>"
            });

        available_room += "</div>"

    });

    $('#dgrid-data-column').html(available_room);
}
