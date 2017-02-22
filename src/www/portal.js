// JS file using jquery for bootstrap navbar

$(document).on('click', '.navbar-collapse.in', function (e) {
    if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
        $(this).collapse('hide');
    }
});

$(document).ready(function () {
    $('#nav-collapse-btn').click(function () {
        $(this).toggleClass('open');
    });
});
