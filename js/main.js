var chapterData = [];
var mapHeight = $(window).height() -90;
$("#map").height(mapHeight);
$("#infoSidebar").height(mapHeight);
var chapterMap = L.map('map',{zoomControl:false}).setView([39, 22], 6);
var chapterLayer = L.featureGroup().addTo(chapterMap);  

L.control.zoom({position: 'topright'} ).addTo(chapterMap);

 
 var nhqIcon = L.icon({
  iconUrl: 'images/nhq_focus.png',
  iconSize:     [20, 29], // size of the icon
  iconAnchor:   [10, 19], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -21] // point from which the popup should open relative to the iconAnchor
});

 var chapterIcon = L.icon({
  iconUrl: 'images/chapter_focus.png',
  iconSize:     [15, 15], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -12] // point from which the popup should open relative to the iconAnchor
});

var centreIcon = L.icon({
  iconUrl: 'images/centre.svg',
  iconSize:     [15, 15], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -12] // point from which the popup should open relative to the iconAnchor
});

var healthIcon = L.icon({
  iconUrl: 'images/health_centre.svg',
  iconSize:     [15, 15], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -12] // point from which the popup should open relative to the iconAnchor
});

var homelessIcon = L.icon({
  iconUrl: 'images/community.svg',
  iconSize:     [15, 15], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -12] // point from which the popup should open relative to the iconAnchor
});

var mfcIcon = L.icon({
  iconUrl: 'images/community.svg',
  iconSize:     [15, 15], // size of the icon
  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -12] // point from which the popup should open relative to the iconAnchor
});

var tileLayerUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
var attribution = 'Map data &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a> | Map style by <a href="http://hot.openstreetmap.org" target="_blank">H.O.T.</a> | &copy; <a href="http://www.redcross.org.ph/" title="Philippine Red Cross" target="_blank">Philippine Red Cross</a> 2014 | <a title="Disclaimer" onClick="showDisclaimer();">Disclaimer</a>';

L.tileLayer(tileLayerUrl, {
  maxZoom: 18,
  attribution: attribution,
}).addTo(chapterMap);

function getChapterData() {
  $.ajax({
    type: 'GET',
    url: 'data/hrc_branches.geojson',
    contentType: 'application/json',
    dataType: 'json',
    timeout: 10000,
    success: function(data) {
      console.log("Success!");
      chapterData = data;
      mapChapterdata();

    },
    error: function(e) {
      console.log(e);
    }
  });
}

function zoomOut(){
  var markersBounds = chapterLayer.getBounds();
  chapterMap.fitBounds(markersBounds);   
}

function setIconType(feature){
  if (feature.properties.CATEGORY==="HRC Headquarters"){return nhqIcon}
  if (feature.properties.CATEGORY==="HRC Branch"){return chapterIcon}
  if (feature.properties.CATEGORY==="Accommodation Centre"){return centreIcon}
  if (feature.properties.CATEGORY==="Health Centre"){return healthIcon}
  if (feature.properties.CATEGORY==="Homeless Shelter"){return homelessIcon}
  if (feature.properties.CATEGORY==="Multifunctional Centre"){return mfcIcon}
}

function mapChapterdata(){
  var chapterMarkers = L.geoJson(chapterData, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng,{icon: setIconType(feature)});
    },  
    onEachFeature: onEachChapter         
  });
  chapterLayer.addLayer(chapterMarkers);
  var markersBounds = chapterLayer.getBounds();
  chapterMap.fitBounds(markersBounds);  
};

function onEachChapter(feature, layer){
  layer.bindPopup(feature.properties.NAME);
  layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
  /*layer.on('mouse-over', function(e) {
    chapterHover(e);
  });*/
  layer.on('click', function(e) {
    chapterClick(e);
  });
}


         //  <h3><small>Chapter Name: </small><span id="info-chapterName"></span></h3>
         //  <br>         
         //  <h5><span id="info-chapterCHAIRMAN"></span>, 
         //  <small><span id="info-chairmanTitle"></span></small></h5>
         // <br>
         //  <h5><span id="info-chapterAdmin"></span>, 
         //  <small><span id="info-chapterAdminTitle"></span></small>
         //  <br>Contact Number:<span id="info-adminContact"></span>
         //  <br><span id="info-adminContact2"></span></h5>

