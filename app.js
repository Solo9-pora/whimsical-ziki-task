const pair=document.querySelector('#gearPair');
const title=document.querySelector('#settingsTitle');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
const largeGear=document.querySelector('.gear-large');
const smallGear=document.querySelector('.gear-small');
const gearSize=()=>({w:pair.getBoundingClientRect().width||76,h:pair.getBoundingClientRect().height||59});
const origin=()=>{const r=title.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}};
let current=origin(),route=[],raf=0,lastPlan=0,lastPointer=null,visible=false,exitingHeading=false,activeBlocks=[],largeAngle=-9.5,smallAngle=-14.5;

function makeGearPath(teeth){
  const profile=[[-.50,.58],[-.34,.58],[-.25,.80],[-.25,1],[.25,1],[.25,.80],[.34,.58],[.50,.58]],points=[];
  for(let tooth=0;tooth<teeth;tooth++)profile.forEach(([offset,radius])=>{const angle=(tooth+offset)*Math.PI*2/teeth-Math.PI/2;points.push(`${(50+Math.cos(angle)*45).toFixed(2)},${(50+Math.sin(angle)*45).toFixed(2)}`)});
  return `M${points.join(' L')}Z`;
}
function buildGear(svg,teeth,fillId,colors){
  const ns='http://www.w3.org/2000/svg',shape=svg.querySelector('.gear-shape'),defs=document.createElementNS(ns,'defs');
  const addGradient=(id,stops)=>{const gradient=document.createElementNS(ns,'linearGradient');gradient.id=id;gradient.setAttribute('x1','0');gradient.setAttribute('y1','0');gradient.setAttribute('x2','1');gradient.setAttribute('y2','1');stops.forEach(([offset,color])=>{const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);gradient.append(stop)});defs.append(gradient)};
  addGradient(fillId,colors);addGradient(`${fillId}Depth`,[['0%','#35eaff'],['45%','#2878f7'],['100%','#271878']]);svg.prepend(defs);
  shape.setAttribute('d',makeGearPath(teeth));shape.style.fill=`url(#${fillId})`;shape.style.stroke=colors[0][1];
  const depth=shape.cloneNode();depth.removeAttribute('style');depth.setAttribute('class','gear-depth');depth.setAttribute('d',shape.getAttribute('d'));depth.setAttribute('transform','translate(-5 -7)');depth.style.fill=`url(#${fillId}Depth)`;depth.style.stroke='#2b40ba';svg.insertBefore(depth,shape);
}
buildGear(largeGear,12,'gearBlue',[['0%','#ff254f'],['48%','#fa164b'],['100%','#ed318a']]);
buildGear(smallGear,9,'gearViolet',[['0%','#ff315c'],['48%','#f51963'],['100%','#d529a0']]);
function setGearAngles(){largeGear.style.rotate=`${largeAngle}deg`;smallGear.style.rotate=`${smallAngle}deg`}
setGearAngles();
function turnGears(distance){const largePitch=largeGear.getBoundingClientRect().width*.45*12/14,smallPitch=smallGear.getBoundingClientRect().width*.45*9/11;largeAngle-=distance/largePitch*180/Math.PI;smallAngle+=distance/smallPitch*180/Math.PI;setGearAngles()}
function place(point){const size=gearSize();pair.style.left=`${point.x}px`;pair.style.top=`${point.y}px`;pair.style.transform='translate3d(-50%,-50%,0)';pair.style.setProperty('--gear-half-width',`${size.w/2}px`)}
function obstacles(){
  const size=gearSize(),pad=8,items=[...document.querySelectorAll('[data-no-gear],input,select,textarea,button')];
  const rects=items.flatMap(el=>{
    if(el.matches('input,select,textarea,button'))return [el.getBoundingClientRect()];
    const range=document.createRange();range.selectNodeContents(el);return [...range.getClientRects()];
  });
  return rects.filter(r=>r.width&&r.height&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth).map(r=>({left:r.left-size.w/2-pad,right:r.right+size.w/2+pad,top:r.top-size.h/2-pad,bottom:r.bottom+size.h/2+pad}));
}
function blocked(point,blocks){return point.x<40||point.y<42||point.x>innerWidth-40||point.y>innerHeight-38||blocks.some(r=>point.x>r.left&&point.x<r.right&&point.y>r.top&&point.y<r.bottom)}
function safeNear(point,blocks,departure=false){
  const candidates=[];
  for(const radius of [48,62,78,96,116,140,168])for(let i=0;i<24;i++){
    const angle=i*Math.PI/12,x=point.x+Math.cos(angle)*radius,y=point.y+Math.sin(angle)*radius;
    if(departure&&Math.abs(x-point.x)<Math.abs(y-point.y))continue;
    if(!blocked({x,y},blocks))candidates.push({x,y,score:Math.hypot(x-point.x,y-point.y)});
  }
  candidates.sort((a,b)=>a.score-b.score);return candidates[0]||null;
}
function safeDeparture(blocks){
  const r=title.getBoundingClientRect(),size=gearSize(),y=r.top+r.height/2,copy=title.parentElement.getBoundingClientRect();
  const candidates=[{x:copy.right+size.w/2+22,y},{x:copy.left-size.w/2-22,y},{x:r.left+r.width/2,y:r.top-size.h/2-18},{x:r.left+r.width/2,y:r.bottom+size.h/2+18}];
  return candidates.find(point=>!blocked(point,blocks))||safeNear({x:r.left+r.width/2,y},blocks,true);
}
function segmentClear(a,b,blocks){
  const dx=b.x-a.x,dy=b.y-a.y;
  return !blocks.some(r=>{let t0=0,t1=1;const tests=[[-dx,a.x-r.left],[dx,r.right-a.x],[-dy,a.y-r.top],[dy,r.bottom-a.y]];for(const[p,q]of tests){if(!p){if(q<0)return false;continue}const t=q/p;if(p<0){if(t>t1)return false;if(t>t0)t0=t}else{if(t<t0)return false;if(t<t1)t1=t}}return t0<=t1});
}
function findPath(start,end,blocks){
  const nodes=[start,end];
  blocks.forEach(r=>[{x:r.left-7,y:r.top-7},{x:r.right+7,y:r.top-7},{x:r.right+7,y:r.bottom+7},{x:r.left-7,y:r.bottom+7}].forEach(p=>{if(!blocked(p,blocks))nodes.push(p)}));
  const dist=nodes.map((_,i)=>i?Infinity:0),prev=nodes.map(()=>-1),done=nodes.map(()=>false);
  for(let step=0;step<nodes.length;step++){
    let at=-1;for(let i=0;i<nodes.length;i++)if(!done[i]&&(at<0||dist[i]<dist[at]))at=i;
    if(at<0||!Number.isFinite(dist[at]))break;if(at===1)break;done[at]=true;
    for(let j=0;j<nodes.length;j++)if(!done[j]&&j!==at&&segmentClear(nodes[at],nodes[j],blocks)){const cost=dist[at]+Math.hypot(nodes[at].x-nodes[j].x,nodes[at].y-nodes[j].y);if(cost<dist[j]){dist[j]=cost;prev[j]=at}}
  }
  if(!Number.isFinite(dist[1]))return null;const path=[];for(let at=1;at>0;at=prev[at])path.unshift(nodes[at]);return path;
}
function routeTo(pointer,initial=false){
  const blocks=obstacles();let start=current;
  if(initial){const r=title.getBoundingClientRect(),headingCenter={x:r.left+r.width/2,y:r.top+r.height/2},exit=safeDeparture(blocks);if(!exit)return false;start=headingCenter;const target=safeNear(pointer,blocks);if(!target)return false;const afterExit=findPath(exit,target,blocks);if(!afterExit)return false;route=[exit,...afterExit];current=start;exitingHeading=true;pair.classList.add('is-visible')}
  else{const target=safeNear(pointer,blocks);if(!target)return false;const path=findPath(start,target,blocks);if(!path)return false;route=path}
  if(route.length){activeBlocks=blocks;pair.dataset.moving='true';if(!raf)raf=requestAnimationFrame(step)}return true;
}
function step(){
  if(!route.length){raf=0;pair.dataset.moving='false';return}
  const next=route[0],dx=next.x-current.x,dy=next.y-current.y,distance=Math.hypot(dx,dy),advance=Math.min(distance,7);
  if(distance<7){turnGears(distance);current=next;route.shift();if(exitingHeading)exitingHeading=false}else{turnGears(advance);current={x:current.x+dx/distance*advance,y:current.y+dy/distance*advance};if(!exitingHeading&&blocked(current,activeBlocks)){route=[];pair.classList.remove('is-visible');pair.dataset.moving='false';raf=0;return}}
  place(current);raf=requestAnimationFrame(step);
}
function pointerMove(event){
  if(!finePointer.matches||reduced.matches||event.pointerType==='touch')return;
  lastPointer={x:event.clientX,y:event.clientY};const now=performance.now();if(now-lastPlan<250)return;lastPlan=now;
  const initial=!visible;visible=routeTo(lastPointer,initial)||visible;
}
document.querySelector('.settings-shell').addEventListener('pointermove',pointerMove,{passive:true});
document.querySelector('.settings-shell').addEventListener('pointerleave',()=>{visible=false;route=[];pair.classList.remove('is-visible');pair.dataset.moving='false';current=origin();place(current)});
window.addEventListener('resize',()=>{route=[];visible=false;pair.classList.remove('is-visible');pair.dataset.moving='false';current=origin();place(current)});
window.addEventListener('scroll',()=>{if(visible){route=[];visible=false;pair.classList.remove('is-visible');pair.dataset.moving='false';current=origin();place(current)}},{passive:true});
place(current);
if(reduced.matches||!finePointer.matches){pair.classList.add('is-visible');pair.style.opacity='.2'}
reduced.addEventListener?.('change',event=>{if(event.matches){route=[];visible=false;pair.dataset.moving='false';pair.classList.remove('is-visible');pair.style.opacity='.2';current=origin();place(current)}else pair.style.opacity=''})
document.querySelector('#saveButton').addEventListener('click',()=>{const note=document.querySelector('#saveNote');note.textContent='Settings saved';window.setTimeout(()=>{note.textContent=''},2200)});
