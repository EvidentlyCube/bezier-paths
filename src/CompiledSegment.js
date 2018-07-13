import * as MathUtils from './MathUtils';

export function CompiledSegment(startPoint, endPoint, startLength, startDuration){
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.startLength = startLength;
  this.startDuration = startDuration;

  this.length = MathUtils.getDistance(startPoint, endPoint);
  this.duration = this.length / this.averageSpeed;
}

Object.defineProperty(CompiledSegment.prototype, 'startSpeed', {
  get: function(){
    return this.startPoint.speedFrom;
  }
});

Object.defineProperty(CompiledSegment.prototype, 'endSpeed', {
  get: function(){
    return this.endPoint.speedTo;
  }
});

Object.defineProperty(CompiledSegment.prototype, 'speedChange', {
  get: function(){
    return this.endSpeed - this.startSpeed;
  }
});

Object.defineProperty(CompiledSegment.prototype, 'averageSpeed', {
  get: function(){
    return (this.startSpeed + this.endSpeed) / 2;
  }
});

Object.defineProperty(CompiledSegment.prototype, 'acceleration', {
  get: function(){
    return this.speedChange / this.duration;
  }
});