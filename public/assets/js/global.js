
jQuery( window ).load(function() {
  applySameHeightPerGroup();
});
 
jQuery(document).ready(function () {
  applySameHeightPerGroup();

  //slidehom
  jQuery(".iz_toggle-password").click(function() {

    jQuery(this).toggleClass("fa-eye fa-eye-slash");
    var input = jQuery(jQuery(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });
  // vertical dropdown menus

  jQuery('.iz_has-menu-child ul').hide();
  jQuery(".iz_has-menu-child > a").click(function () {
    jQuery(this).parent(".iz_has-menu-child").children("ul").slideToggle("100");
    jQuery(this).parent(".iz_has-menu-child").toggleClass("iz_has-menu-child-dropdown");
  });

  // select 
  jQuery('.iz_field-select select').select2();


});

jQuery(window).resize(function () {
  applySameHeightPerGroup();

});
/* Sameheight **/
function applySameHeightPerGroup() {
  // Get the max height per group
  var maxHeight = new Array();
  jQuery('.same-height').css('height', 'inherit');
  jQuery('.same-height').each(function () {
    var sameHeightGroup = jQuery(this).data('same-height-group');
    if (typeof maxHeight[sameHeightGroup] == 'undefined') {
      maxHeight[sameHeightGroup] = 0;
    }
    if (jQuery(this).height() > maxHeight[sameHeightGroup]) {
      maxHeight[sameHeightGroup] = jQuery(this).height();
    }
  });

  // Set the max height for each group
  jQuery('.same-height').each(function () {
    var sameHeightGroup = jQuery(this).data('same-height-group');
    if (typeof maxHeight[sameHeightGroup] != 'undefined'
      && maxHeight[sameHeightGroup] > 0) {
      jQuery(this).height(maxHeight[sameHeightGroup]);
    }
  });
}

