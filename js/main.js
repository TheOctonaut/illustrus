//$(".clickables").click(function () {zoomTo(this.id);})

window.globalImgLoader = 15;

function dealWithBrowserSize(inWidth, inHeight){
	var bod = $("body");
	if (inWidth >= 1100){
		bod.css({"zoom" : "1"});
	} else if (inWidth < 1100 && inWidth > 900){
		bod.css({"zoom" : "0.9", "-moz-transform" : "scale(0.9, 0.9)"});
	} else if (inWidth <= 900 && inWidth > 600){
		bod.css({"zoom" : "0.75", "-moz-transform" : "scale(0.75, 0.75)"});
	}else if (inWidth < 600){
		bod.css({"zoom" : "0.5", "-moz-transform" : "scale(0.5, 0.5)"});
	}
}

$(document).ready(
	function () {
		
		window.onresize = function(){
			dealWithBrowserSize(window.innerWidth, window.innerHeight);
		}
	
		$(".clickables").click(
				function (event) {
					zoomTo(this.id);
				}
		);
		
		dealWithBrowserSize(window.innerWidth, window.innerHeight);
	
		var page;  
		var loc = window.location.pathname;
		try{
			page = loc.substring(loc.lastIndexOf("/") + 1)
		}catch(e){
			page = loc;
		}
		//alert(page);
		if(page == 'webdesign'){
			zoomTo('a');
		} else if(page == 'development'){
			zoomTo('b');
		} else if(page == 'photography'){
			zoomTo('c');
		} else if(page == 'about'){
			zoomTo('d');
		} else if(page.indexOf("img") == 12){
			zoomTo('c');
			var phid = page.substring(12);
			$('#mainimg').stop().fadeOut('slow', function() {
				$('#mainimg').attr("src", "img/content/photos/big/" + phid + ".jpg");
			}).fadeIn('fast');
			setTimeout(function(){ history.replaceState(null, "Photography", "photography-" + phid) } , 500 );
		} else if(page.indexOf("pano") == 12){
			console.log("detected a pano");
			zoomTo('c');
			var phid = page.substring(12);
			console.log(phid);
				
			setTimeout(function(){ 
				history.replaceState(null, "Photography", "photography-" + phid);
				console.log("loading swf");
				console.log($("#mainimgBgDiv").innerHTML);
				$("#mainimgBgDiv").empty();
				$("#mainimgBgDiv").flash({
						src: 'pano/' + phid + '.swf',
						width: 640,
						height: 400
				});		
			} , 500 );
		} else {
			enableHoverables();
		}
	}
	
);

function getMoreImages(){

	var bigScreenHeight = 400;
	var bigScreenWidth = 650;
	var masonryHeight = (550 - bigScreenHeight);
	var masonryContainer = $("#container");
	$.getJSON("ajax/gallery.php", { "start" : window.globalImgLoader } , function(data){
		for(var i =0;i < data.length;i++){
			var item = data[i];
			$('<img />').attr('src','img/content/photos/big/' + item + '.jpg').appendTo('body').css('display','none');
			//newLi = $("<li id='li_" + item  + "' class='box'><a rel='lightbox-gal' href='img/content/very_big/" + item + ".jpg'><img class='thumb' id='" + item + "' src='img/content/" + item + "_w100px.jpg' alt='" + item + "'' /></a></li>");
			newLi = $("<li id='li_" + item  + "' class='box'><img class='thumb' id='" + item + "' src='img/content/photos/100/" + item + ".jpg' alt='" + item + "'' /></li>");
			masonryContainer.append(newLi);
		}
	}).done(function(){
		masonryContainer.masonry( 'reload' );
		$(".thumb").mouseenter(function() {
			var id = this.id;
			$('#mainimg').stop().fadeOut('slow', function() {
				$('#mainimg').attr("src", "img/content/photos/big/" + id + ".jpg");
			}).fadeIn('slow');
		});
		masonryContainer.height(masonryHeight);
		masonryContainer.width(bigScreenWidth);
		window.globalImgLoader = (15 + window.globalImgLoader);
	});
	
	
}

