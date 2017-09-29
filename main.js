require("shelljs/global");
function wSLEEP( ms ) { return new Promise( function( resolve ) { setTimeout( resolve , ms ) } ); } 
function wEXEC( wCMD ) {
	var r1 = exec( wCMD , { silent: true , async: false } );
	if ( r1.stderr.length > 1 ) { return r1.stderr; }
	return r1.stdout.trim();
}

const s0 = "xdotool ";

const s1 = s0 + 'search --name "';
const s2 = '"';
function getWindowIDFromName( wName ) { return wEXEC( s1 + wName + s2 ); }

const s3 = s0 + "windowactivate ";
function activateWindowID( wID ) { return wEXEC( s3 + wID ); }

const s4 = s0 + "windowfocus"
function focusWindowID( wID ) { return wEXEC( s4 + wID ); }
function refocusWindowID( wID ) { activateWindowID( wID ); focusWindowID( wID ); }

const sA3 = s0 + "windowraise ";
function raiseWindowID( wID ) { return wEXEC( sA3 + wID ); }

// https://unix.stackexchange.com/questions/14159/how-do-i-find-the-window-dimensions-and-position-accurately-including-decoration
// https://github.com/jordansissel/xdotool/blob/master/cmd_getwindowgeometry.c
const sA1 = s0 + "getactivewindow getwindowgeometry";
function getActiveWindowGeometry() { var g1 = wEXEC( sA1 ); g1 = g1.split("\n"); if ( g1.length < 3 ) { return; } return { pos: g1[1].split("  Position: ")[1].split(" (screen")[0].split(",") , geom: g1[2].split("  Geometry: ")[1].split("x") }; }

const s5 = "wmctrl -ir ";
const s6 = " -b remove,maximized_ver,maximized_horz";
function unmaximizeWindow( wID ) { return wEXEC( s5 + wID.toString() + s6 ); }

const s7 = s0 + "getactivewindow windowmove ";
// wmctrl -r :ACTIVE: -e 0,1600,-1,-1,-1
function moveWindow( wID , wDisplay ) {
	
	activateWindowID( wID );
	//var cur_geom = getActiveWindowGeometry();
	//console.log( cur_geom );
	unmaximizeWindow( wID );

	var wX_POS = wDisplay[0].toString() || "0";
	var wY_POS = wDisplay[1].toString() || "0";
	
	return wEXEC( s7 + wX_POS + " " + wY_POS );
}

const sA2 = s0 + "key F11";
function maximizeActiveWindow( wID ) { refocusWindowID( wID ); return wEXEC( sA2 ); }

// DUAL-SCREEN-STUFF .... horizontal and normal rotation only .... FeelsBadMan
// ============================================================================
const s8 = "xrandr --prop | grep connected";
function getActiveMonitors() { 
	var x1 = wEXEC( s8 );
	x1 = x1.split("\n");
	var xF = { primary: null , secondary: null };
	for ( var i = 0; i < x1.length; ++i ) { 
		var xx = x1[i].split(" ");
		var xS = xx[1];
		if ( xS === "disconnected" ) { continue; }
		var xN = xx[0];
		if ( xx[2] === "primary" ) { var x11 = xx[3].split("x"); xF.primary = [ x11[0] , x11[1].split("+")[0] ]; }
		else { var x11 = xx[2].split("x"); xF.secondary = [ x11[0] , x11[1].split("+")[0] ]; }
	}
	var PxC = ( parseInt( xF.primary[0] ) / 2 );
	var PyC = ( parseInt( xF.primary[1] ) / 2 );
	var SxC = ( parseInt( xF.primary[0] ) + ( parseInt( xF.secondary[0] ) / 2 ) );
	var SyC = ( parseInt( xF.secondary[1] ) / 2 );	
	xF[ "centers" ] = {
		primary: [ PxC , PyC ] ,
		secondary: [ SxC , SyC ] ,
	};
	return xF;
}
// ===========================================================================

const s9 = s0 + "mousemove ";
function moveMouse( wX , wY ) { wX = wX.toString() || "0"; wY = wY.toString() || "0"; return wEXEC( s9 + wX + " " + wY ); }
const s10 = s0 + "click 1";
function leftClick() { return wEXEC( s10 ); }
const s11 = s0 + "click 2";
function rightClick() { return wEXEC( s11 ); }
const s12 = s0 + "click --repeat 2 --delay 200 1";
function doubleClick() { return wEXEC( s12 ); }

const s13 = s0 + "key '";
const s14 = "'";
function pressKeybardKey( wKey ) { return wEXEC( s13 + wKey + s14 ); }




// CLASSES
// ------------------------------------------------------------------
// ------------------------------------------------------------------
function WRAP_FROM_NAME( wName ) {
	var wAPP = {
		display: getActiveMonitors() ,
		windowID: getWindowIDFromName( wName ) ,
		move: moveWindow ,
		maximize: maximizeActiveWindow ,
		moveMouse: moveMouse ,
		leftClick: leftClick , 
		rightClick: rightClick ,
		doubleClick: doubleClick ,

	};
	return wAPP;
}
// ------------------------------------------------------------------
// ------------------------------------------------------------------

module.exports.wrapFromName = WRAP_FROM_NAME;