require( "shelljs/global" );

class XDoToolBase {
	
	constructor() {
		this.display = this.activeMonitors;
		this.windowID = undefined;
		this.windowGeometry = undefined;
	}

	sleep( ms ) { return new Promise( function( resolve ) { setTimeout( resolve , ms ) } ); }

	exec( wCMD ) {
		let r1 = exec( wCMD , { silent: true , async: false } );
		if ( r1.stderr.length > 1 ) { return r1.stderr; }
		return r1.stdout.trim();		
	}

	get activeMonitors() {
		let x1 = this.exec( "xrandr --prop | grep connected" );
		x1 = x1.split("\n");
		let xF = { primary: null , secondary: null };
		for ( let i = 0; i < x1.length; ++i ) { 
			let xx = x1[i].split(" ");
			let xS = xx[1];
			if ( xS === "disconnected" ) { continue; }
			let xN = xx[0];
			if ( xx[2] === "primary" ) { let x11 = xx[3].split("x"); xF.primary = { x: x11[0] , y: x11[1].split("+")[0] }; }
			else { let x11 = xx[2].split("x"); xF.secondary = { x: x11[0] , y: x11[1].split("+")[0] }; }
		}
		if ( xF.primary ) {
			let PxC = ( parseInt( xF.primary.x ) / 2 );
			let PyC = ( parseInt( xF.primary.y ) / 2 );
			xF.primary.centers = { x: PxC.toString() , y: PyC.toString() };
		}
		if ( xF.secondary ) {
			let SxC = ( parseInt( xF.primary.x ) + ( parseInt( xF.secondary.y ) / 2 ) );
			let SyC = ( parseInt( xF.secondary.y ) / 2 );
			xF.secondary.centers = { x: SxC.toString() , y: SyC.toString() };
		}
		return xF;
	}

	activateWindow() {
		return this.exec( "xdotool windowactivate " + this.windowID );
	}

	focusWindow() {
		return this.exec( "xdotool windowfocus " + this.windowID );
	}

	refocusWindow() {
		this.activateWindow();
		return this.focusWindow();
	}

	raiseWindow() {
		return this.exec( "xdotool windowraise " + this.windowID );
	}

	windowGeometry() {
		this.refocusWindow();
		let g1 = this.exec( "xdotool getactivewindow getwindowgeometry" );
		g1 = g1.split( "\n" );
		if ( g1.length < 3 ) { return; }
		let pos = g1[1].split( "  Position: " )[ 1 ].split( " (screen" )[ 0 ].split( "," );
		let geom = g1[2].split( "  Geometry: " )[ 1 ].split( "x" );
		let centerX = ( parseInt( pos[ 0 ] ) + ( parseInt( pos[ 0 ] ) / 2 ) ).toString();
		let centerY = ( parseInt( geom[ 1 ] ) / 2 ).toString();
		this.windowGeometry = {
			pos: { x: pos[ 0 ] , y: pos[ 1 ] } ,
			geom: { x: geom[ 0 ] , y: geom[ 1 ] } ,
			center: { x: centerX , y: centerY }
		};
		return this.windowGeometry; 
	}

	unmaximizeWindow() {
		this.refocusWindow();
		return this.exec( "wmctrl -ir " + this.windowID + " -b remove,maximized_ver,maximized_horz" );
	}

	maximizeWindow() {
		this.refocusWindow();
		return this.exec( "xdotool key F11" );
	}

	fullScreen() { this.maximizeWindow(); }	

	moveMouse( x , y ) {
		x = x.toString() || "0";
		y = y.toString() || "0";
		return this.exec( "xdotool mousemove " + x + " " + y );
	}

	leftClick() {
		this.refocusWindow();
		return this.exec( "xdotool click 1" );
	}

	rightClick() {
		this.refocusWindow();
		return this.exec( "xdotool click 2" );
	}

	doubleClick() {
		this.refocusWindow();
		return this.exec( "xdotool click --repeat 2 --delay 200 1" );
	}

	centerMouse() {
		if ( !this.windowGeometry ) { return; }
		this.moveMouse( this.windowGeometry.center.x , this.windowGeometry.center.y );
	}

	pressKeyboardKey( wKey ) {
		return this.exec( "xdotool key '" + wKey + "'" );
	}

}

module.exports = XDoToolBase;