function scrollDown(element) {
	element.animate({ scrollTop: $("#container").scrollTop() + 100}, 'slow');
	getMoreImages();
}

function scrollUp(element) {
	element.animate({ scrollTop: $("#container").scrollTop() - 100}, 'slow');
}

function enableScrollables(){
	var e = $("#container");
	$(".topScroller").click(function () {
		scrollUp(e);
	});
	$(".bottomScroller").click(function () {
		scrollDown(e);
	});
	e.mousewheel(function (event, delta) {
		e.scrollTop(e.scrollTop() - (delta*10));
		getMoreImages();
	});
}

function enableHoverables(){
	$("nav.art-nav > ul > li.clickables").mouseenter(
		function() {
			$("nav.art-nav > ul > li#" + this.id + " > section").css({"display" : "block"});
		}
	);
	$("nav.art-nav > ul > li.clickables").mouseleave(
		function() {
			$("nav.art-nav > ul > li#" + this.id + " > section").css({"display" : "none"});
		}
	);
}

function enableBigView(){
	$(".thumb").mouseenter(function() {
		var id = this.id;
		//console.log('e');
		console.log(id);
		if (id.indexOf("xml") == -1){
			$('#mainimg').stop().fadeOut('slow', function() {
				$('#mainimg').attr("src", "img/content/webs/big/" + id + ".jpg");
			}).fadeIn('slow');
			//history.pushState(null, "Photography", "cat");
			//console.log("ok");
			//alert("some");
		} else {
			pano=new pano2vrPlayer("mainimg");
			pano.readConfigUrl(id);
		}
     });
}

function disableHoverables(){
	$(".clickables").unbind("mouseenter");
	$(".clickables").unbind("mouseleave");
}

function loadDev(ttt){

	var spaceElement = $(".space_cheat");
	var articleElement = $("<article id='gallery' class='feature'></article>");
	articleElement.appendTo(spaceElement);
	
	var imgBgElement = $("<div id='mainimgBgDiv'></div>");
	imgBgElement.addClass("mainimgBg");
	imgBgElement.appendTo(articleElement);
	imgBgElement.height(400);
	imgBgElement.width(650);
	
	var imgElement = $("<img id='mainimg' class='mainimg' src='img/content/apps/big/campusbike.jpg' />");
	imgElement.appendTo(imgBgElement);
	/*imgElement.height(300);
	imgElement.width(650);*/

	var scrollUpElement = $("<div>˄</div>", {
		id: "scrollUp"
	});
	
	articleElement.append(scrollUpElement);

	scrollUpElement.addClass("topScroller");
	scrollUpElement.height(30);
	scrollUpElement.width(650);
	
	var scrollDownElement = $("<div>˅</div>", {
		id: "scrollDown"
	});
	
	articleElement.append(scrollDownElement);
	
	scrollDownElement.addClass("bottomScroller");
	scrollDownElement.addClass("bottomOtherScroller");
	scrollDownElement.height(30);
	scrollDownElement.width(650);
	
	var masonryContainer = $("<ul/>", {
		id: "container"
	});
	
	masonryContainer.appendTo(articleElement);
	
	masonryContainer.css({"list-style" : "none", "opacity" : "0", "padding" : "0px"});
	masonryContainer.height(150);
	masonryContainer.width(650);
	
	masonryContainer.masonry({
		itemSelector : '.box',
		gutterWidth : 10
	});
	
	enableScrollables();
	
	var loaderElement = $("<div></div>", {
		id: "facebookG"
	});
	
	var lngstr = "<div id='blockG_1' class='facebook_blockG'></div><div id='blockG_2' ";
	lngstr = lngstr + "class='facebook_blockG'></div><div id='blockG_3' class='facebook_blockG'></div>";
	
	loaderElement.html(lngstr);
	
	articleElement.append(loaderElement);
	
	loaderElement.addClass("loaderElement");
	loaderElement.height(30);
	loaderElement.width(150);
	
	$.getJSON("ajax/develop.php", function(data){
		for(var i =0;i < data.length;i++){
			var item = data[i];
			$('<img />').attr('src','img/content/apps/big/' + item + '.jpg').appendTo('body').css('display','none');
			//newLi = $("<li id='li_" + item  + "' class='box'><a rel='lightbox-gal' href='img/content/very_big/" + item + ".jpg'><img class='thumb' id='" + item + "' src='img/content/" + item + "_w100px.jpg' alt='" + item + "'' /></a></li>");
			newLi = $("<li id='li_" + item  + "' class='box'><img class='thumb' id='" + item + "' src='img/content/apps/100/" + item + ".jpg' alt='" + item + "'' /></li>");
			masonryContainer.append(newLi);
		}
	}).done(function(){
		masonryContainer.imagesLoaded( function(){
			$('#facebookG').fadeOut('fast').remove();
			masonryContainer.masonry('reload');
			masonryContainer.height(130);
			masonryContainer.fadeTo('slow', 0.9);
		});
		//jQuery("ul#container li a").slimbox();
		$(".thumb").mouseenter(function() {
			var id = this.id;
			//console.log('e');
			$('#mainimg').stop().fadeOut('slow', function() {
				$('#mainimg').attr("src", "img/content/apps/big/" + id + ".jpg");
			}).fadeIn('slow');
		});
	});
	var stateObj = { foo: "bar" };
	history.pushState(stateObj, "Application Development Design", "development");
	return true;
}

