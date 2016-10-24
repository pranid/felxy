    var from_date = '2016-10-01';
$(function() {
    setDateHead();
    flexibleDateGrid();
    
    $('[name=from_date]').val(from_date);
    if($('[name=from_date]').val() != '') {
        from_date = $('[name=from_date]').val();
    }
    
    $('[name=from_date]').change(function(event) {
        from_date = $(this).val();
        flexibleDateGrid();
        setDateHead();
        $('.floating-calender').animate({left: 0}, '500');
        console.clear();
    });

    $('#find-dates').click(function(event) {
        flexibleDateGrid();
        setDateHead();
        $('.floating-calender').animate({left: 0}, '500');
        console.clear();
    });

    



    $('body').on('click', '.btn-book-now, .qnty-booknow', function(event) {
        event.preventDefault();
        var all_dates = new Array;

        // var data = {selected_dates:selected_dates,room_id:room_id};
        if($(this).hasClass('btn-book-now')) {
            var trig_class = $(this).attr('trig-class');
            var room_data = getSelectedRooms(trig_class);
            var get_dates = room_data.selected_dates;

            var dates_sorted = setDividedDates(get_dates);
            var room_id   = room_data.room_id;
            var room_name = $('.'+room_id).text();
            var quantity = $(this).parent().find('.bkn-select').val();

            var build_data = {room_id:room_id,room_name:room_name,dates_sorted:dates_sorted,quantity:quantity};
            all_dates.push(build_data);

            
        }else if($(this).hasClass('qnty-booknow')) {
            $('.btn-book-now').each(function(index, el) {
                if($(this).is(":not(:disabled)")) {
                    var trig_class = $(this).attr('trig-class');
                    var room_data = getSelectedRooms(trig_class);
                    var get_dates = room_data.selected_dates;

                    var dates_sorted = setDividedDates(get_dates);
                    var room_id   = room_data.room_id;
                    var room_name = $('.'+room_id).text();
                    var quantity = $(this).parent().find('.bkn-select').val();

                    var build_data = {room_id:room_id,room_name:room_name,dates_sorted:dates_sorted,quantity:quantity};
                    all_dates.push(build_data);
                    
                }

            });
        }

        
        var tb_html = '';

        $.each(all_dates, function(index, val) {
            // console.log(val);
            tb_html += '<tr><th colspan="3">'+val.room_name+'</th></tr>';
            tb_html += '<tr>\
            <td>Booking Dates</td>\
            <td>No of Nights</td>\
            <td>No of Rooms</td>\
            </tr>';
            $.each(val.dates_sorted, function(index, cval) {
                tb_html += '<tr>\
                <td>'+cval.date_range+'</td>\
                <td>'+cval.nights+'</td>\
                <td>'+val.quantity+'</td>\
                </tr>';

            });
        });
        $('#bkin-cnfm-tbl > tbody').html(tb_html);
        
        all_dates.push({hotel_id:hotel_id});

        $('input[name=bk_data_from]').val('muliple-booking');
        $('input[name=bk_data]').val(JSON.stringify(all_dates));

        $('#book-now-model').modal('show');
    });

    /** Room Table Book Now :: Select dropdown triger */
    $('.book-quantity').change(function(event) {
        var book_now = $(this).parent().children('.book-now');
        if($(this).val() == '') {
            book_now.prop('disabled', true);
        }else{
            book_now.prop('disabled', false);
        }
    });

    /** Room Table Book Now :: book now button triger */
    $('.book-now').click(function(event) {
        var quantity = $(this).parent().children('.book-quantity').val();
        var room_id = $('.room_id').val();
        
        var date_range = $('.check_in_date').val() +' to '+ $('.check_out_date').val();
        
        var form_data = {
            hotel_id:hotel_id,
            room_id:room_id,
            quantity:quantity,
            check_in:$('.check_in_date').val(),
            check_out:$('.check_out_date').val(),
            no_nights:$('.no_of_nights').val()
        };
        form_data = JSON.stringify(form_data); 
        
        $('input[name=bk_data_from]').val('single-booking');
        $('input[name=bk_data]').val(form_data);
        

        tb_html = '<tr><th colspan="3">'+$('.room_name').val()+'</th></tr>';
        tb_html += '<tr>\
        <td>Booking Dates</td>\
        <td>No of Nights</td>\
        <td>No of Rooms</td>\
        </tr>';
        tb_html += '<tr>\
        <td>'+date_range+'</td>\
        <td>'+$('.no_of_nights').val()+'</td>\
        <td>'+quantity+'</td>\
        </tr>';

        

        $('#bkin-cnfm-tbl > tbody').html(tb_html);
        $('#book-now-model').modal('show');
    });

    $('body').on('change', '.bkn-select', function(event) {
        event.preventDefault();
        var trig_class = $(this).parent().children('.btn-book-now').attr('trig-class');
        var get_dates = getSelectedRooms(trig_class);
        if($(this).val() == '' || get_dates.length == 0) {
            $(this).parent().children('.btn-book-now').prop('disabled', true);
        }else{
            $(this).parent().children('.btn-book-now').prop('disabled', false);
        }

        // qnty-booknow
        var em = 0;
        $('.bkn-select').each(function(index, el) {

            if($(this).val() != '') {
                em++;
            }

        });

        if(em > 0) {
            $('.qnty-booknow').prop('disabled', false);
        }else{
            $('.qnty-booknow').prop('disabled', true);
        }
    });

    
    function setDividedDates(dates) {
        var sorted_date = new Array;
        var prev_date = null;
        var first_date = dates[0];
        var last_date = dates[(dates.length) -1];

        if(first_date == last_date) {
            var date_range = first_date +' to '+ last_date;
            var nights = getDays(new Date(last_date) - new Date(first_date));
            nights = (nights == 0) ? 1 : nights;
            var temp_arr = {date_range:date_range,nights:nights};
            sorted_date.push(temp_arr);
        }else{
            $.each(dates, function(index, val) {
                var diff = null;
                if(prev_date != null){
                    diff = getDays(new Date(val) - new Date(prev_date));
                    if(diff > 1) {
                        var date_range = first_date +' to '+prev_date;
                        var nights = getDays(new Date(prev_date) - new Date(first_date));
                        nights = (nights == 0) ? 1 : nights;
                        var temp_arr = {date_range:date_range,nights:nights};
                        first_date = val;
                        sorted_date.push(temp_arr);
                    }else if(diff == 1 && ((dates.length) -1 == index)){
                        var date_range = first_date +' to '+ val;
                        var nights = getDays(new Date(val) - new Date(first_date));
                        nights = (nights == 0) ? 1 : nights;
                        var temp_arr = {date_range:date_range,nights:nights};
                        sorted_date.push(temp_arr);
                        prev_date = null;
                    }
                }

                if(((dates.length) -1) == index && prev_date != null){
                    var date_range = last_date +' to '+ val;
                    var nights = getDays(new Date(val) - new Date(last_date));
                    nights = (nights == 0) ? 1 : nights;
                    var temp_arr = {date_range:date_range,nights:nights};
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
            url: site_url + '',
            type: 'POST',
            dataType: 'json',
            data: {
                hotel_id: hotel_id,
                from_date: from_date,
                currency:currency
            },
            success: function(res) {
                if(res.data != null) {
                    var room_type = "";
                    var result = res.data;

                    /** Column Left */
                    $.each(result, function(i, field) {
                        room_type += '<div class="dgrid-row"><span class="grd-room-name '+ field.room_id +'">' + field.room_name + '</span>';
                        room_type += '<span class="btn btn-xs btn-default pull-right view-room-type simple-tooltip" id="'+ field.room_id +'" title="View"><i class="glyphicon glyphicon-eye-open"></i></span>';
                        room_type += '<span class="grd-facility-name">Room Facilities</span><span class="grd-room-facilities">'+field.room_facilities+'</span>';
                        // room_type += '<span class="grd-facility-name">Room Feature</span>';
                        room_type += '<span class="room-feat-main">';
                        if(parseInt(field.no_of_children) == 0) {
                            room_type += '<span class="simple-tooltip rm-adult-only" title="Maximum '+field.no_of_adults+' Adult(s)"></span>';
                        }else{
                            room_type += '<span class="simple-tooltip rm-adult-child" title="Maximum '+field.no_of_adults+' Adult(s) & '+field.no_of_children+' Children"></span>';
                        }
                        room_type += '<span class="simple-tooltip rm-night" title="Minimum 1 Night"></span>';
                        
                        room_type += '</div>';
                    });

                    $('#room-type').html(room_type);
                    var available_room = '';
                    var book_now_button = '';

                    $.each(result, function(i, field) {
                        available_room += '<div class="dgrid-row" id="row-'+i+'">';
                        var max_rooms = 1;

                        var room_count = '';
                        for (var a = 0; a < field.reserved_info.length; a++) {
                            var day = new Date(field.reserved_info[a].date).getDay();
                            room_count += '<div class="available-room';

                            /* Hightlight Weekend */
                            if (day == 0 || day == 6) {
                                room_count += ' weekend">';
                            }else{
                                room_count += '">';
                            }


                            room_count += '<span class="available-room-child">';


                            if(field.reserved_info[a].available == 0) {
                                room_count += '<span class="not-available">SOLD</span>';
                            }else{
                                max_rooms = parseInt(field.reserved_info[a].available);

                                var offer_head  = '<span class="hot-deal">HOT</span>';
                                var checkbox    = '<span class="check-room"><input type="checkbox" class="form-control room-check-'+(i+1)+'" data-room="'+field.reserved_info[a].room_id+'"  data-date="'+field.reserved_info[a].date+'" onChange="freezDate($(this));"/></span>';
                                var price_tag   = '';
                                var new_price   = 0

                                /* If Offers are avaialble */
                                if(field.offer != null) {
                                    var rm_date = new Date(field.reserved_info[a].date);
                                    var off_date = new Date(field.offer['offer_enddate']);
                                    if(rm_date <= off_date) {

                                        var price = parseFloat(field.room_rate);
                                        new_price = price - ((price*parseFloat(field.offer['discount'])) / 100);
                                        new_price = Math.round(new_price,2);

                                        room_count += '<span class="offer-rate"><small>' + field.offer['discount'] + '%</small></span>';
                                        // price_tag = '<span class="old-price">'+mkNum(price)+'<br><small>'+field.currency+'</small></span><span class="new-price simple-tooltip" title="'+mkNum(new_price)+' '+field.currency+'">'+mkNum(new_price)+'<br><small>'+field.currency+'</small></span>';
                                        price_tag = '<span class="new-price simple-tooltip" title="'+mkNum(new_price)+' '+field.currency+'">'+mkNum(new_price)+'<br><small>'+field.currency+'</small></span>';
                                        room_count += price_tag;
                                        room_count += checkbox;
                                    }else{
                                        room_count += '<span class="room_rate simple-tooltip" title="'+field.room_rate_formated+'">' + mkNum(field.room_rate) +'<br><small>'+field.currency+'</small></span>';
                                        room_count += checkbox;    
                                    }

                                }else{
                                    room_count += '<span class="room_rate simple-tooltip" title="'+field.room_rate_formated+'">' + mkNum(field.room_rate) +'<br><small>'+field.currency+'</small></span>';
                                    room_count += checkbox;
                                }



                            }
                            room_count += '</span>';
                            room_count += '</div>';
                        }

                        var offer_text = '';

                        if(max_rooms < 10 && max_rooms >= 5) {
                            offer_text = "<small><span class='text-success text-center'>Limited Rooms.</span></small>";
                        }else if(max_rooms <= 5) {
                            offer_text = "<small><span class='text-danger text-center'>Last "+max_rooms+" Rooms.</span></small>";
                        }
                        book_now_button += '<div class="dgrid-row">';
                        book_now_button += '<span class="book-now-container">';
                        book_now_button += offer_text;
                        book_now_button += '<select class="input-sm form-control bkn-select bkn-room-count-'+(i+1)+'" >';
                        book_now_button += '<option value="">No of Rooms</option>';
                        for (var x = 0; x < max_rooms; x++) {
                            book_now_button += '<option value="'+(x+1)+'">'+(x+1)+'</option>';
                        }
                        book_now_button += '</select>';
                        book_now_button += '<button class="btn btn-success btn-sm btn-book-now" disabled="true" trig-class="room-check-'+(i+1)+'">Book Now</button></span>';
                        book_now_button += '</div>';

                        available_room += room_count;
                        available_room += '</div>';



                    });
$('#dgrid-available').html(available_room);
$('#book-now-main').html(book_now_button);
Tipped.create('.simple-tooltip');
$('.dgrid-loader').hide('500');
$('.dgrid-main').slideDown('600');
}else{
    $('.dgrid-loader').hide('500');
    $('.dgrid-loader').html('<p class="text-center text-warning no-rooms-msg">Sorry, There are no avaiable rooms</p>');
    $('.dgrid-loader').show('500');
}

},
error: function(res) {

}
});

}

function generateFlexibleDateRoomInfo(argument) {
        // body...
    }

    $('#prev,#nxt').bind("click", function() {
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

                    setTimeout(function() {
                        $('.floating-calender').animate({
                            left: 0
                        }, '500').stop();
                    }, 300);
                }

                $('.floating-calender').animate({
                    left: left
                }, '500', function(e) {
                    // console.log($(this).css('left'));
                });
            }else if(current_position == 0){
                $('.floating-calender').animate({
                    left: 5
                }, '500').stop();

                setTimeout(function() {
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

                    setTimeout(function() {
                        $('.floating-calender').animate({
                            left: -1200
                        }, '500');
                    }, 300);
                }

                $('.floating-calender').animate({
                    left: left
                }, '500', function(e) {
                    // console.log($(this).css('left'));
                });
            }
        }
    });

    $('body').on('ready', '.tooltip', function(e) {
        $('.tooltip').tooltipster();
    });
});

