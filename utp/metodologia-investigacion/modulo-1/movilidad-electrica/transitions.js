/* Scene-scale mattes: surfaces close over the old page and open onto the new. */
window.CelestialFX=(()=>{
  const names=['zodiaco','pegaso','dragon','cisne','andromeda','libra','fenix','geminis','sagitario'];
  let canvas,ctx,frame=0,started=0,w,h,active=0,direction=1;
  const pi=Math.PI,tau=pi*2,clamp=v=>Math.max(0,Math.min(1,v));
  function stop(){cancelAnimationFrame(frame);if(canvas){ctx.clearRect(0,0,w,h);canvas.hidden=true;}}
  function stroke(points,color,width=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function surface(points,base='#0b1930',edge='#b99c60',ice=false){
    ctx.save();ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
    const gradient=ctx.createLinearGradient(0,0,w,h);gradient.addColorStop(0,ice?'#1d3c52':base);gradient.addColorStop(.48,ice?'#0c233a':'#080e1c');gradient.addColorStop(1,ice?'#24485c':base);ctx.fillStyle=gradient;ctx.fill();ctx.clip();
    ctx.globalAlpha=.16;for(let j=-h;j<w+h;j+=100)stroke([[j,0],[j+h,h]],edge,.6);
    ctx.globalAlpha=.12;for(let j=0;j<7;j++){ctx.beginPath();ctx.arc(w*.78,h*.5,45+j*41,0,tau);ctx.strokeStyle=edge;ctx.stroke();}
    ctx.globalAlpha=.28;stroke([[w*.06,h*.15],[w*.24,h*.15],[w*.28,h*.2],[w*.48,h*.2]],edge);stroke([[w*.52,h*.8],[w*.72,h*.8],[w*.77,h*.85],[w*.94,h*.85]],edge);
    ctx.restore();ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.stroke();
  }
  function ring(x,y,r,color,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.strokeStyle=color;for(const scale of [1,1.045,1.12]){ctx.beginPath();ctx.arc(0,0,r*scale,0,tau);ctx.lineWidth=scale===1?2:1;ctx.stroke();}for(let j=0;j<12;j++){const a=j*tau/12;stroke([[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a)*r*1.12,Math.sin(a)*r*1.12]],color);ctx.font="16px 'Segoe UI Symbol',serif";ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('♈♉♊♋♌♍♎♏♐♑♒♓'[j]+'\uFE0E',Math.cos(a+pi/12)*r*1.065,Math.sin(a+pi/12)*r*1.065);}ctx.restore();}
  function draw(now){
    if(document.hidden){stop();return;}
    const p=clamp((now-started)/1650),q=Math.pow(Math.sin(pi*p),.8),D=Math.hypot(w,h),cx=w*.5,cy=h*.5;
    ctx.clearRect(0,0,w,h);ctx.save();
    // The matte joins the two pages; no isolated decorations float over reading text.
    ctx.globalAlpha=Math.pow(Math.sin(pi*p),6)*.99;ctx.fillStyle='#060c1b';ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
    if(active===0){
      const r=D*.6*(1-q);ctx.fillStyle='#091327';ctx.beginPath();ctx.rect(0,0,w,h);ctx.arc(cx,cy,r,0,tau,true);ctx.fill('evenodd');
      ring(cx,cy,Math.max(8,r),'#d5b977',p*.5);for(let j=0;j<12;j++){const a=j*pi/6+p*.5;stroke([[cx+Math.cos(a)*r,cy+Math.sin(a)*r],[cx+Math.cos(a+.16)*D,cy+Math.sin(a+.16)*D]],'#bba26844');}
    }else if(active===1){
      // Seven engraved diagonal shutters: the meteor direction becomes the wipe.
      const count=7,bw=w/count;for(let j=0;j<count;j++){const local=clamp(q*1.14-j*.018),offset=(1-local)*(h+w*.26)*(p<.5?-1:1),left=j*bw;
        surface([[left-w*.12,offset],[left+bw-w*.12+2,offset],[left+bw+w*.12+2,h+offset],[left+w*.12,h+offset]],j%2?'#0c1c34':'#101d35','#8ecbe1');
        stroke([[left-w*.12+12,offset+20],[left+w*.12+12,h+offset-20]],'#c1e9ff88',2);
      }
    }else if(active===2){
      // A continuous jade curtain with a serpentine carved boundary.
      const edge=-150+(w+300)*q,pts=[[0,0]];for(let y=0;y<=h+20;y+=20)pts.push([edge+Math.sin(y/h*tau*1.2+p*2)*85,y]);pts.push([0,h]);surface(pts,'#0a2827','#8fdab4');
      for(let k=0;k<3;k++){const ridge=[];for(let y=0;y<=h;y+=10)ridge.push([edge-12-k*10+Math.sin(y/h*tau*1.2+p*2)*85,y]);stroke(ridge,k?'#d2c17b66':'#adebce',k?1:2);}
      ctx.save();ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.clip();ctx.globalAlpha=.18;for(let y=0;y<h;y+=36)for(let x=0;x<edge;x+=48){ctx.beginPath();ctx.ellipse(x+(y%72?24:0),y,24,16,0,0,pi);ctx.strokeStyle='#90c5b1';ctx.stroke();}ctx.restore();
    }else if(active===3){
      // A fitted crystal mosaic closes, then separates along its actual seams.
      const cols=w<600?4:6,rows=3,cw=w/cols,ch=h/rows;
      for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)for(let half=0;half<2;half++){
        const x=col*cw,y=row*ch,points=half?[[x+cw,y],[x+cw,y+ch],[x,y+ch]]:[[x,y],[x+cw,y],[x,y+ch]],mx=x+cw*(half?.67:.33),my=y+ch*(half?.67:.33),away=(1-q)*2.5;
        const dx=(mx-cx)*away,dy=(my-cy)*away;surface(points.map(([a,b])=>[a+dx,b+dy]),'#162d45','#b2e3ec',true);
        stroke([[mx+dx-15,my+dy-40],[mx+dx+28,my+dy+20],[mx+dx+3,my+dy+56]],'#d0f4ff22');
      }
    }else if(active===4){
      // Two linked sanctuary gates: bevels, nested frames and physical chain seams.
      for(let side of [-1,1]){const off=side*(1-q)*w*.56,x=side<0?off:cx+off;surface([[x,0],[x+cx,0],[x+cx,h],[x,h]],'#17162c',side<0?'#b0cee0':'#ddaacb');
        for(let inset of [18,30,58])stroke([[x+inset,inset],[x+cx-inset,inset],[x+cx-inset,h-inset],[x+inset,h-inset],[x+inset,inset]],'#bea2c755');
        for(let y=32;y<h;y+=34){ctx.strokeStyle='#cfbedb';ctx.lineWidth=1.7;ctx.beginPath();ctx.ellipse(x+(side<0?cx-22:22),y,10,17,y%68?pi/5:-pi/5,0,tau);ctx.stroke();}
      }
    }else if(active===5){
      // Libra: two balanced architectural slabs tilt, lock and release.
      for(let side of [-1,1]){ctx.save();ctx.translate(cx,cy+side*(1-q)*h*.65);ctx.rotate(side*(1-q)*.08);const top=side<0?-h:0;
        surface([[-w,top],[w,top],[w,top+h],[-w,top+h]],'#292216','#d0b573');stroke([[-w,side*8],[w,side*8]],'#f1d99a99',2);ctx.restore();}
      ctx.globalAlpha=q;ring(cx,cy,50,'#d7bc7e',0);stroke([[cx-130,cy],[cx+130,cy]],'#d9bf80',2);stroke([[cx,cy-65],[cx,cy+65]],'#d9bf80',2);
    }else if(active===6){
      // Phoenix: overlapping feather plates form a full fan-shaped curtain.
      const radius=D*1.4*q,base=h*1.12;for(let j=0;j<11;j++){const a=pi+j*pi/11,b=pi+(j+1.12)*pi/11,pts=[[cx,base]];for(let k=0;k<=8;k++){const t=a+(b-a)*k/8;pts.push([cx+Math.cos(t)*radius,base+Math.sin(t)*radius]);}surface(pts,j%2?'#311b1c':'#241626',j%2?'#e5b36d':'#bc7658');
        const mid=(a+b)/2;stroke([[cx+Math.cos(mid)*radius*.2,base+Math.sin(mid)*radius*.2],[cx+Math.cos(mid)*radius*.95,base+Math.sin(mid)*radius*.95]],'#f1c38b66');}
    }else if(active===7){
      // Gemini: mirrored dimensional doors, with two shrinking lens apertures.
      ctx.fillStyle='#14132a';ctx.fillRect(0,0,w,h);const rx=D*.5*(1-q),ry=D*.75*(1-q);ctx.save();ctx.globalCompositeOperation='destination-out';for(const ax of [w*.27,w*.73]){ctx.beginPath();ctx.ellipse(ax,cy,rx,ry,0,0,tau);ctx.fill();}ctx.restore();
      for(let side of [-1,1]){const x=side<0?w*.27:w*.73;for(let j=0;j<3;j++){ctx.strokeStyle=side<0?'#ae9bda':'#93cbd7';ctx.lineWidth=j?1:2;ctx.beginPath();ctx.ellipse(x,cy,Math.max(1,rx+j*7),Math.max(1,ry+j*9),0,0,tau);ctx.stroke();}for(let k=0;k<5;k++)stroke([[x+side*k*20,0],[x+side*(k*20+40),h*.25],[x+side*k*20,h*.75],[x+side*(k*20+40),h]],'#a695c52a');}
    }else{
      // Sagittarius: one engraved arrow-shaped sheet traverses the entire scene.
      const x=w*(-.65+p*3.6),tail=x-w*1.8;surface([[tail,0],[x-w*.25,0],[x+w*.18,cy],[x-w*.25,h],[tail,h]],'#30261a','#e0c37e');
      stroke([[x-w*.25+12,12],[x+w*.18-14,cy],[x-w*.25+12,h-12]],'#f8dc9d',2);
      for(let j=0;j<14;j++){const sx=tail+j*w*.12;stroke([[sx,cy-h*.35],[sx+w*.2,cy],[sx,cy+h*.35]],'#d7bd8055');}
    }
    ctx.restore();if(p<1)frame=requestAnimationFrame(draw);else stop();
  }
  function start(index,dir){stop();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(!canvas){canvas=document.createElement('canvas');canvas.id='celestialTransition';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);ctx=canvas.getContext('2d');}w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,1.25);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);active=index;direction=dir;canvas.dataset.effect=names[index];document.body.dataset.transition=names[index];canvas.hidden=false;started=performance.now();frame=requestAnimationFrame(draw);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
  return{start,stop,names};
})();
