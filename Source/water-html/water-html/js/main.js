/*************************************

This file is broken down into
1) App Object - this object enlists all the functionalities
2) Bindings - this includes general and page level bindings and actions
3) Events - On specific events, these actions should take place (like on resizing window - rare case but we still consider it)
4) Extras - Any extra functions can be collected in this space
5) Main - Initiates the App and enables all events

**************************************/


var debugMode = false;






/*************************************
***************** APP OBJECT
**************************************/

var App = {
    init: function(){
        App.generalBindings();
        App.bindGalleryItems();
        App.onResizeFunctions();
        App.runDebug();
        
        //Hide URL (Safari / iOS)
        try{
          MBP.hideUrlBar();
        } catch(e){
        }
    },
    
    //bindings
    generalBindings: function(){
    },
    
    bindGalleryItems: function(){  
    },
    
    
    //events
    onResizeFunctions: function(){
    },
    
    
    //extras
    refreshMaps: function(){
    },
    
    initializeMap: function(){  
    },
    
    runDebug: function(){  
    }
}








/*************************************
***************** BINDINGS
**************************************/

App.generalBindings = function(){

  
//////IMAGE SLIDER - ON LOAD
    $('.flexslider').each(function(){
      if($(this).find('li').length){
        $(this).flexslider({
         animation: "slide",
         controlNav: false
        });
      }
    });
    
    
//////MAP BINDING - ON CLICK
    $('.map-control:not(.bound)').addClass('bound').click(function(e){
      e.preventDefault();
      $($(this).attr('data-target')).slideToggle(function(){
        if($(this).is(':visible')){
          App.refreshMaps();
        }
      });
    });
    
  
    
    
//////NOTIFICATION MESSAGES - ON CLICK - 'hide and remove' any notification messages 
    $('body').on('click', '.message', function(){
      if(!$(this).hasClass('hidingBound')){
        $(this).addClass('hidingBound');
        $(this).slideUp(function(){
          $(this).remove();
        });
      }
    });
    

//////PHOTO PREVIEWER - FULL SCREEN    
    try{
      $('a.image').each(function(){
        if(!(($(this).attr('href') == "#") || (($(this).attr('href').indexOf(".jpg") == -1)&& ($(this).attr('href').indexOf(".png") == -1)&& ($(this).attr('href').indexOf(".jpeg") == -1))))
          return;
        if(!$(this).hasClass('photoswiped')){
            $(this).addClass('photoswiped').photoSwipe();
        }
      });
    } catch(E){
      
    }
    
    
    
//////BIND ALL FORMS
    Forms.bind();
    
    
}





/*************************************
***************** GALLERY ITEMS - PHOTO ITEMS + VIDEO ITEMS
**************************************/

App.bindGalleryItems = function(){
  
//////VIDEOS PAGE + GALLERY DETAIL PAGE + TYPOGRAPHY SAMPLE (IMAGE ITEMS WITH DATA-COLUMN)

  //if this is album photos page (gallery-detail)
  if($('.gallery-items').length){
    setTimeout(function(){
      $('.gallery-items .loading').fadeOut(function(){
        $(this).remove();
        $('.gallery-items .container').slideDown(function(){
          App.onResizeFunctions();
        });
      });
      
      //splits the columns into number specified in the DOM with data attribute 'data-columns'
      $('.gallery-items').each(function(){
        var columns = $(this).attr('data-columns');
        $(this).addClass('column-' + columns);
        $(this).find('ul').easyListSplitter({
          colNumber: columns
        });
      });
      
      
    }, 1000);
  }
  
}


















/*************************************
***************** EVENTS
**************************************/

App.onResizeFunctions = function(){
    //for videos, resize iframe to show square always.
    //you can change this to portrait/landscape if you design (calculation needed)
    $('#videos-page iframe').each(function(){$(this).css('height', $(this).width());});
}


















/*************************************
***************** EXTRAS
**************************************/

App.refreshMaps = function(){
    
    $('.map').each(function(){
         var me = $(this);
         var locationTitle = $(this).attr('data-location');
         var myId = $(me).attr('id');
         var geocoder = new google.maps.Geocoder();
         geocoder.geocode({
              address: locationTitle
          }, function(locResult) {
              var latVal = locResult[0].geometry.location.lat();
              var longVal = locResult[0].geometry.location.lng();
              App.initializeMap(myId, locationTitle, latVal, longVal);
          });
    });
}


App.initializeMap = function(locationVal, titleVal, latVal, longVal) {
          var latlng = new google.maps.LatLng(latVal, longVal);
          var settings = {
                  zoom: 13,
                  center: latlng,
                  mapTypeControl: false,
                  mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                  navigationControl: false,
                  navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
                  streetViewControl: false,
                  zoomControl: true,
                  mapTypeId: google.maps.MapTypeId.ROADMAP 
          };
          var map = new google.maps.Map(document.getElementById(locationVal), settings);
          
          
          var nibrasPos= new google.maps.LatLng(latVal, longVal);
          var nibrasMarker = new google.maps.Marker({
                    position: nibrasPos,
                    map: map,
                    title:titleVal
          });
            
    
}





App.runDebug = function(){
  //DEBUG CODES
  if(debugMode){
    $('h1').click(function(){
      alert($('html').attr('class'));
    });
  }
  
}



/*************************************
***************** MAIN BINDINGS
**************************************/

$(document).bind('pagechange', App.init);
$(window).resize(App.onResizeFunctions);
