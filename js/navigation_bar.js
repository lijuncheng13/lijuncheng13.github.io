//Drop menu for homework exhibition
$(function() {
    $('#menu-item-course').hover(function(e) {
        e.preventDefault();

        if ($('#sub-menu-homework').is(':visible')) {
            $('#sub-menu-homework').slideUp(200);
        } else {
            $('#sub-menu-homework').slideDown(200);
        }
    });
})

//Navigation show/hide for small screen
$(function() {
    $('#navigation_show').click(function(e) {
        e.preventDefault();

        if ($('.navigation_bar').is(':visible')) {
            $('.navigation_bar').slideUp(200);
        } else {
            $('.navigation_bar').slideDown(200);
        }
    });
})