$(function() {
  $('#nav-tabs a[href*="' + window.location.pathname + '"]')
    .parent('li').addClass('active');
});
