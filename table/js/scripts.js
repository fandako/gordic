$(function () {

    const pgSize = 20;

    function load_page(index, pageSize) {
        $.get("https://cors-anywhere.herokuapp.com/http://85.93.97.170:7000/lemon/users", { page: index, size: pageSize }).done(function (data) {
            console.log(data);

            renderData(data, pageSize);
        });
    }

    function walker(key, value, template, prefix) {

        if (value !== null && typeof value === "object") {
            // Recurse into children
            $.each(value, function (newKey, value) {
                walker(newKey, value, template, prefix + key + '_')
            });
        } else {
            template.find('span[data-name="' + prefix + key + '"]').html(value);
        }

    }

    function openDetail(element) {
        var id = element.find('div[data-name="_id"]').html();

        $.get("https://cors-anywhere.herokuapp.com/http://85.93.97.170:7000/lemon/users/" + id,).done(function (data) {
            console.log(data);

            //close previous detail
            $('#table').find('.itemDetail').remove();

            var template = $('#itemDetailTemplate').clone();

            // Loop the top level
            $.each(data, function (key, value) {
                walker(key, value, template, '');
            });

            $(element).append(template);
            template.removeAttr('id');
        });
    }

    function renderData(data, pageSize) {
        //clear previous records from table
        $('#table').find('.item').remove();

        //render new records
        $.each(data.data, function (index, item) {
            var template = $('#itemTemplate').clone();

            Object.keys(item).forEach(function (key) {
                var tableField = template.find('div[data-name="' + key + '"]');

                //if avatar => value goes to src attribute instead of html
                if (key === 'avatar') {
                    tableField.find('img').attr('src', item[key]);
                } else {
                    tableField.html(item[key]);
                }
            });

            $('#table').find('.table').append(template);
            template.removeAttr('id');
            template.on('click', function () {
                openDetail(template);
            });
        });

        $('#table').find('.item').each(function () {

        });

        //update pagination controls
        var pagination = $('#table').find('.pagination');

        var pageInput = pagination.find('input');
        pageInput.val(data.page);
        pageInput.attr('min', 1);

        var maxPage = data.total / pageSize;
        pageInput.attr('max', maxPage);
        pagination.find('.maxPage').html();
    }

    function setPaginationEvents() {
        var pagination = $('#table').find('.pagination');

        var pageInput = pagination.find('input');
        var next = pagination.find('.next');
        var prev = pagination.find('.prev');
        var first = pagination.find('.first');
        var last = pagination.find('.last');

        pageInput.on('change', function () {
            load_page($(this).val(), pgSize);
        });

        next.on('click', function (e) {
            e.preventDefault();

            var orig_page = parseInt(pageInput.val(), 10);
            var next_page = orig_page + 1;

            if (orig_page != pageInput.attr('max')) {
                load_page(next_page, pgSize);
            }
        });


        prev.on('click', function (e) {
            e.preventDefault();

            var orig_page = parseInt(pageInput.val(), 10);
            var next_page = orig_page - 1;

            if (orig_page != pageInput.attr('min')) {
                load_page(next_page, pgSize);
            }
        });

        first.on('click', function (e) {
            e.preventDefault();

            load_page(pageInput.attr('min'), pgSize);
        });


        last.on('click', function (e) {
            e.preventDefault();

            load_page(pageInput.attr('max'), pgSize);
        });
    }

    function init() {
        load_page(1, pgSize);
        setPaginationEvents();
    }

    init();

});