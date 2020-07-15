$(function () {

    //datepicker init for date input fields
    var date = new Date();

    $('.dateInput').each(function () {
        $(this).datepicker({
            dateFormat: 'dd.mm.yy',
            maxDate: date,
            defaultDate: date
        }).datepicker('setDate', date);
    });


    //education select input init
    $.get("https://cors-anywhere.herokuapp.com/http://stistko.uiv.cz/katalog/textdata/C10837BADV.xml").done(function (data) {

        var $xml = $(data);
        //find education options in xml
        var $educationOptions = $xml.find('veta');

        //add education options to select
        $educationOptions.each(function(){
            var text = $(this).find('TXT').text();
            var value = $(this).find('KOD').text();

            $('#education').append(new Option(text, value))
        });
    });
});