var W = 800;
var H = 400;

var H1 = 100;
var H3 = 300;

var $canvas = document.getElementById('canvas');
var $metaPathLength = document.getElementById('path-length');
var $metaPathDuration = document.getElementById('path-duration');
var $metaDeltaDistance = document.getElementById('delta-distance');
var $metaPlaybackTime = document.getElementById('playback-time');
var context = $canvas.getContext("2d");

var precision = 10;
var isCurved = true;
var curvedPoints = [];
var playbackSpeed = 1;
var lastPlaybackPosition = null;

var hoveredPoint = null;
var hoverType = null;

var isMouseDown = false;
var playbackTime = 0;

curvedPoints.push(BezierPaths.createBezierPoint(10, H1, 1, 1, 10, H3, 10 + 50, H1));
curvedPoints.push(BezierPaths.createBezierPoint(W / 2, H3, 20, 20, W / 2 - 100, H1, W / 2 + 100, H1));
curvedPoints.push(BezierPaths.createBezierPoint(W - 10, H1, 1, 1, W - 10 - 100, H3, W - 10, H3));

addManyListeners(['precision'], ['change', 'click', 'input', 'keyup'], function (e) {
  precision = parseInt(e.target.value);
});
addManyListeners(['curved'], ['change', 'click', 'input', 'keyup'], function (e) {
  isCurved = e.target.checked;
});
addManyListeners(['playback-speed'], ['change', 'click', 'input', 'keyup'], function (e) {
  playbackSpeed = parseInt(e.target.value);
});
addManyListeners(['speed-0', 'speed-1', 'speed-2', 'speed-3'], ['change', 'click', 'input', 'keyup'], function (e) {
  switch (e.target.id) {
	case 'speed-0':
	  curvedPoints[0].speedFrom = parseInt(e.target.value);
	  break;
	case 'speed-1':
	  curvedPoints[1].speedTo = parseInt(e.target.value);
	  break;
	case 'speed-2':
	  curvedPoints[1].speedFrom = parseInt(e.target.value);
	  break;
	case 'speed-3':
	  curvedPoints[2].speedTo = parseInt(e.target.value);
	  break;
  }
});

redraw();

document.addEventListener('mousedown', function () {
  isMouseDown = true;
});
document.addEventListener('mouseup', function () {
  isMouseDown = false;
});
$canvas.addEventListener('mousemove', function (e) {
  var x = e.pageX - $canvas.offsetLeft;
  var y = e.pageY - $canvas.offsetTop;

  if (!isMouseDown) {
	var result = getHovered(x, y);
	hoveredPoint = result[0];
	hoverType = result[1];

	$canvas.style.cursor = hoveredPoint ? 'pointer' : 'auto';
  }

  if (isMouseDown) {
	updateBezierPoint(x, y, hoveredPoint, hoverType);
  }
});

var lastRedraw = 0;
setInterval(function () {
  var timePassed = Date.now() - lastRedraw;
  if (timePassed < 10) {
	return;
  }
  lastRedraw = Date.now();

  playbackTime += playbackSpeed;

  redraw();
}, 1000 / 16);

function getHovered(canvasX, canvasY) {
  for (var i = 0; i < curvedPoints.length; i++) {
	var point = curvedPoints[i];

	if (inRange(point.x, point.y, canvasX, canvasY)) {
	  return [point, 0];
	}
	if (!isCurved) {
	  continue;
	}

	if (i > 0 && inRange(point.controlBackX, point.controlBackY, canvasX, canvasY)) {
	  return [point, -1];
	}
	if (i < curvedPoints.length - 1 && inRange(point.controlFrontX, point.controlFrontY, canvasX, canvasY)) {
	  return [point, 1];
	}
  }
  return [null, null];
}

function inRange(pointX, pointY, mouseX, mouseY) {
  var dist = (mouseX - pointX) * (mouseX - pointX) + (mouseY - pointY) * (mouseY - pointY);

  return dist < 10 * 10;
}

