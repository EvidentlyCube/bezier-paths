# Bezier Paths

A library for easily generating and traversing bezier paths. And different parts of the path can have different speeds!

# Interactive demo

\<insert the link to interactive demo here after the code is pushed for the first time>

# Installation

`npm i bezier-paths`

# Usage

You can include the library in browser projects which don't allow `require` or `import` by simply adding the file
via `<script>` and accessing the global variable `BezierPaths`.

First create a bunch of points that will make up your path using either `createLinearPoint` or `createBezierPoint`. 
Then call `compilePath` which will compile the points into a path that exposes methods `getPointAtTime` and
`getPointAtDistance` for traversing the path:

```js
var curvedPoints = [];

curvedPoints.push(BezierPaths.createBezierPoint(
	x, y,
	speedTo, speedFrom,
	controlBackX, controlBackY,
	controlFrontX, controlFrontY
));
curvedPoints.push(BezierPaths.createBezierPoint(...));
curvedPoints.push(BezierPaths.createBezierPoint(...));
curvedPoints.push(BezierPaths.createBezierPoint(...));

var path = BezierPaths.compilePath(precision, points);
path.getPointAtTime(time);
// OR
path.getPointAtDistance(distance);
```

# API

## `createLinearPoint(x, y, speedTo, speedFrom): Point`
 * `x: Number` - X position of the point
 * `y: Number` - Y position of the point
 * `speedTo: Number` - Speed of the segment when reaching this point
 * `speedFrom: Number` - Speed of the segment when leaving this point
 * Creates a new point that is not curved by itself.

## `createBezierPoint(x, y, speedTo, speedFrom, controlBackX, controlBackY, controlFrontX, controlFrontY): Point`
 * `x: Number` - X position of the point
 * `y: Number` - Y position of the point
 * `speedTo: Number` - Speed of the segment when reaching this point
 * `speedFrom: Number` - Speed of the segment when leaving this point
 * `controlBackX: Number` - X position of the control point affect the path before this point
 * `controlBackY: Number` - Y position of the control point affect the path before this point
 * `controlFrontX: Number` - X position of the control point affect the path after this point
 * `controlFrontY: Number` - Y position of the control point affect the path after this point
 * Creates a new point that curves the path before and after itself up until the previous/next point.

## `compilePath(curvesPrecision, points): CompiledPath`
 * `curvesPrecision: Number` - Number of points that will make up each curved segment. For smooth angles a value of at least 50 is recommended. The bigger it is the smoother the curves will be when traversing them.
 * `points: Point[]` - An array of points that will make up the path.

## `Point`
 * Field `x: Number` - X position of the point
 * Field `y: Number` - Y position of the point
 * Field `speedTo: Number` - Speed of the segment when reaching this point
 * Field `speedFrom: Number` - Speed of the segment when leaving this point
 * Field `controlBackX: Number` - X position of the control point affect the path before this point
 * Field `controlBackY: Number` - Y position of the control point affect the path before this point
 * Field `controlFrontX: Number` - X position of the control point affect the path after this point
 * Field `controlFrontY: Number` - Y position of the control point affect the path after this point
 * Field `isCurved: Boolean` - Is the point curved or not. If not controls have the same position as the point itself.
	

## `CompiledPath.getPointAtTime(time)`
 * `time: Number` - Time, in frames
 * Returns the position along the path assuming travel from the start of the path for the amount of frames specified in an argument. If `time` is larger than path's duration it will wrap around.
 
## `CompiledPath.getPointAtDistance(distance)`
 * `distance: Number` - Distance, in pixels
 * Returns the position along the path assuming travel from the start of the path by the number of pixels specified in an argument. If `distance` is larger than path's length it will wrap around.
## `CompiledPath.pathLength`
 * Field containing the path's length in pixels.
 
## `CompiledPath.pathDuration`
 * Field containing the path's duration in frames.
 
## `CompiledPath.points`
 * An array of compiled points making up the path. The points only contain `x`, `y`, `speedFrom` and `speedTo`.