function loadAbout(ttt){
	var spaceElement = $(".space_cheat");
	var articleElement = $("<article id='about' class='feature'></article>");
	articleElement.appendTo(spaceElement);
	
	//alert("hello");
	
	articleElement.load("ajax/about.php");
	
	var stateObj = { foo: "bar" };
	history.pushState(stateObj, "About Us", "about");
	return true;
}

function loadGallery(ttt){

	var bigScreenHeight = 400;
	var bigScreenWidth = 650;
	
	var masonryHeight = (550 - bigScreenHeight);

	var spaceElement = $(".space_cheat");
	var articleElement = $("<article id='gallery' class='feature'></article>");
	articleElement.appendTo(spaceElement);
	
	var imgBgElement = $("<div id='mainimgBgDiv'></div>");
	imgBgElement.addClass("mainimgBg");
	imgBgElement.appendTo(articleElement);
	imgBgElement.height(bigScreenHeight);
	imgBgElement.width(bigScreenWidth);
	
	var imgElement = $("<img id='mainimg' class='mainimg' src='img/content/photos/big/img035.jpg' />");
	imgElement.appendTo(imgBgElement);
	/*imgElement.height(300);
	imgElement.width(650);*/

	var scrollUpElement = $("<div>˄</div>", {
		id: "scrollUp"
	});
	
	articleElement.append(scrollUpElement);

	scrollUpElement.addClass("topScroller");
	scrollUpElement.height(30);
	scrollUpElement.width(bigScreenWidth);
	
	var scrollDownElement = $("<div>˅</div>", {
		id: "scrollDown"
	});
	
	articleElement.append(scrollDownElement);
	
	scrollDownElement.addClass("bottomScroller");
	scrollDownElement.addClass("bottomOtherScroller");
	scrollDownElement.height(30);
	scrollDownElement.width(bigScreenWidth);
	
	var masonryContainer = $("<ul/>", {
		id: "container"
	});
	
	masonryContainer.appendTo(articleElement);
	
	masonryContainer.css({"list-style" : "none", "opacity" : "0", "padding" : "0px"});
	masonryContainer.height(masonryHeight);
	masonryContainer.width(bigScreenWidth);
	
	masonryContainer.masonry({
		itemSelector : '.box',
		gutterWidth : 10
	});
	
	enableScrollables();
	
	var loaderElement = $("<div></div>", {
		id: "facebookG"
	});
	
	var lngstr = "<div id='blockG_1' class='facebook_blockG'></div><div id='blockG_2' ";
	lngstr = lngstr + "class='facebook_blockG'></div><div id='blockG_3' class='facebook_blockG'></div>";
	
	loaderElement.html(lngstr);
	
	articleElement.append(loaderElement);
	
	loaderElement.addClass("loaderElement");
	loaderElement.height(30);
	loaderElement.width(150);
	
	$.getJSON("ajax/gallery.php", function(data){
		for(var i =0;i < data.length;i++){
			var item = data[i];
			$('<img />').attr('src','img/content/photos/big/' + item + '.jpg').appendTo('body').css('display','none');
			//newLi = $("<li id='li_" + item  + "' class='box'><a rel='lightbox-gal' href='img/content/very_big/" + item + ".jpg'><img class='thumb' id='" + item + "' src='img/content/" + item + "_w100px.jpg' alt='" + item + "'' /></a></li>");
			newLi = $("<li id='li_" + item  + "' class='box'><img class='thumb' id='" + item + "' src='img/content/photos/100/" + item + ".jpg' alt='" + item + "'' /></li>");
			masonryContainer.append(newLi);
		}
		
		// start panorama images
		
		var panoID = "pano_" + "deadvlei";
		
		var panoThumb = "pano001";
		
		panoLi = $("<li id='li_" + panoID  + "' class='box'><img class='thumb' id='" + panoID + "' src='img/content/photos/100/" + panoThumb + ".jpg' alt='" + panoThumb + "'' /></li>");
		masonryContainer.prepend(panoLi);
		
	}).done(function(){
		masonryContainer.imagesLoaded( function(){
			$('#facebookG').fadeOut('fast').remove();
			masonryContainer.masonry('reload');
			masonryContainer.height(masonryHeight);
			masonryContainer.fadeTo('slow', 0.9);
		});
		//jQuery("ul#container li a").slimbox();
		$(".thumb").mouseenter(function() {
			var id = this.id;
			//console.log('e');
			console.log(id);
			if (id.indexOf("pano_") == -1){
				if(imgBgElement.children('embed').length != 0){
					imgBgElement.empty();
					imgElement = $("<img id='mainimg' class='mainimg' src='img/content/photos/big/" + id + ".jpg' />");
					imgElement.appendTo(imgBgElement);
					history.replaceState(null, "Photography", "photography-" + id);
				} else {
					$('#mainimg').stop().fadeOut('slow', function() {
						$('#mainimg').attr("src", "img/content/photos/big/" + id + ".jpg");
					}).fadeIn('slow');
					history.replaceState(null, "Photography", "photography-" + id);
				}
			} else {
				imgBgElement.empty();
				imgBgElement.flash({
					src: 'pano/' + id + '.swf',
					width: 640,
					height: 400
				});
				history.replaceState(null, "Photography", "photography-" + id);
			}
		});
	});
	var stateObj = { foo: "bar" };
	history.pushState(stateObj, "Photography", "photography");
	return true;
}