function updateBezierPoint(x, y, point, type) {
  if (x < 0 || y < 0 || x > W || y > H) {
	return;
  }

  if (type === 0) {
	var deltaX = x - point.x;
	var deltaY = y - point.y;
	point.x += deltaX;
	point.y += deltaY;
	point.controlFrontX += deltaX;
	point.controlFrontY += deltaY;
	point.controlBackX += deltaX;
	point.controlBackY += deltaY;
  } else if (type === -1 && isCurved) {
	point.controlBackX = x;
	point.controlBackY = y;
  } else if (type === 1 && isCurved) {
	point.controlFrontX = x;
	point.controlFrontY = y;
  }

  point.controlFrontX = Math.max(0, Math.min(W, point.controlFrontX));
  point.controlFrontY = Math.max(0, Math.min(H, point.controlFrontY));
  point.controlBackX = Math.max(0, Math.min(W, point.controlBackX));
  point.controlBackY = Math.max(0, Math.min(H, point.controlBackY));
}

function redraw() {
  context.clearRect(255, 255, 255, 1);
  context.fillStyle = "black";
  context.fillRect(0, 0, W, H);
  context.strokeStyle = '#FFFFFF';

  var points = curvedPoints;
  if (!isCurved) {
	points = points.map(function (point) {
	  return BezierPaths.createLinearPoint(point.x, point.y, point.speedFrom, point.speedTo)
	})
  }

  var path = BezierPaths.compilePath(precision, points);
  drawPath(path, points);
  $metaPathLength.innerText = path.pathLength.toFixed(2);
  $metaPathDuration.innerText = path.pathDuration.toFixed(2);
  $metaPlaybackTime.innerText = (playbackTime % path.pathDuration).toFixed(0);
}


function drawPath(path, points) {
  var lastPoint = path.points[0];
  for (var i = 1; i < path.points.length; i++) {
	var nextPoint = path.points[i];
	context.strokeStyle = '#FFFFFF';
	context.beginPath();
	context.moveTo(lastPoint.x, lastPoint.y);
	context.lineTo(nextPoint.x, nextPoint.y);
	context.stroke();

	lastPoint = nextPoint;
  }

  for (i = 0; i < points.length; i++) {
	var point = points[i];
	var isHover = hoveredPoint === point && hoverType === 0;
	var isHoverBack = hoveredPoint === point && hoverType === -1;
	var isHoverFront = hoveredPoint === point && hoverType === 1;

	context.strokeStyle = isHover ? '#AAAAAA' : '#FFFFFF';
	context.beginPath();
	context.arc(point.x, point.y, 6, 0, Math.PI * 2);
	context.stroke();

	context.strokeStyle = isHoverBack ? '#FF8888' : '#FF0000';
	if (i > 0 && isCurved) {
	  context.beginPath();
	  context.moveTo(point.x, point.y);
	  context.lineTo(point.controlBackX, point.controlBackY);
	  context.stroke();
	  context.beginPath();
	  context.arc(point.controlBackX, point.controlBackY, 6, 0, Math.PI * 2);
	  context.stroke();
	}

	context.strokeStyle = isHoverFront ? '#FF8888' : '#FF0000';
	if (i < points.length - 1 && isCurved) {
	  context.beginPath();
	  context.moveTo(point.x, point.y);
	  context.lineTo(point.controlFrontX, point.controlFrontY);
	  context.stroke();
	  context.beginPath();
	  context.arc(point.controlFrontX, point.controlFrontY, 6, 0, Math.PI * 2);
	  context.stroke();
	}
  }

  point = path.getPointAtTime(playbackTime);
  context.strokeStyle = '#00FF00';
  context.fillStyle = "#00FF00";
  context.beginPath();
  context.arc(point.x, point.y, 8, 0, Math.PI * 2);
  context.stroke();
  context.fill();

  if (lastPlaybackPosition) {
	$metaDeltaDistance.innerText = Math.sqrt(
		(point.x - lastPlaybackPosition.x) * (point.x - lastPlaybackPosition.x) +
		(point.y - lastPlaybackPosition.y) * (point.y - lastPlaybackPosition.y)
	).toFixed(2);
  }

  lastPlaybackPosition = point;
}

function addManyListeners(elements, events, listener) {
  for (var i = 0; i < elements.length; i++) {
	var element = document.getElementById(elements[i]);
	for (var j = 0; j < events.length; j++) {
	  var event = events[j];

	  element.addEventListener(event, listener);
	}
  }
}