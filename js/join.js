$(function(){var b="fadeInLeft";var c;var a;d($("#tab1 a"),$("#tab-content1"));function d(e,f,g){e.click(function(i){i.preventDefault();$(this).tab("show");var h=$(this).data("easein");if(c){c.removeClass(a);}if(h){f.find("div.active").addClass("animated "+h);a=h;}else{if(g){f.find("div.active").addClass("animated "+g);a=g;}else{f.find("div.active").addClass("animated "+b);a=b;}}c=f.find("div.active");});}$("a[rel=popover]").popover().click(function(f){f.preventDefault();if($(this).data("easein")!=undefined){$(this).next().removeClass($(this).data("easein")).addClass("animated "+$(this).data("easein"));}else{$(this).next().addClass("animated "+b);}});});

$('.joiningField').on("change keyup paste",
  function(){
    if($(this).val()){
      $('.icon-paper-plane1').addClass("next");
    } else {
      $('.icon-paper-plane1').removeClass("next");
    }
  }
);

$('.hostingField').on("change keyup paste",
  function(){
    if($(this).val()){
      $('.icon-paper-plane2').addClass("next");
    } else {
      $('.icon-paper-plane2').removeClass("next");
    }
  }
);

$('.next-button').hover(
  function(){
    $(this).css('cursor', 'pointer');
  }
);

$.fn.restrictInputs = function(restrictPattern){
    var targets = $(this);

    /* The characters inside this pattern are accepted,
	   everything else will be 'cleaned' 
	   keep the ^ <- means "anything else will be erased" */
    var pattern = restrictPattern || 
        /[^A-Za-z0-9_:()äöüÄÖÜß?!<>+*~,;.:@{}$€§=µ°^]+/g; // default

    var restrictHandler = function(){
        var val = $(this).val();
        var newVal = val.replace(pattern, '');

        if (val !== newVal) {
            $(this).val(newVal);
        }
    };
    targets.on('keyup', restrictHandler);
    targets.on('paste', restrictHandler);
    targets.on('change', restrictHandler);
};

$('input').restrictInputs();
