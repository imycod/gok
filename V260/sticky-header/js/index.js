/*www.jq22.com*/
$(function(){	
    var cubuk_seviye = $(document).scrollTop();
    var header_yuksekligi = $('.yapiskan').outerHeight();
    console.log(header_yuksekligi);
    $(window).scroll(function() {
        var kaydirma_cubugu = $(document).scrollTop();

        if (kaydirma_cubugu > header_yuksekligi){$('.yapiskan').addClass('gizle');} 
        else {$('.yapiskan').removeClass('gizle');}

        if (kaydirma_cubugu > cubuk_seviye){$('.yapiskan').removeClass('sabit');} 
        else {$('.yapiskan').addClass('sabit');}				

        cubuk_seviye = $(document).scrollTop();	
     });
});