const XDoToolBase = require( "./BaseClass.js" );
class WindowName extends XDoToolBase {
	constructor( windowName ) {
		super();
		this.windowName = windowName;
		this.windowID = this.windowIDFromName;
		super.windowGeometry();
	}

	get windowIDFromName() {
		//let x1 = this.exec( "xdotool search --name '" + this.windowName + "'" );
		let x1 = this.exec( "xdotool search --desktop 0 --name '" + this.windowName + "'" );
		if ( x1 ) { x1 = x1.split( "\n" ); x1 = x1[ 0 ]; }
		return x1;
	}
}

module.exports = WindowName;