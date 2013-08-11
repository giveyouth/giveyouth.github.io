var slideshows = [];

function slideshow(el){
  var imgs = el.getElementsByTagName('li');
  var steps = imgs.length;
  var inc = (el.scrollWidth/steps);
  
  var duration = 500;
  function interpolate(x){
    return x*x*(3 - 2*x);
  }
  setInterval(function(){
    var end = +new Date + duration;
  
    var animate = function(){
      var x = interpolate(Math.max(0,Math.min(1,(1-(end - new Date)/duration))));
      el.scrollLeft = inc * x;
      //console.log(x, end - new Date, (end - new Date)/duration);
      if(x < 1){
        setTimeout(animate, 1000/60);
      }else{
        imgs[0].parentNode.appendChild(imgs[0]);
        
        el.scrollLeft = 0;
      }
    }
    animate();
  }, 3000);
  el.scrollLeft = 0;
  /*
    Here's a nifty compilation of a few interpolation functions
    0.5 - cos(x * Math.PI) / 2 //sinusoidal
    x*x*(3 - 2*x) // smoothstep
    x*x*x*(x*(x*6 - 15) + 10) //smootherstep
  */
}
window.onload = function(){
  for(var i = 0; i < slideshows.length; i++) slideshow(slideshows[i]);
  var images = document.getElementById("content").getElementsByTagName('img');
  for(var i = 0; i < images.length; i++){
    // this fixes a weird bug where text overflow sucks
    images[i].style.margin = '1px'
  }
}