function loadDes(ttt){

	var spaceElement = $(".space_cheat");
	var articleElement = $("<article id='gallery' class='feature'></article>");
	articleElement.appendTo(spaceElement);
	
	var imgBgElement = $("<div></div>");
	imgBgElement.addClass("mainimgBg");
	imgBgElement.appendTo(articleElement);
	imgBgElement.height(400);
	imgBgElement.width(650);
	
	var imgElement = $("<img id='mainimg' class='mainimg' src='img/content/webs/big/weddingscreen.jpg' />");
	imgElement.appendTo(imgBgElement);
	/*imgElement.height(300);
	imgElement.width(650);*/

	var scrollUpElement = $("<div>˄</div>", {
		id: "scrollUp"
	});
	
	articleElement.append(scrollUpElement);

	scrollUpElement.addClass("topScroller");
	scrollUpElement.height(30);
	scrollUpElement.width(650);
	
	var scrollDownElement = $("<div>˅</div>", {
		id: "scrollDown"
	});
	
	articleElement.append(scrollDownElement);
	
	scrollDownElement.addClass("bottomScroller");
	scrollDownElement.addClass("bottomOtherScroller");
	scrollDownElement.height(30);
	scrollDownElement.width(650);
	
	var masonryContainer = $("<ul/>", {
		id: "container"
	});
	
	masonryContainer.appendTo(articleElement);
	
	masonryContainer.css({"list-style" : "none", "opacity" : "0", "padding" : "0px"});
	masonryContainer.height(250);
	masonryContainer.width(650);
	
	masonryContainer.masonry({
		itemSelector : '.box',
		gutterWidth : 10
	});
	
	enableScrollables();
	
	var loaderElement = $("<div></div>", {
		id: "facebookG"
	});
	
	var lngstr = "<div id='blockG_1' class='facebook_blockG'></div><div id='blockG_2' ";
	lngstr = lngstr + "class='facebook_blockG'></div><div id='blockG_3' class='facebook_blockG'></div>";
	
	loaderElement.html(lngstr);
	
	articleElement.append(loaderElement);
	
	loaderElement.addClass("loaderElement");
	loaderElement.height(30);
	loaderElement.width(150);
	
	$.getJSON("ajax/design.php", function(data){
		for(var i =0;i < data.length;i++){
			var item = data[i];
			$('<img />').attr('src','img/content/webs/big/' + item + '.jpg').appendTo('body').css('display','none');
			//newLi = $("<li id='li_" + item  + "' class='box'><a rel='lightbox-gal' href='img/content/very_big/" + item + ".jpg'><img class='thumb' id='" + item + "' src='img/content/" + item + "_w100px.jpg' alt='" + item + "'' /></a></li>");
			newLi = $("<li id='li_" + item  + "' class='box'><img class='thumb' id='" + item + "' src='img/content/webs/100/" + item + ".jpg' alt='" + item + "'' /></li>");
			masonryContainer.append(newLi);
		}
	}).done(function(){
		masonryContainer.imagesLoaded( function(){
			$('#facebookG').fadeOut('fast').remove();
			masonryContainer.masonry('reload');
			masonryContainer.height(230);
			masonryContainer.fadeTo('slow', 0.9);
		});
		//jQuery("ul#container li a").slimbox();
		$(".thumb").mouseenter(function() {
			var id = this.id;
			//console.log('e');
			$('#mainimg').stop().fadeOut('slow', function() {
				$('#mainimg').attr("src", "img/content/webs/big/" + id + ".jpg");
			}).fadeIn('slow');
		});
	});
	var stateObj = { foo: "bar" };
	history.pushState(stateObj, "Web Design", "webdesign");
	return true;
}

