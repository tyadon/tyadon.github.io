import { runCommand } from './terminal-core.js';
import { APP_IDS } from './index.js';

export function render(body, ctx) {
  body.classList.add('term');
  body.innerHTML = '<div class="term-out" aria-live="polite"></div><form class="term-line"><label for="term-in">&gt;</label><input id="term-in" autocomplete="off" spellcheck="false" autocapitalize="off"></form>';
  const out = body.querySelector('.term-out');
  const input = body.querySelector('input');
  const print = (lines) => {
    for (const l of lines) {
      const div = document.createElement('div');
      div.textContent = l || ' ';
      out.appendChild(div);
    }
    body.scrollTop = body.scrollHeight;
  };
  print(['TreyOS terminal. type help.', '']);
  body.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    print([`> ${input.value}`]);
    const r = runCommand(input.value, { apps: APP_IDS, content: ctx.content });
    if (r.clear) out.textContent = '';
    print(r.lines);
    if (r.open) ctx.openApp(r.open);
    input.value = '';
  });
  body.addEventListener('click', () => input.focus());
  setTimeout(() => input.focus(), 0);
}
