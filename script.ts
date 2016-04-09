module TC {
  
  var canvas: HTMLCanvasElement;
  var ctx: CanvasRenderingContext2D;
  
  var requestId: number = null;
  var anim: Animations.NextFrame = null;
  
  function randomAnimation(last: Animations.Animation): Animations.NextFrame {
    var initial = {
      width: canvas.width,
      height: canvas.height,
      startTime: performance.now()
    };
    
    var animations = Animations.animations.slice();
    if(last !== null && animations.length > 1)
      animations = animations.filter(x => x !== last);
    
    var random = Math.floor(Math.random() * animations.length);
    return animations[random](initial);
  }
  
  function draw(time: number): void {
    var result = anim(ctx, time);
    if(result.finished !== null) {
      anim = randomAnimation(result.finished);
    } else {
      anim = result.nextFrame;
    }
    window.requestAnimationFrame(draw);
  }
  
  function resize() {
    window.cancelAnimationFrame(requestId);
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    canvas = <any> document.getElementById('background-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    
    anim = randomAnimation(null);
    requestId = window.requestAnimationFrame(draw);
  }
  
  export function init() {
    window.onresize = resize;
    
    resize();
  }
}

