// Wait for the DOM to be ready
$(function () {

    //set validation error messages position
    $.validator.setDefaults({
        //specify the error message display position
        errorPlacement: function (error, element) {
            $(error).insertBefore(element);
        }
    });

    //create new rule for name field (at least x words)
    jQuery.validator.addMethod("wordCount", function (value, element, param) {
        var typedWords = jQuery.trim(value).split(' ').length;

        return value == '' || (typedWords >= param);
    }, "Enter whole name.");

    //init form validation
    $("form#addRecordForm").validate({
        rules: {
            name: {
                wordCount: 2
            }
        },
        messages: {

        },
        // add item to table, show success message
        submitHandler: function (form, event) {
            event.preventDefault();
            var form = $(form);
            var params = form.serializeArray();

            console.log(params);

            var template = $('#itemTemplate').clone();

            $.each(params, function (index, item) {
                

                //check if input has value set
                if (item.value) {

                    //fill in values
                    var tableField = template.find('div[data-name="' + item.name + '"]');
                    var value = tableField.html();

                    if (value !== '') {
                        tableField.append(', ' + item.value);
                    } else {
                        tableField.html(item.value);
                    }
                }

                //remove no items notice
                var noItems = $('#table').find('.noItems');
                if(noItems){
                    noItems.remove();
                }                 
            });

            //add item to table
            $('#table').append(template);
            template.removeAttr('id');

            //notify user
            $.notify(
                "Record successfully added", 
                { 
                    position:"top center", 
                    className: "success"
                }
            );
        }
    });
});