function space_cheatEnlarge(){
	$(".space_cheat").height(569);
	$(".space_cheat").width(980);
}

function space_cheatShrink(){
	$(".space_cheat").height(20);
	$(".space_cheat").width(300);
	$(".space_cheat").html("&nbsp;");
	return true;
}

function zoomTo(ttt){
	zoomFrom();
	if(ttt == 'logo'){
		enableHoverables();
		var stateObj = { foo: "bar" };
		history.pushState(stateObj, "Home", "index");
		//
	} else {
		disableHoverables();
		//$("nav.art-nav > ul > li:not(#" + ttt + "), article").css({'display' : 'none'});
		$("nav.art-nav > ul > li").width(0);
		$("nav.art-nav > ul > li").height(0);
		$("article.intro").css({'display' : 'none'});
		space_cheatEnlarge();
		// TODO: load options for different sections
		if(ttt == "a"){
			loadDes(ttt);
		} else if(ttt == "b"){
			loadDev(ttt);
		} else if(ttt == "c"){
			loadGallery(ttt);
		} else if( ttt == "d"){
			loadAbout(ttt);
		} else {
			//alert("something else");
		}
		var goback = $("<a id='goback' class='goback' href=\"javascript:zoomFrom();\">&laquo; Go Back</a>");
		goback.hide();
		$(".space_cheat").append(goback);
		goback.fadeIn('slow');
		$("nav.art-nav > ul > li#" + ttt+ " > section").css({'display' : 'block'});
	}
	return true;
}

function zoomFrom(){
	$("nav.art-nav > ul > li > section").css({"display" : "none"});
	$("nav.art-nav > ul > li").width(170);
	$("nav.art-nav > ul > li").height(569);
	enableHoverables();
	$("nav.art-nav > ul > li, article").css({'display' : 'block'});
	space_cheatShrink();
}