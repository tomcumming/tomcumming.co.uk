module TC.Animations {
  
  export type NextFrame = (ctx: CanvasRenderingContext2D,time: number) => AnimationResult;
  
  export interface AnimationInitial {
    width: number;
    height: number;
    startTime: number;
  }
  
  export type Animation = (initial: AnimationInitial) => NextFrame;
  
  export interface AnimationResult {
    finished: Animation;
    nextFrame: NextFrame;
  }
  
  export var animations: Animation[] = [
    bwTiles,
    colorCycle,
    checkerzoom
  ];
  
  function bwTiles(initial: AnimationInitial): NextFrame {

    var longestSize = Math.max(initial.width, initial.height);
    var tileCount = 20;
    var tileSize = longestSize / 20;
    var border = tileSize / 8;
    
    var tileStartTime = 0.1;
    var tileStayTime = 2;
    
    function draw(ctx: CanvasRenderingContext2D ,time: number): AnimationResult {
      
      var deltaTime = (time - initial.startTime) / 1000;
      
      ctx.clearRect(0, 0, initial.width, initial.height);
      ctx.fillStyle = 'white';
      
      for(var x = 0; x < 20; x++) {
        for (var y = 0; y < 20; y++) {
          var tileCoord = x + y;
          
          if(deltaTime >= tileStartTime * tileCoord){
            var lifeTime = deltaTime - tileStartTime * tileCoord;
            if(lifeTime < tileStayTime) {
              
              var intensity = 1 - (lifeTime / tileStayTime);
              var b = Math.floor(Math.pow(intensity, 2) * 255); 
              ctx.fillStyle = 'rgb(' + b + ',' + b + ',' + b +')';
              
              ctx.fillRect(
                tileSize * x + border, 
                tileSize * y + border,
                tileSize - border * 2,
                tileSize - border * 2);
            }
          }
        }
      }
      
      var endWait = 2;      
      var totalLength = tileStartTime * tileCount + tileStayTime + endWait;
      
      return { 
        finished: deltaTime >= totalLength ? bwTiles : null,
        nextFrame: draw 
      };
    }
    
    return draw;
  }
  
  function colorCycle(initial: AnimationInitial): NextFrame {
    
    var fadeTime = 2;
    var cycleTime = 8;
    
    var initialHue = Math.floor(Math.random() * 360);
    var lMax = 25;
    
    function draw(ctx: CanvasRenderingContext2D, time: number): AnimationResult {
      var deltaTime = (time - initial.startTime) / 1000;
      
      ctx.clearRect(0, 0, initial.width, initial.height);
      
      if(deltaTime <= fadeTime) {
        var l = Math.floor((deltaTime / fadeTime) * lMax);
        ctx.fillStyle = 'hsl(' + initialHue + ',100%,' + l + '%)';
        ctx.fillRect(0, 0, initial.width, initial.height);
      } else if(deltaTime <= fadeTime + cycleTime) {
        var relative = deltaTime - fadeTime;        
        var h = Math.floor((initialHue + (relative / cycleTime) * 360) % 360);
        ctx.fillStyle = 'hsl(' + h + ',100%,' + lMax + '%)';        
      } else {
        var relative = deltaTime - (fadeTime + cycleTime);
        var l = Math.max(0, 1 - (relative / fadeTime));
        l = Math.floor(l * lMax);
        ctx.fillStyle = 'hsl(' + initialHue + ',100%,' + l + '%)';
      }
      
      ctx.fillRect(0, 0, initial.width, initial.height);
      
      var endTime = fadeTime * 2 + cycleTime;
      
      return {
        finished: deltaTime >= endTime ? colorCycle : null,
        nextFrame: draw
      };
    }
    
    return draw; 
  }
  
  function checkerzoom(initial: AnimationInitial): NextFrame {
    
    var effectTotalTime = 10;
    var effectFadeTime = 2;
    var longestSide = Math.max(initial.width, initial.height);
    
    function draw(ctx: CanvasRenderingContext2D, time: number): AnimationResult {
      var deltaTime = (time - initial.startTime) / 1000;
      
      ctx.clearRect(0, 0, initial.width, initial.height);
      
      var size = 1 / (1 + deltaTime);
      
      var l: number;
      if(deltaTime > effectTotalTime - effectFadeTime) {
        var relative = deltaTime - (effectTotalTime - effectFadeTime);
        l = Math.max(0, 1 - (relative / effectFadeTime));
        l = Math.floor(l * 128);
      } else {
        l = 128;
      }
      
      for(var x = 0; x < (1 / size); x += 1) {
        for(var y = 0; y < (1 / size); y += 1) {
          var color = (x + y) % 2 === 1 
            ? 'rgb(' + l + ',' + l +',' + l + ')' 
            : 'black';
          ctx.fillStyle = color;
          ctx.fillRect(
            longestSide * size * x,
            longestSide * size * y,
            longestSide * size,
            longestSide * size);
        }
      }
      
      return {
        finished: deltaTime >= effectTotalTime ? checkerzoom : null,
        nextFrame: draw
      };
    }
    
    return draw;
  }
}