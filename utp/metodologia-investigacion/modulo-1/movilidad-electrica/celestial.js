/* Celestial background, independent of scene transitions. */
window.drawZodiacBackground=(ctx,w,h,t)=>{
  ctx.save();ctx.translate(w*.86,h*.49);ctx.rotate(t*.000008);const r=Math.min(w*.32,h*.45);ctx.strokeStyle='#d9b66f';ctx.lineWidth=.65;ctx.globalAlpha=.13;
  for(let ring of [.78,.91,1,1.035]){ctx.beginPath();ctx.arc(0,0,r*ring,0,Math.PI*2);ctx.stroke();}
  const glyphs='♈♉♊♋♌♍♎♏♐♑♒♓';ctx.font=`${Math.max(12,r*.065)}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';
  for(let j=0;j<12;j++){const a=j*Math.PI/6;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.78,Math.sin(a)*r*.78);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);ctx.stroke();ctx.fillStyle='#e4c987';ctx.fillText(glyphs[j]+'\uFE0E',Math.cos(a+Math.PI/12)*r*.85,Math.sin(a+Math.PI/12)*r*.85);}
  ctx.globalAlpha=.08;ctx.beginPath();for(let j=0;j<7;j++){const a=j*Math.PI*4/6;j?ctx.lineTo(Math.cos(a)*r*.68,Math.sin(a)*r*.68):ctx.moveTo(Math.cos(a)*r*.68,Math.sin(a)*r*.68);}ctx.stroke();ctx.restore();
};
