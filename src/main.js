import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
document.querySelector('#year').textContent = new Date().getFullYear();
const scene = document.querySelector('.scene');
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const entrance = gsap.timeline({defaults:{ease:'power3.out'}});
  entrance.from('.line > span',{yPercent:105,duration:1.2,stagger:.13},.1)
    .from('.hero-description, .hero-actions',{opacity:0,y:16,duration:.85,stagger:.1},.55)
    .from('.bag-float',{opacity:0,y:25,duration:1.4},.25)
    .from('.scene-caption, .hero-bottom',{opacity:0,duration:1},.9);
  gsap.utils.toArray('.reveal').forEach(element => {
    gsap.from(element,{y:24,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 92%',once:true}});
  });
  const float = gsap.to('.bag-float',{y:-10,duration:3.6,repeat:-1,yoyo:true,ease:'sine.inOut'});
  const rotation = gsap.to('.bag-object',{rotationY:-16,rotationZ:-5,duration:5.2,repeat:-1,yoyo:true,ease:'sine.inOut'});
  const shade = gsap.to('.bag-shadow',{scaleX:.88,opacity:.6,duration:3.6,repeat:-1,yoyo:true,ease:'sine.inOut'});
  const sceneTrigger = ScrollTrigger.create({trigger:scene,start:'top bottom',end:'bottom top',onToggle:self=>[float,rotation,shade].forEach(t=>self.isActive?t.resume():t.pause())});
  const handleVisibility = () => [float,rotation,shade].forEach(t=>document.hidden||!sceneTrigger.isActive?t.pause():t.resume());
  document.addEventListener('visibilitychange',handleVisibility);
  gsap.utils.toArray('.work-image').forEach(image=>{
    gsap.fromTo(image.querySelector('.chair-object, .assembly-art'),{y:12},{y:-12,ease:'none',scrollTrigger:{trigger:image,start:'top bottom',end:'bottom top',scrub:1}});
  });
  const clickHandler = event => {
    const link=event.target.closest('a[href^="#"]');
    if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const id=link.getAttribute('href');
    const target=id==='#'?0:document.querySelector(id);
    if(target===null)return;
    event.preventDefault();
    gsap.to(window,{duration:.95,scrollTo:{y:target,offsetY:35,autoKill:true},ease:'power2.inOut',onComplete:()=>{
      history.pushState(null,'',id);
      if(target instanceof HTMLElement){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}
    }});
  };
  document.addEventListener('click',clickHandler);
  return()=>{document.removeEventListener('click',clickHandler);document.removeEventListener('visibilitychange',handleVisibility)};
});
mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const cleanups=[];
  document.querySelectorAll('.magnetic').forEach(button=>{
    const move=event=>{const rect=button.getBoundingClientRect();gsap.to(button,{x:(event.clientX-rect.left-rect.width/2)*.12,y:(event.clientY-rect.top-rect.height/2)*.16,duration:.35,ease:'power2.out'})};
    const leave=()=>gsap.to(button,{x:0,y:0,duration:.55,ease:'power3.out'});
    button.addEventListener('pointermove',move);button.addEventListener('pointerleave',leave);
    cleanups.push(()=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',leave)});
  });
  const tilt=event=>{const rect=scene.getBoundingClientRect();gsap.to('.bag-float',{rotationY:(event.clientX-rect.left-rect.width/2)/35,rotationX:-(event.clientY-rect.top-rect.height/2)/50,duration:.8,ease:'power2.out'})};
  const reset=()=>gsap.to('.bag-float',{rotationX:0,rotationY:0,duration:1,ease:'power3.out'});
  scene.addEventListener('pointermove',tilt);scene.addEventListener('pointerleave',reset);
  document.querySelectorAll('.service').forEach(card=>{
    const enter=()=>gsap.to(card.querySelector('.service-arrow'),{x:5,y:-5,duration:.35,ease:'power2.out'});
    const leave=()=>gsap.to(card.querySelector('.service-arrow'),{x:0,y:0,duration:.45,ease:'power3.out'});
    card.addEventListener('pointerenter',enter);card.addEventListener('pointerleave',leave);
    cleanups.push(()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('pointerleave',leave)});
  });
  return()=>{cleanups.forEach(fn=>fn());scene.removeEventListener('pointermove',tilt);scene.removeEventListener('pointerleave',reset)};
});
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const brief = document.querySelector('#project-brief').value.trim();
  if (!brief) {document.querySelector('#project-brief').setCustomValidity('Please describe your project.');document.querySelector('#project-brief').reportValidity();return;}
  const service=document.querySelector('#project-type').value;
  document.querySelector('#prepared-brief').value=`Project enquiry for HUR Solution\nName: ${document.querySelector("#client-name").value.trim() || "Not provided"}\nWebsite: ${document.querySelector("#store-url").value.trim() || "Not provided"}\nService: ${service}\nBudget: ${document.querySelector("#project-budget").value}\nTimeline: ${document.querySelector("#project-timeline").value}\n\n${brief}`;
  document.querySelector('#email-enquiry').href=`mailto:alikhanharis515@gmail.com?subject=${encodeURIComponent('Project enquiry — '+service)}&body=${encodeURIComponent(document.querySelector('#prepared-brief').value)}`;
  document.querySelector('#brief-result').hidden=false;
  document.querySelector('#prepared-brief').focus();
});
document.querySelector('#project-brief').addEventListener('input',event=>event.target.setCustomValidity(''));
document.querySelector('#copy-brief').addEventListener('click',async()=>{
  const text=document.querySelector('#prepared-brief');
  try{await navigator.clipboard.writeText(text.value);document.querySelector('#copy-status').textContent='Copied. Your brief has not been sent.';}
  catch{text.focus();text.select();document.querySelector('#copy-status').textContent='Select and copy the brief manually.';}
});
