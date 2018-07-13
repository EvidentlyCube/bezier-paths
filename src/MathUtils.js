export function getDistance(l, r) {
  return Math.sqrt(
	  (r.x - l.x) * (r.x - l.x) +
	  (r.y - l.y) * (r.y - l.y)
  );
}

export function linearEasing(start, end, position, length) {
  const factor = position / length;
  return start + (end - start) * factor;
}

export function getAccelerationPosition(startSpeed, acceleration, time) {
  return startSpeed * time + 0.5 * acceleration * time * time;
}

export function mPoint(l, r, multiplier) {
  const diffX = (r.x - l.x) * multiplier;
  const diffY = (r.y - l.y) * multiplier;

  return {
	x: l.x + diffX,
	y: l.y + diffY
  };
}