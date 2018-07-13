import * as MathUtils from './MathUtils';

export function getPointOnCurve(time, anchor1, anchor2, control1, control2) {
  const x = Math.pow(time, 3) * (anchor2.x + 3 * (control1.x - control2.x) - anchor1.x)
	  + 3 * Math.pow(time, 2) * (anchor1.x - 2 * control1.x + control2.x)
	  + 3 * time * (control1.x - anchor1.x) + anchor1.x;

  const y = Math.pow(time, 3) * (anchor2.y + 3 * (control1.y - control2.y) - anchor1.y)
	  + 3 * Math.pow(time, 2) * (anchor1.y - 2 * control1.y + control2.y)
	  + 3 * time * (control1.y - anchor1.y) + anchor1.y;


  return { x, y };
}

export function getPointsForCurve(pointsOnCurve, anchor1, anchor2, control1, control2){
  const delta = 1 / (pointsOnCurve - 1);
  const points = [];

  let lastPoint ;
  let currentLength = 0;

  for (let i = 0; i < pointsOnCurve; i += 1) {
	const point = getPointOnCurve(i * delta, anchor1, anchor2, control1, control2);
    const bezierPoint = {
      x: point.x,
      y: point.y
    };

    if (lastPoint) {
	  currentLength += MathUtils.getDistance(point, lastPoint);
	  bezierPoint.distanceInSegment = currentLength;
	}

	points.push(bezierPoint);
	lastPoint = bezierPoint;
  }

  return points;
}

export function getPoint(x, y) {
  return { x, y };
}

export const getPathPoint = function(x, y, speedTo, speedFrom) {
  return getPathPointCurved(x, y, speedTo, speedFrom, x, y, x, y);
};

export const getPathPointCurved = function(x, y, speedTo, speedFrom, controlBackX, controlBackY, controlFrontX, controlFrontY) {
  const isCurved = (x !== controlBackX || x !== controlFrontX || y !== controlBackY || y !== controlFrontY);

  return { x, y, controlBackX, controlBackY, controlFrontX, controlFrontY, speedTo, speedFrom, isCurved };
};