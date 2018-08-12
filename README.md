# XDoToolWrapper

```
const XDoToolWrapper = require( "xdotoolwrapper" );

var x1 = new XDoToolWrapper.wrap.name( "chrome" );
console.log( x1.display );
console.log( x1.windowID );
console.log( x1.windowGeometry );
x1.centerMouse();
x1.fullScreen();
x1.unmaximizeWindow();
```
