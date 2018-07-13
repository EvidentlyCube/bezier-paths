import { getPathPoint, getPathPointCurved } from './src/BezierUtils';
import { CompiledPath } from './src/CompiledPath'

export const createLinearPoint = getPathPoint;
export const createBezierPoint = getPathPointCurved;
export const compilePath = function (curvesPrecision, points) {
  var path = new CompiledPath(curvesPrecision, points);
  Object.freeze(path);

  return path;
};
