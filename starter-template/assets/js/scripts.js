$(function () {
    // mobile menu style
    $('.mobile_menu_button .triggerMobileMenu').click(function () {
        $(this).toggleClass('open');
        var targetID = $(this).data('toggle');
        $('#' + targetID).toggleClass('is-open');
    });
})