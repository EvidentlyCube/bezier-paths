import * as BezierUtils from './BezierUtils';
import * as MathUtils from './MathUtils';
import { CompiledSegment } from './CompiledSegment';

function getCompiledPoint(x, y, speedFrom, speedTo) {
  return { x, y, speedFrom, speedTo };
}

function compilePoints(curvesPrecision, points) {
  const compiledPoints = [];

  let lastPoint;

  for (let point of points) {
	if (lastPoint && (lastPoint.isCurved || point.isCurved)) {
	  compiledPoints.push.apply(compiledPoints, compileCurveToPoints(curvesPrecision, lastPoint, point));
	}

	compiledPoints.push(getCompiledPoint(point.x, point.y, point.speedFrom, point.speedTo));

	lastPoint = point;
  }

  return compiledPoints;
}

function compileCurveToPoints(precision, startPoint, endPoint) {
  const points = [];

  const bezierPoints = BezierUtils.getPointsForCurve(
	  precision,
	  startPoint,
	  endPoint,
	  startPoint.isCurved
		  ? BezierUtils.getPoint(startPoint.controlFrontX, startPoint.controlFrontY)
		  : startPoint,
	  endPoint.isCurved
		  ? BezierUtils.getPoint(endPoint.controlBackX, endPoint.controlBackY)
		  : endPoint
  );

  const segmentLength = bezierPoints[bezierPoints.length - 1].distanceInSegment + MathUtils.getDistance(bezierPoints[bezierPoints.length - 1], endPoint);

  for (let i = 1; i < bezierPoints.length; i++) {
	const point = bezierPoints[i];

	const speed = MathUtils.linearEasing(startPoint.speedFrom, endPoint.speedTo, point.distanceInSegment, segmentLength);
	points.push(getCompiledPoint(point.x, point.y, speed, speed));
  }

  return points;
}

export const CompiledPath = function (curvesPrecision, points) {
  this.points = compilePoints(curvesPrecision, points);
  this.segments = [];

  this.pathLength = 0;
  this.pathDuration = 0;

  let lastPoint = this.points[0];
  for (let i = 1; i < this.points.length; i++) {
	const point = this.points[i];
	const segment = new CompiledSegment(lastPoint, point, this.pathLength, this.pathDuration);

	this.pathLength += segment.length;
	this.pathDuration += segment.duration;

	this.segments.push(segment);
	lastPoint = point;
  }
};

CompiledPath.prototype.getPointAtTime = function (time) {
  time = time % this.pathDuration;

  for (let segment of this.segments) {
	if (segment.startDuration + segment.duration <= time) {
	  continue;
	}

	const localTime = time - segment.startDuration;

	const positionOnPoint = MathUtils.getAccelerationPosition(segment.startSpeed, segment.acceleration, localTime);

	return BezierUtils.getPoint(
		MathUtils.linearEasing(segment.startPoint.x, segment.endPoint.x, positionOnPoint, segment.length),
		MathUtils.linearEasing(segment.startPoint.y, segment.endPoint.y, positionOnPoint, segment.length)
	);
  }

  return BezierUtils.getPoint(0, 0);
};

CompiledPath.prototype.getPointAtDistance = function (length) {
  length = length % this.pathLength;

  for (let segment of this.segments) {
	if (segment.startLength + segment.length <= length) {
	  continue;
	}

	const localLength = length - segment.startLength;

	return BezierUtils.getPoint(
		MathUtils.linearEasing(segment.startPoint.x, segment.endPoint.x, localLength, segment.length),
		MathUtils.linearEasing(segment.startPoint.y, segment.endPoint.y, localLength, segment.length)
	);
  }

  return BezierUtils.getPoint(0, 0);
};