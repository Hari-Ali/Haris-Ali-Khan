import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-800.css';
document.querySelector('#year').textContent = new Date().getFullYear();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.querySelector('.scene');
let frame;
scene.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const rect = scene.getBoundingClientRect();
    scene.style.setProperty('--rx', `${(event.clientY - rect.top - rect.height / 2) / 25}deg`);
    scene.style.setProperty('--ry', `${(event.clientX - rect.left - rect.width / 2) / 20}deg`);
  });
});
scene.addEventListener('pointerleave', () => {
  cancelAnimationFrame(frame);
  scene.style.setProperty('--rx', '0deg');
  scene.style.setProperty('--ry', '0deg');
});
const visibility = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      visibility.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(element => visibility.observe(element));
document.documentElement.classList.add('motion-ready');
const sceneVisibility = new IntersectionObserver(entries => {
  scene.classList.toggle('paused', !entries[0].isIntersecting);
});
sceneVisibility.observe(scene);
document.addEventListener('visibilitychange', () => scene.classList.toggle('tab-hidden', document.hidden));
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const brief = document.querySelector('#project-brief').value.trim();
  if (!brief) {
    document.querySelector('#project-brief').setCustomValidity('Please describe your project.');
    document.querySelector('#project-brief').reportValidity();
    return;
  }
  document.querySelector('#prepared-brief').value = `Project enquiry for HUR Solution\nService: ${document.querySelector('#project-type').value}\n\n${brief}`;
  document.querySelector('#email-enquiry').href = `mailto:alikhanharis515@gmail.com?subject=${encodeURIComponent('Project enquiry — ' + document.querySelector('#project-type').value)}&body=${encodeURIComponent(document.querySelector('#prepared-brief').value)}`;
  document.querySelector('#brief-result').hidden = false;
  document.querySelector('#prepared-brief').focus();
});
document.querySelector('#project-brief').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const text = document.querySelector('#prepared-brief');
  try {
    await navigator.clipboard.writeText(text.value);
    document.querySelector('#copy-status').textContent = 'Copied. Your brief has not been sent.';
  } catch {
    text.focus(); text.select();
    document.querySelector('#copy-status').textContent = 'Select and copy the brief manually.';
  }
});
