$(document).ready(function(){
    console.log('ready');
    var maxResults = 15;
    var getMore = maxResults;
    var type = "";

    $('#warn').hide();
    $('#more').hide();

    $('#search').on('click',function(){
        type = 'search';
        clickActionEvents()
        console.log(type + ' click');
    });

    $('#more').on('click',function(){
        type='more';
        clickActionEvents()
        console.log(type + ' click');
    });

    $('#random').on('click',function(){
        type = 'random';
        clickActionEvents();
        //$('#searchResults').show('slow');

        console.log(type + ' click');
    });

    function clickActionEvents(){
       if(checkSearchText()){
           cleanUp();
           getWikiData();
       }
    }

    function cleanUp(){
        $('#searchResults').empty();

        if(type === 'search'){
            $('#more').show();
        }else if (type === "more"){


        }else if(type === "random"){
            $('#searchText').val("");
            $('#more').hide();
        }
    }

    function checkSearchText(){
        var returnVal = false;
        $('#warn').hide();

        if($('#searchText').val()==='') {
            $('#warn').show();
            if (type === 'search'){
                $('#warn').html('You need to enter a value in the search box');
            }else if (type == "more") {
                $('#warn').html('You can\'t see more if you without a search value. Search Again');
            }
        }else{
            returnVal = true;
        }
        return returnVal;
    }

    function getWikiData(){
        var response = {};
        if(type === "search" || type === "more"){
            var i = 0;
            var getUrl = "";

                if (type === "more"){
                    getUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=15&generator=search&origin=*&gsroffset="+getMore+"&gsrsearch="+$('#searchText').val();
                    getMore += maxResults;
                }else {
                    getUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=15&generator=search&origin=*&continue=&gsrsearch="+$('#searchText').val()
                }
                console.log(getUrl);
                $.getJSON(getUrl,function(data){
                    //console.log(data);
                    //contn = data.continue.continue;

                    var wikiResponseMap = Object.entries(data.query.pages);
                    wikiResponseMap.forEach(function(key,value){
                        console.log(key);
                        key.forEach(function(key,value){

                            if(typeof(key) !== 'undefined' && typeof(key.title) !== 'undefined' ) {
                                console.log(key.title)
                                $('#searchResults').append('<div id=result' + i + '></div>');
                                var resultid = '#result' + i;
                                var linkid = encode(key.title);
                                // debug console.log(linkid);
                                $(resultid).html('<a href=https://en.wikipedia.org/wiki/' + linkid + ' class="list-group-item list-group-item-action result" target="_blank">' + key.title + '</a>');
                                i++;
                            }
                        })
                    });
                }).
                done(function(){

                }).
                fail(function(){
                    $('#alert').html('Error Retrieving Results. Please try again.')

                });


        }else if(type==="random"){
            var i = 0;
                $.getJSON("https://en.wikipedia.org//w/api.php?action=query&format=json&origin=*&list=random&rnlimit=15&rnnamespace=main",function(data){
                   //debug console.log(data.query.random.length);

                    data.query.random.forEach(function(key,value){
                                //console.log(key,value);
                            if(typeof(key) !== 'undefined' && typeof(key.title) !== 'undefined' ) {
                                //debug console.log(key)
                                $('#searchResults').append('<div id=result' + i + '></div>');
                                var resultid = '#result' + i;
                                var linkid = encode(key.title);
                                // debug console.log(linkid);
                                $(resultid).html('<a href=https://en.wikipedia.org/wiki/' + linkid + ' class="list-group-item list-group-item-action result" target="_blank">' + key.title + '</a>');
                                i++;
                            }
                        })
                   }).
                done(function(){

                }).
                fail(function(){

                });

        }else{
            console.log('invalid wiki get request');
            response = {data:'invalid request'};
        }


        console.log(response);
        return response;
    }

    function display(dataSet){
            dataSet.forEach(function(key,value){
                //console.log(key,value);
                if(typeof(key) !== 'undefined' && typeof(key.title) !== 'undefined' ) {
                    //debug console.log(key)
                    $('#searchResults').append('<div id=result' + i + '></div>');
                    var resultid = '#result' + i;
                    var linkid = encode(key.title);
                    // debug console.log(linkid);
                    $(resultid).html('<a href=https://en.wikipedia.org/wiki/' + linkid + ' class="list-group-item list-group-item-action result" target="_blank">' + key.title + '</a>');
                    i++;
                }
            })
        }

    function encode(string){
        chars = string.split('');
        returnChars = [];

        chars.forEach(function(c){
            var newc = c.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(" ",'_');
            returnChars.push(newc);
        });
        //debug console.log(returnChars);
        return returnChars.join('');
    }

});


