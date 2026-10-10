// Adapted from React Bits TiltedCard by David Haz; see LICENSE.md.
// Keep server-rendered project artwork intact and animate a dedicated inner layer.
import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
export default function TiltedCard({ target, rotateAmplitude = 3, scaleOnHover = 1.015 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { damping: 30, stiffness: 100, mass: 2 });
  const rotateY = useSpring(y, { damping: 30, stiffness: 100, mass: 2 });
  const scale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });
  useEffect(() => {
    const layer = document.createElement('div');
    layer.className = 'rb-tilted-layer';
    const original = [...target.childNodes];
    original.forEach(node => layer.append(node));
    target.append(layer);
    target.classList.add('rb-tilted');
    const draw = () => {
      layer.style.transform = `rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg) scale(${scale.get()})`;
    };
    const off = [rotateX.on('change',draw),rotateY.on('change',draw),scale.on('change',draw)];
    const move = e => {
      if (e.pointerType !== 'mouse') return;
      const rect = target.getBoundingClientRect();
      x.set(((e.clientY-rect.top-rect.height/2)/(rect.height/2))*-rotateAmplitude);
      y.set(((e.clientX-rect.left-rect.width/2)/(rect.width/2))*rotateAmplitude);
      scale.set(scaleOnHover);
    };
    const reset = () => { x.set(0); y.set(0); scale.set(1); };
    target.addEventListener('pointermove',move);
    target.addEventListener('pointerleave',reset);
    window.addEventListener('blur',reset);
    return () => {
      off.forEach(fn=>fn());
      target.removeEventListener('pointermove',move);
      target.removeEventListener('pointerleave',reset);
      window.removeEventListener('blur',reset);
      original.forEach(node=>target.insertBefore(node,layer));
      layer.remove(); target.classList.remove('rb-tilted');
    };
  },[target]);
  return null;
}
