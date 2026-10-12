import React from 'react';
import { createRoot } from 'react-dom/client';
import Stack from './Stack';
import AnimatedContent from './AnimatedContent';
export function mountReactBits() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  let cleanups = [];
  function mount() {
    cleanups.splice(0).forEach(fn => fn());
    if (reduced.matches) return;
    const stackHost = document.querySelector('#hero-image-stack');
    if (stackHost) {
      const original = [...stackHost.childNodes];
      const mountHost = document.createElement('div'); mountHost.className='stack-mount';
      stackHost.replaceChildren(mountHost);
      const root=createRoot(mountHost);
      const next=document.querySelector('.stack-next');
      const nextImage=()=>mountHost.querySelector('.stack')?.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
      const cards=[['timepieces','Close-up stock photograph of a black wristwatch'],['workspace','Stock photograph of a laptop'],['footwear','Stock photograph of athletic footwear']].map(([name,alt])=><img key={name} src={`/images/${name}.jpg`} alt={alt} width="600" height="450" draggable={false}/>);
      root.render(<AnimatedContent distance={0} duration={0.3} threshold={0.05} className="stack-entrance"><Stack cards={cards} layout="deck" visible={1} spread={0} depth={0} radius={0} shadow={false} tilt={0} speed={0.8} sendToBackOnClick autoplay={false}/></AnimatedContent>);
      next.hidden=false; next.addEventListener('click',nextImage);
      cleanups.push(()=>{next.hidden=true;next.removeEventListener('click',nextImage);root.unmount();stackHost.replaceChildren(...original);});
    }
    document.documentElement.classList.add('react-bits-ready');
    cleanups.push(()=>document.documentElement.classList.remove('react-bits-ready'));
  }
  mount(); reduced.addEventListener('change',mount);fine.addEventListener('change',mount);
  return ()=>{reduced.removeEventListener('change',mount);fine.removeEventListener('change',mount);cleanups.splice(0).forEach(fn=>fn());};
}