function setDateHead() {
    var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    var today = new Date(from_date);
    var dateDiv = "";

    for (var i = 0; i <= 27; i++) {
        tempToDate = weekday[today.getDay()] + "<br>" + today.getDate() + "<br>" + months[today.getMonth()];

        if (today.getDay() == 0 || today.getDay() == 6) {
            dateDiv += "<div class='date-column date weekend'>";
        } else {
            dateDiv += "<div class='date-column date'>";
        }

        dateDiv += "<span class='text-center' id='" + today.getDate() + "'>" + tempToDate + "</span>";
        dateDiv += "</div>";
        today.setDate(today.getDate() + 1);
    }

    // console.log(dateDiv);
    $('#dgrid-dates').html(dateDiv);
}

/**
 * 
 */
 function freezDate(el) {

    var el_class = el.attr('class');
    el_class = el_class.split(" ")[1];
    var count = $("."+el_class+":checked").length;
    if(count >= 10) {
        $("."+el_class+":not(:checked)").prop('disabled',true);
    }else{
        $("."+el_class+":not(:checked)").prop('disabled',false);
    }
    
    $('.btn-book-now').each(function(index, el) {
        var room_c_val = $(this).parent().children('.bkn-select').val();
        if(($(this).attr('trig-class') == el_class)) {
            if(count > 0 && room_c_val != '') {
                $(this).prop('disabled', false);
            }else{
                $(this).prop('disabled', true);
            }
        }
    });

}

function mkNum(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
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

function getSelectedRooms(trig_class) {
    var selected_dates = new Array;
    var room_id = null;
    $('.'+trig_class).each(function(index, el) {
        if($(this).is(':checked')) {
            selected_dates.push($(this).attr('data-date'));
            room_id = $(this).attr('data-room');
        }
        // console.log($(this).attr('data-date'));
    });
    var data = {selected_dates:selected_dates,room_id:room_id};
    return data;
}