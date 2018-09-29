const XDoToolBase = require( "./BaseClass.js" );
class PID extends XDoToolBase {
	constructor( pid ) {
		super();
		this.pid = pid;
		this.windowID = this.windowIDFromPID;
		if ( !this.windowID ) {
			return undefined;
		}
		if ( this.windowID.length < 3 ) {
			return undefined;
		}		
		super.windowGeometry();
	}

	get windowIDFromPID() {
		//let x1 = this.exec( "xdotool search --name '" + this.windowName + "'" );
		let x1 = this.exec( "xdotool search --pid '" + this.pid + "'" );
		console.log( x1 );
		if ( x1 ) { x1 = x1.split( "\n" ); if ( x1 ) { if ( x1[ 0 ] ) { return x1[ 0 ]; } } }
		return undefined;
	}
}
module.exports = PID;