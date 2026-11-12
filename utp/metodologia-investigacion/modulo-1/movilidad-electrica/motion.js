/* Motion belongs to the presentation, not to the reading surface. */
window.CosmicMotion=(()=>{
  const ease='cubic-bezier(.23,1,.32,1)';
  let animations=[],ghost=null;
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clear(){CelestialFX.stop();animations.forEach(a=>a.cancel());animations=[];ghost?.remove();ghost=null;}
  function play(el,frames,options){const a=el.animate(frames,{easing:ease,fill:'backwards',...options});animations.push(a);return a;}
  function begin(stage,direction,paused){
    clear();
    if(paused||reduce()||!stage.firstElementChild)return;
    ghost=stage.cloneNode(true);ghost.removeAttribute('id');ghost.removeAttribute('tabindex');
    ghost.className='stage-ghost';ghost.setAttribute('aria-hidden','true');ghost.inert=true;
    ghost.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
    stage.before(ghost);ghost.scrollTop=stage.scrollTop;
    const captured=ghost;
    play(ghost,[{opacity:1,transform:'translateX(0) scale(1)'},{opacity:0,transform:`translateX(${-direction*34}px) scale(.99)`}],{duration:240,delay:430,fill:'forwards'}).finished.then(()=>captured.remove()).catch(()=>{});
  }
  function enter(stage,direction,paused){
    if(paused||reduce())return;
    const scene=stage.firstElementChild;
    const index=Number(document.body.dataset.slide)||0;
    // Swap pages beneath the closed matte; the curtain performs the reveal.
    play(scene,[{opacity:0},{opacity:1}],{duration:160,delay:650});
    CelestialFX.start(index,direction);

    scene.querySelectorAll('.route').forEach(route=>route.querySelectorAll('li').forEach((e,i)=>{
      e.style.setProperty('--step-delay',`${1050+i*180}ms`);
      play(e,[{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:540,delay:830+i*100});
    }));
    scene.querySelectorAll('.bar').forEach((e,i)=>play(e,[{opacity:.25,transform:'scaleX(.04)'},{opacity:1,transform:'scaleX(1)'}],{duration:850,delay:780+i*65}));
    scene.querySelectorAll('.diagram').forEach((svg,i)=>{
      svg.querySelectorAll('path').forEach(path=>{const length=path.getTotalLength();play(path,[{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}],{duration:1600,delay:800+i*100});});
      svg.querySelectorAll('circle').forEach((star,j)=>play(star,[{opacity:.1,transform:'scale(.95)'},{opacity:1,transform:'scale(1)'}],{duration:550,delay:850+j*100}));
    });

  }
  function setPaused(paused){if(paused||reduce())clear();}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
  return{begin,enter,setPaused};
})();
