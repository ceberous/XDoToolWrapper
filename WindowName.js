const XDoToolBase = require( "./BaseClass.js" );
function sleep( ms ) { return new Promise( function( resolve ) { setTimeout( resolve , ms ) } ); }
class WindowName extends XDoToolBase {
	constructor( windowName ) {
		super();
		this.windowName = windowName;	
		super.windowGeometry();
	}

	windowIDFromName() {
		//let x1 = this.exec( "xdotool search --name '" + this.windowName + "'" );
		let x1 = this.exec( "xdotool search --desktop 0 --name '" + this.windowName + "'" );
		console.log( x1 );
		if ( x1 ) { x1 = x1.split( "\n" ); x1 = x1[ 0 ]; }
		this.windowID = x1;
		return x1;
	}

	searchID() {
		let xFoundID = this.windowIDFromName();
		if ( xFoundID !== null  ) { if ( xFoundID.length > 1 ) { return true; } }
		return false;
	}

	ensureWindowNameIsReady() {
		let that = this;
		return new Promise( async function( resolve , reject ) {
			try {
				let xFoundID = null;
				let xFound = false;
				while( !xFound ) { xFound = that.searchID(); await sleep( 1000 ); }
				console.log( "XDoTool-Wrapper --> X-Window READY !!! " + xFoundID );
				resolve();
			}
			catch( error ) { console.log( error ); reject( error ); }
		});
	}	
}

module.exports = WindowName;