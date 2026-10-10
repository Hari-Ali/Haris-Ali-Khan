import React from 'react';
import { createRoot } from 'react-dom/client';
import BlurText from './BlurText';
import SpotlightCard from './SpotlightCard';
import TiltedCard from './TiltedCard';
export function mountReactBits() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  let cleanups = [];
  function mount() {
    cleanups.splice(0).forEach(fn => fn());
    if (reduced.matches) return;
    const heading = document.querySelector('.about-manifesto h2');
    if (heading) {
      const nodes = [...heading.childNodes];
      const label = heading.textContent.replace(/\s+/g,' ').trim();
      const host = document.createElement('span');
      host.className='rb-blur-heading'; host.setAttribute('aria-hidden','true');
      heading.replaceChildren(host); heading.setAttribute('aria-label', label);
      const root=createRoot(host);
      root.render(<><BlurText text="One clear vision." className="rb-blur-line" direction="bottom" delay={65} animationFrom={{filter:'blur(5px)',opacity:0,y:18}} animationTo={[{filter:'blur(0px)',opacity:1,y:0}]} stepDuration={0.65}/><BlurText text="Every detail matters." className="rb-blur-line rb-muted" direction="bottom" delay={65} animationFrom={{filter:'blur(5px)',opacity:0,y:18}} animationTo={[{filter:'blur(0px)',opacity:1,y:0}]} stepDuration={0.65}/></>);
      cleanups.push(()=>{root.unmount(); heading.replaceChildren(...nodes); heading.removeAttribute('aria-label');});
    }
    if (fine.matches) {
      const host=document.createElement('div'); host.className='rb-controller'; document.body.append(host);
      const root=createRoot(host);
      const services=[...document.querySelectorAll('.service-panel')].slice(0,2);
      services.forEach(e=>e.classList.add('rb-spotlight'));
      root.render(<>{services.map((target,i)=><SpotlightCard key={`s${i}`} target={target} theme={i===0?'light':'dark'} spotlightColor={i===0?'#ffffff':'#a9baff'} intensity={0.12} borderGlow={0.2} proximity={0} flare={false} spotlightSize={350} smoothing={0.15}/>)}{[...document.querySelectorAll('.work-image')].map((target,i)=><TiltedCard key={`p${i}`} target={target}/>)}</>);
      cleanups.push(()=>{root.unmount();host.remove();services.forEach(e=>e.classList.remove('rb-spotlight'));});
    }
    document.documentElement.classList.add('react-bits-ready');
    cleanups.push(()=>document.documentElement.classList.remove('react-bits-ready'));
  }
  mount(); reduced.addEventListener('change',mount);fine.addEventListener('change',mount);
  return ()=>{reduced.removeEventListener('change',mount);fine.removeEventListener('change',mount);cleanups.splice(0).forEach(fn=>fn());};
}
