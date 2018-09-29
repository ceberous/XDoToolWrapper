const XDoToolBase = require( "./BaseClass.js" );
class WindowName extends XDoToolBase {
	constructor( windowName ) {
		super();
		this.windowName = windowName;
		this.windowID = this.windowIDFromName;
		if ( !this.windowID ) {
			return undefined;
		}
		if ( this.windowID.length < 3 ) {
			return undefined;
		}		
		super.windowGeometry();
	}

	get windowIDFromName() {
		//let x1 = this.exec( "xdotool search --name '" + this.windowName + "'" );
		let x1 = this.exec( "xdotool search --desktop 0 --name '" + this.windowName + "'" );
		console.log( x1 );
		if ( x1 ) { x1 = x1.split( "\n" ); x1 = x1[ 0 ]; }
		return x1;
	}

	async ensureWindowNameIsReady( wName ) {
		let xFoundID = null;
		let xFound = false;
		while( !xFound ) {
			//wExecSync("sleep 1");
			await super.sleep( 1000 );
			xFoundID = this.windowIDFromName( wName );
			if ( xFoundID !== null  ) { if ( xFoundID.length > 1 ) { xFound = true; } }
		}
		console.log( "XDoTool-Wrapper --> X-Window READY !!! " + xFoundID );
	}	
}

module.exports = WindowName;