/*function chapterHover(e){
  e.target.feature.properties.NAME;
}*/

function chapterClick(e){
  var chapterHtml = "";
   var chapterName = e.target.feature.properties.NAME;
   var chapterType = e.target.feature.properties.CATEGORY;
   //chapterName= toTitleCase(chapterName);
   chapterHtml += "<h2>" + chapterName + "<br/><small>" + "  (" + chapterType + ")" + "</small></h2>";
   if (e.target.feature.properties.TOWN !== null){
      var chapterLocation = e.target.feature.properties.TOWN;
      var chapterRegion = e.target.feature.properties.REGION;
      chapterHtml += "<p>" + chapterLocation + ", " + chapterRegion + "</p>"; 
    }
    if (e.target.feature.properties["BENEFICIARIES 2015"] !== null){
      var chapterBen = e.target.feature.properties["BENEFICIARIES 2015"];
      chapterHtml += "<h4>Beneficiaries in 2015: " + chapterBen + "</h4>"; 
    }
    if (e.target.feature.properties.STAFF !== null){
      var chapterStaff = e.target.feature.properties.STAFF;
      chapterHtml += "<h4>Staff: " + chapterStaff + "</h4>"; 
    }
    /*if (e.target.feature.properties.N1 !== null){
      var chapterContact = e.target.feature.properties.N1;
      chapterHtml += "<p>" + chapterContact; 
    }
    if (e.target.feature.properties.N1_type !== null){
      var chapterContactType = e.target.feature.properties.N1_type;
      chapterHtml += " (" + chapterContactType + ")" +"</p>";
    }
    if (e.target.feature.properties.N2 !== null){
      var chapterContact2 = e.target.feature.properties.N2;
      chapterHtml += "<p>" + chapterContact2;
    }
    if (e.target.feature.properties.N2_Type !== null){
     var chaptercontactType2 = e.target.feature.properties.N2_Type;
     chapterHtml += " (" + chaptercontactType2 + ")" + "</p>"; 
    }
    console.log(chapterHtml);
    if (e.target.feature.properties.CHAIRMAN !== null){
      var chapterChairman = e.target.feature.properties.CHAIRMAN;
      chapterHtml += "<h4>" + chapterChairman;
      if (e.target.feature.properties.Chairman_title !== null){
        var chairmanTitle = e.target.feature.properties.Chairman_title;
        chapterHtml += "<small>" + " (" + chairmanTitle + ")" + "</small></h4>";
      }
    }
   
    if (e.target.feature.properties.Admin !== null){
      var chapterAdmin = e.target.feature.properties.Admin;
      chapterHtml += "<h4>" + chapterAdmin;
      if (e.target.feature.properties.Admin_Title !== null){
        var chapterAdminTitle = e.target.feature.properties.Admin_Title;
        chapterHtml += "<small>" + " (" + chapterAdminTitle + ")" + "</small></h4>";
      }
    }*/
    
    /*if (e.target.feature.properties.CONTACT !== null){
      var adminContact =e.target.feature.properties.CONTACT;
      chapterHtml += "<small>" + "Admin Contact #: " + adminContact;
    }
    if (e.target.feature.properties.contact_alt !== null){
     var adminContactAlt =e.target.feature.properties.contact_alt;
      chapterHtml += " | " + adminContactAlt + "</small>";  
    }*/
    console.log(chapterHtml);
    $('#chapterInfo').html(chapterHtml);

}
  

function toTitleCase(str){
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


getChapterData();

// show disclaimer text on click of disclaimer link
function showDisclaimer() {
    window.alert("The maps on this page do not imply the expression of any opinion on the part of the Hellenic Red Cross concerning the legal status of a territory or of its authorities.");
}

// adjust map div height on screen resize
$(window).resize(function(){
  mapHeight=$(window).height() -90;
  $("#map").height(mapHeight);
});