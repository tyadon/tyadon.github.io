// Terminal command interpreter. Pure: returns lines to print and side effects to perform.

const NEWTON = [
  '   /\\_/\\  ',
  '  ( o.o ) ',
  '   > ^ <  woof',
  '  (_____) ',
];

const HELP = [
  'help              this list',
  'whoami            who runs this computer',
  'ls                list apps',
  'open <app>        open an app, e.g. open darkroom',
  'cat readme        print the ReadMe',
  'date              today',
  'clear             clear the screen',
];

export function runCommand(input, ctx) {
  const [cmd = '', ...args] = String(input).trim().split(/\s+/).filter(Boolean);
  const name = cmd.toLowerCase();
  const arg = (args[0] || '').toLowerCase();
  switch (name) {
    case '': return { lines: [] };
    case 'help': return { lines: HELP };
    case 'whoami': return { lines: [`trey. builds apps. ${ctx.content.site.city.toLowerCase()}.`] };
    case 'ls': return { lines: [ctx.apps.map((a) => `${a}.app`).join('  ')] };
    case 'open':
      if (ctx.apps.includes(arg)) return { lines: [`opening ${arg}...`], open: arg };
      return { lines: [`open: no app named "${args[0] || ''}". try ls`] };
    case 'cat':
      if (arg === 'readme') return { lines: [ctx.content.readme.title, '', ...ctx.content.readme.paragraphs] };
      return { lines: [`cat: ${args[0] || ''}: no such file`] };
    case 'date': return { lines: [new Date().toDateString()] };
    case 'clear': return { lines: [], clear: true };
    case 'newton': return { lines: NEWTON };
    case 'sudo': return { lines: ['nice try.'] };
    default: return { lines: [`command not found: ${name}`] };
  }
}
