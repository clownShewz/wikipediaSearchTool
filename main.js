$(document).ready(function(){
    console.log('ready');
    $('#searchResults').hide();


    $('#search').on('click',function(){
        $('#searchResults').show('slow');
        console.log('click');
    });

});
