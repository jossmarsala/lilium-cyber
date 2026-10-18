/**
 * Shell command dispatcher for the Terminal app — El Invernadero Lab 1.
 *
 * All filesystem reads and mutations go through lab1Store (the Single Source
 * of Truth). This file contains zero standalone state of its own; it is a
 * pure function registry that calls the store mutators and formats output for
 * the terminal scrollback.
 *
 * Supported shell conventions:
 *  - Pipes:        cmd1 | cmd2 | cmd3
 *  - Redirections: cmd > file  (overwrite) and  cmd >> file  (append)
 *  - Sudo prefix:  sudo <cmd> — elevates user to 'root' for one command
 *  - Tab completion on command names
 */

import { lab1Store } from '../../services/lab1/lab1Store';
import type { Lab1State } from '../../services/lab1/types';

// ---------------------------------------------------------------------------
// Public shell types (used by Terminal.tsx)
// ---------------------------------------------------------------------------

export type ShellSignal =
  | { type: 'none' }
  | { type: 'clear' }
  | { type: 'open'; appId: string }
  | { type: 'cd'; path: string }
  | { type: 'su'; user: string };

export interface CommandResult {
  /** Lines to append to the terminal scrollback. */
  output: string[];
  /** Side-effect intent for the renderer. */
  signal: ShellSignal;
}

export interface CommandContext {
  /** Current session state snapshot (read-only from Terminal's perspective). */
  state: Lab1State;
  /** IDs of desktop apps the `open` command may launch. */
  openableAppIds: readonly string[];
  /** Human labels keyed by app ID. */
  appLabels: Readonly<Record<string, string>>;
  /** Whether `sudo` prefix was used on this invocation. */
  isSudo: boolean;
}

interface CommandDef {
  summary: string;
  usage: string;
  run: (args: string[], ctx: CommandContext, stdin?: string[]) => CommandResult;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NONE: ShellSignal = { type: 'none' };

function ok(output: string[], signal: ShellSignal = NONE): CommandResult {
  return { output, signal };
}

function err(msg: string): CommandResult {
  return { output: [msg], signal: NONE };
}

/**
 * Resolve a path relative to the current CWD.
 * Handles: absolute, ~, relative, . and .. segments.
 */
function resolvePath(rawPath: string, cwd: string, user: string): string {
  let p = rawPath.trim();
  if (!p || p === '.') return cwd;

  if (p.startsWith('~/')) {
    p = `/home/${user}/${p.slice(2)}`;
  } else if (p === '~') {
    p = `/home/${user}`;
  } else if (!p.startsWith('/')) {
    p = cwd === '/' ? `/${p}` : `${cwd}/${p}`;
  }

  // Resolve . and ..
  const parts = p.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return '/' + stack.join('/');
}

/** List direct children of a directory node from the flat-path FS. */
function listDirEntries(
  fs: Lab1State['fs'],
  dirPath: string,
  showHidden = false,
): string[] {
  const prefix = dirPath === '/' ? '/' : dirPath + '/';
  const names = new Set<string>();

  for (const key of Object.keys(fs)) {
    if (key === dirPath) continue;
    if (!key.startsWith(prefix)) continue;
    const rest = key.slice(prefix.length);
    if (!rest) continue;
    const firstSegment = rest.split('/')[0]!;
    if (!showHidden && firstSegment.startsWith('.')) continue;
    names.add(firstSegment);
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

/** Format a permissions octal string into ls -l style (e.g. 'rwxr-xr-x'). */
function permsToStr(perms: string, type: string): string {
  const typeChar = type === 'dir' ? 'd' : type === 'symlink' ? 'l' : '-';
  const digits = perms.replace(/^0/, '').padStart(3, '0');
  const bits = (digit: string) => {
    const n = parseInt(digit, 10);
    return (
      (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-')
    );
  };
  return typeChar + bits(digits[0]!) + bits(digits[1]!) + bits(digits[2]!);
}

// ---------------------------------------------------------------------------
// Command registry
// ---------------------------------------------------------------------------

export const COMMANDS: Record<string, CommandDef> = {
  // --- Navigation -----------------------------------------------------------
  pwd: {
    summary: 'Muestra el directorio de trabajo actual.',
    usage: 'pwd',
    run: (_a, ctx) => ok([ctx.state.cwd]),
  },

  cd: {
    summary: 'Cambia el directorio de trabajo.',
    usage: 'cd [dir]',
    run: (args, ctx) => {
      const { state } = ctx;
      const target = args[0] ?? `~`;
      const resolved = resolvePath(target, state.cwd, state.currentUser);

      // Validate the path exists and is a directory in the flat FS
      const node = state.fs[resolved];
      if (!node) {
        return err(`cd: ${args[0] ?? '~'}: No existe el archivo o el directorio`);
      }
      if (node.type !== 'dir') {
        return err(`cd: ${args[0]}: No es un directorio`);
      }

      // Permission check: execute bit on directory = traverse
      if (state.currentUser !== 'root') {
        const perms = node.perms;
        const isOwner = state.currentUser === node.owner;
        const xBit = isOwner
          ? parseInt(perms[0]!, 8) & 1
          : parseInt(perms[2]!, 8) & 1;
        if (!xBit) {
          return err(`cd: ${args[0]}: Permiso denegado`);
        }
      }

      return { output: [], signal: { type: 'cd', path: resolved } };
    },
  },

  // --- File Listing ---------------------------------------------------------
  ls: {
    summary: 'Lista el contenido de un directorio.',
    usage: 'ls [-la] [dir]',
    run: (args, ctx) => {
      const { state } = ctx;
      const flags = args.filter((a) => a.startsWith('-')).join('');
      const pathArg = args.find((a) => !a.startsWith('-'));
      const showHidden = flags.includes('a');
      const longFormat = flags.includes('l');

      const targetPath = pathArg
        ? resolvePath(pathArg, state.cwd, state.currentUser)
        : state.cwd;
      const node = state.fs[targetPath];

      if (!node) {
        return err(`ls: no se puede acceder a '${pathArg ?? '.'}': No existe el archivo o el directorio`);
      }

      if (node.type !== 'dir') {
        // Listing a single file
        if (longFormat) {
          return ok([`${permsToStr(node.perms, node.type)} 1 ${node.owner} ${node.group} ${node.size} ${node.modified} ${pathArg}`]);
        }
        return ok([pathArg ?? targetPath]);
      }

      const entries = listDirEntries(state.fs, targetPath, showHidden);

      if (entries.length === 0) return ok([]);

      if (longFormat) {
        const lines: string[] = ['total ' + entries.length * 4];
        for (const name of entries) {
          const childPath = targetPath === '/' ? `/${name}` : `${targetPath}/${name}`;
          const child = state.fs[childPath];
          if (!child) continue;
          const marker = child.type === 'dir' ? '/' : child.type === 'symlink' ? ' ->' : '';
          const target = child.type === 'symlink' && child.target ? ` ${child.target}` : '';
          lines.push(
            `${permsToStr(child.perms, child.type)} 1 ${child.owner.padEnd(8)} ${child.group.padEnd(8)} ${String(child.size).padStart(6)} ${child.modified} ${name}${marker}${target}`,
          );
        }
        return ok(lines);
      }

      // Short format — colorize dirs with trailing slash
      const formatted = entries.map((name) => {
        const childPath = targetPath === '/' ? `/${name}` : `${targetPath}/${name}`;
        const child = state.fs[childPath];
        if (!child) return name;
        if (child.type === 'dir') return `${name}/`;
        if (child.type === 'symlink') return `${name}@`;
        return name;
      });

      return ok([formatted.join('  ')]);
    },
  },

  // --- File Reading ---------------------------------------------------------
  cat: {
    summary: 'Muestra el contenido de un archivo.',
    usage: 'cat <archivo>',
    run: (args, ctx, stdin) => {
      if (args.length === 0 && stdin && stdin.length > 0) {
        return ok(stdin);
      }
      const path = args[0];
      if (!path) return err('cat: falta el operando de archivo');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const res = lab1Store.readFile(resolved, ctx.state.currentUser);
      if (!res.success) return err(res.error ?? '');
      return ok((res.content ?? '').split('\n'));
    },
  },

  head: {
    summary: 'Muestra las primeras N líneas de un archivo.',
    usage: 'head [-n N] <archivo>',
    run: (args, ctx, stdin) => {
      let count = 10;
      let filePath = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) {
          count = parseInt(args[i + 1]!, 10) || 10;
          i++;
        } else if (!filePath) {
          filePath = args[i]!;
        }
      }
      let lines: string[] = stdin ?? [];
      if (filePath) {
        const resolved = resolvePath(filePath, ctx.state.cwd, ctx.state.currentUser);
        const res = lab1Store.readFile(resolved, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
        lines = (res.content ?? '').split('\n');
      }
      return ok(lines.slice(0, count));
    },
  },

  tail: {
    summary: 'Muestra las últimas N líneas de un archivo.',
    usage: 'tail [-n N] <archivo>',
    run: (args, ctx, stdin) => {
      let count = 10;
      let filePath = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) {
          count = parseInt(args[i + 1]!, 10) || 10;
          i++;
        } else if (!filePath) {
          filePath = args[i]!;
        }
      }
      let lines: string[] = stdin ?? [];
      if (filePath) {
        const resolved = resolvePath(filePath, ctx.state.cwd, ctx.state.currentUser);
        const res = lab1Store.readFile(resolved, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
        lines = (res.content ?? '').split('\n');
      }
      return ok(lines.slice(-count));
    },
  },

  grep: {
    summary: 'Filtra líneas que coincidan con el patrón.',
    usage: 'grep <patrón> [archivo]',
    run: (args, ctx, stdin) => {
      const flags = args.filter((a) => a.startsWith('-')).join('');
      const nonFlags = args.filter((a) => !a.startsWith('-'));
      const pattern = nonFlags[0];
      if (!pattern) return err('grep: falta el patrón de búsqueda');

      let targetLines: string[] = [];
      const filePath = nonFlags[1];

      if (filePath) {
        const resolved = resolvePath(filePath, ctx.state.cwd, ctx.state.currentUser);
        const res = lab1Store.readFile(resolved, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
        targetLines = (res.content ?? '').split('\n');
      } else if (stdin && stdin.length > 0) {
        targetLines = stdin;
      } else {
        return ok([]);
      }

      const caseFlag = flags.includes('i');
      try {
        const regex = new RegExp(pattern, caseFlag ? 'i' : '');
        return ok(targetLines.filter((l) => regex.test(l)));
      } catch {
        const lower = pattern.toLowerCase();
        return ok(targetLines.filter((l) => l.toLowerCase().includes(lower)));
      }
    },
  },

  wc: {
    summary: 'Cuenta líneas, palabras y caracteres.',
    usage: 'wc [-l] [archivo]',
    run: (args, ctx, stdin) => {
      const countLinesOnly = args.includes('-l');
      const filePath = args.find((a) => !a.startsWith('-'));
      let lines: string[] = stdin ?? [];
      if (filePath) {
        const resolved = resolvePath(filePath, ctx.state.cwd, ctx.state.currentUser);
        const res = lab1Store.readFile(resolved, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
        lines = (res.content ?? '').split('\n');
      }
      if (countLinesOnly) {
        return ok([`${lines.length}${filePath ? ' ' + filePath : ''}`]);
      }
      const wordCount = lines.join(' ').split(/\s+/).filter(Boolean).length;
      const charCount = lines.join('\n').length;
      return ok([`  ${lines.length}  ${wordCount}  ${charCount}${filePath ? ' ' + filePath : ''}`]);
    },
  },

  sort: {
    summary: 'Ordena líneas de texto.',
    usage: 'sort [archivo]',
    run: (args, ctx, stdin) => {
      const filePath = args[0];
      let lines: string[] = stdin ?? [];
      if (filePath) {
        const resolved = resolvePath(filePath, ctx.state.cwd, ctx.state.currentUser);
        const res = lab1Store.readFile(resolved, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
        lines = (res.content ?? '').split('\n');
      }
      return ok([...lines].sort((a, b) => a.localeCompare(b)));
    },
  },

  uniq: {
    summary: 'Elimina líneas repetidas consecutivas.',
    usage: 'uniq [archivo]',
    run: (args, ctx, stdin) => {
      const filePath = args[0];
      let lines: string[] = stdin ?? [];
      if (filePath) {
        const resolved = resolvePath(filePath, ctx.state.cwd, ctx.state.currentUser);
        const res = lab1Store.readFile(resolved, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
        lines = (res.content ?? '').split('\n');
      }
      const deduped: string[] = [];
      for (const l of lines) {
        if (deduped.length === 0 || deduped[deduped.length - 1] !== l) {
          deduped.push(l);
        }
      }
      return ok(deduped);
    },
  },

  // --- File Metadata --------------------------------------------------------
  file: {
    summary: 'Muestra el tipo de un archivo.',
    usage: 'file <ruta>',
    run: (args, ctx) => {
      const path = args[0];
      if (!path) return err('file: falta operando');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      return ok([lab1Store.getFileMagic(resolved)]);
    },
  },

  sha256sum: {
    summary: 'Calcula el hash SHA-256 de un archivo.',
    usage: 'sha256sum <archivo>',
    run: (args, ctx) => {
      const path = args[0];
      if (!path) return err('sha256sum: falta operando');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const hash = lab1Store.getFileSha256(resolved);
      if (!hash) return err(`sha256sum: ${path}: No existe el archivo o el directorio`);
      return ok([`${hash}  ${path}`]);
    },
  },

  stat: {
    summary: 'Muestra metadatos detallados de un archivo.',
    usage: 'stat <ruta>',
    run: (args, ctx) => {
      const path = args[0];
      if (!path) return err('stat: falta operando');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const node = ctx.state.fs[resolved];
      if (!node) return err(`stat: no se puede obtener el estado de '${path}': No existe el archivo o el directorio`);
      return ok([
        `  File: ${path}`,
        `  Size: ${node.size}\t\tType: ${node.type}`,
        `Access: (${node.perms}/${permsToStr(node.perms, node.type)})  Uid: (${node.owner})   Gid: (${node.group})`,
        `Modify: ${node.modified}`,
      ]);
    },
  },

  // --- File Creation / Modification -----------------------------------------
  touch: {
    summary: 'Crea un archivo vacío o actualiza su timestamp.',
    usage: 'touch <archivo>',
    run: (args, ctx) => {
      const path = args[0];
      if (!path) return err('touch: falta el operando de archivo');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const existing = ctx.state.fs[resolved];
      if (!existing) {
        const res = lab1Store.writeFile(resolved, '', ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
      }
      return ok([]);
    },
  },

  echo: {
    summary: 'Imprime texto en la salida estándar.',
    usage: 'echo <texto>',
    run: (args) => ok([args.join(' ')]),
  },

  // --- Directory Management -------------------------------------------------
  mkdir: {
    summary: 'Crea un directorio.',
    usage: 'mkdir [-p] <dir>',
    run: (args, ctx) => {
      const mkParents = args.includes('-p');
      const pathArg = args.find((a) => !a.startsWith('-'));
      if (!pathArg) return err('mkdir: falta operando');
      const resolved = resolvePath(pathArg, ctx.state.cwd, ctx.state.currentUser);

      if (mkParents) {
        // Create each segment
        const segments = resolved.split('/').filter(Boolean);
        let cumulative = '';
        for (const seg of segments) {
          cumulative += '/' + seg;
          if (!ctx.state.fs[cumulative]) {
            lab1Store.createDir(cumulative, '755', ctx.state.currentUser, ctx.state.currentUser);
          }
        }
        return ok([]);
      }

      const res = lab1Store.createDir(resolved, '755', ctx.state.currentUser, ctx.state.currentUser);
      if (!res.success) return err(res.error ?? '');
      return ok([]);
    },
  },

  // --- File Deletion --------------------------------------------------------
  rm: {
    summary: 'Elimina archivos o directorios.',
    usage: 'rm [-r] [-f] <ruta>',
    run: (args, ctx) => {
      const flags = args.filter((a) => a.startsWith('-')).join('');
      const recursive = flags.includes('r') || flags.includes('R');
      const force = flags.includes('f');
      const pathArgs = args.filter((a) => !a.startsWith('-'));

      if (pathArgs.length === 0) return err('rm: falta operando');

      const results: string[] = [];
      for (const pathArg of pathArgs) {
        const resolved = resolvePath(pathArg, ctx.state.cwd, ctx.state.currentUser);
        const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;
        const res = lab1Store.deleteNode(resolved, recursive, effectiveUser);
        if (!res.success && !force) {
          results.push(res.error ?? '');
        }
      }
      return ok(results);
    },
  },

  // --- Copy / Move ----------------------------------------------------------
  cp: {
    summary: 'Copia archivos o directorios.',
    usage: 'cp <origen> <destino>',
    run: (args, ctx) => {
      const src = args[0];
      const dest = args[1];
      if (!src || !dest) return err('cp: faltan operandos');
      const resolvedSrc = resolvePath(src, ctx.state.cwd, ctx.state.currentUser);
      const resolvedDest = resolvePath(dest, ctx.state.cwd, ctx.state.currentUser);
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;
      const res = lab1Store.copyNode(resolvedSrc, resolvedDest, effectiveUser);
      if (!res.success) return err(res.error ?? '');
      return ok([]);
    },
  },

  mv: {
    summary: 'Mueve o renombra archivos.',
    usage: 'mv <origen> <destino>',
    run: (args, ctx) => {
      const src = args[0];
      const dest = args[1];
      if (!src || !dest) return err('mv: faltan operandos');
      const resolvedSrc = resolvePath(src, ctx.state.cwd, ctx.state.currentUser);
      const resolvedDest = resolvePath(dest, ctx.state.cwd, ctx.state.currentUser);
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;
      const res = lab1Store.moveNode(resolvedSrc, resolvedDest, effectiveUser);
      if (!res.success) return err(res.error ?? '');
      return ok([]);
    },
  },

  // --- Permissions ----------------------------------------------------------
  chmod: {
    summary: 'Cambia los permisos de un archivo.',
    usage: 'chmod <modo> <archivo>',
    run: (args, ctx) => {
      const mode = args[0];
      const path = args[1];
      if (!mode || !path) return err('chmod: faltan operandos');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;
      const res = lab1Store.chmod(resolved, mode, effectiveUser);
      if (!res.success) return err(res.error ?? '');
      return ok([]);
    },
  },

  chown: {
    summary: 'Cambia el propietario de un archivo (requiere root).',
    usage: 'chown <usuario>[:<grupo>] <archivo>',
    run: (args, ctx) => {
      const ownerSpec = args[0];
      const path = args[1];
      if (!ownerSpec || !path) return err('chown: faltan operandos');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const [owner, group] = ownerSpec.split(':');
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;
      const res = lab1Store.chown(resolved, owner!, group, effectiveUser);
      if (!res.success) return err(res.error ?? '');
      return ok([]);
    },
  },

  // --- User Info ------------------------------------------------------------
  whoami: {
    summary: 'Muestra el usuario actual.',
    usage: 'whoami',
    run: (_a, ctx) => ok([ctx.state.currentUser]),
  },

  id: {
    summary: 'Muestra información de identidad del usuario.',
    usage: 'id',
    run: (_a, ctx) => {
      const user = ctx.state.currentUser;
      if (user === 'root') {
        return ok(['uid=0(root) gid=0(root) grupos=0(root)']);
      }
      if (user === 'cuidador') {
        return ok(['uid=1001(cuidador) gid=1001(cuidador) grupos=1001(cuidador),27(sudo)']);
      }
      return ok([`uid=1002(${user}) gid=1002(${user}) grupos=1002(${user})`]);
    },
  },

  // --- System Info ----------------------------------------------------------
  uname: {
    summary: 'Muestra información del sistema.',
    usage: 'uname [-a]',
    run: (args) => {
      const all = args.includes('-a');
      if (all) {
        return ok(['Linux invernadero-central 6.1.0-21-amd64 #1 SMP Debian 6.1.90-1 (2024-05-03) x86_64 GNU/Linux']);
      }
      return ok(['Linux']);
    },
  },

  hostname: {
    summary: 'Muestra el nombre del servidor.',
    usage: 'hostname',
    run: (_a, ctx) => ok([ctx.state.hostname]),
  },

  uptime: {
    summary: 'Muestra el tiempo de actividad del servidor.',
    usage: 'uptime',
    run: () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      return ok([` ${h}:${m}:00 up 247 days,  3:14,  1 user,  load average: 0.42, 0.38, 0.41`]);
    },
  },

  date: {
    summary: 'Muestra la fecha y hora actuales.',
    usage: 'date',
    run: (_a, ctx) => {
      if (!ctx.state.isNtpSynced) {
        return ok(['Mié ene  1 00:00:00 UTC 1999  [ADVERTENCIA: NTP no sincronizado — hora no fiable]']);
      }
      return ok([new Date().toString()]);
    },
  },

  // --- Process Management ---------------------------------------------------
  ps: {
    summary: 'Lista los procesos en ejecución.',
    usage: 'ps [aux]',
    run: (_args, ctx) => {
      const header = 'USER       PID %CPU %MEM COMMAND';
      const rows = ctx.state.processes
        .filter((p) => p.status === 'running')
        .map(
          (p) =>
            `${p.user.padEnd(10)} ${String(p.pid).padEnd(5)} ${String(p.cpu.toFixed(1)).padStart(4)} ${String(p.mem.toFixed(1)).padStart(4)} ${p.command}`,
        );
      return ok([header, ...rows]);
    },
  },

  top: {
    summary: 'Muestra los procesos más activos (snapshot).',
    usage: 'top',
    run: (_args, ctx) => {
      const { state } = ctx;
      const header = [
        `top - ${new Date().toLocaleTimeString('es-ES')}  up 247 days,  load: ${state.totalCpuPercent.toFixed(2)}`,
        `Tasks: ${state.processes.length} total, ${state.processes.filter((p) => p.status === 'running').length} running`,
        `%Cpu(s): ${state.totalCpuPercent.toFixed(1)} us   %Mem: ${state.totalMemPercent.toFixed(1)}`,
        '',
        '  PID USER      %CPU  %MEM COMMAND',
      ];
      const rows = state.processes
        .filter((p) => p.status === 'running')
        .sort((a, b) => b.cpu - a.cpu)
        .map(
          (p) =>
            `${String(p.pid).padStart(5)} ${p.user.padEnd(9)} ${String(p.cpu.toFixed(1)).padStart(5)} ${String(p.mem.toFixed(1)).padStart(5)} ${p.command}`,
        );
      return ok([...header, ...rows]);
    },
  },

  kill: {
    summary: 'Envía una señal a un proceso.',
    usage: 'kill [-9] <PID>',
    run: (args, ctx) => {
      let signal: 9 | 15 = 15;
      const pidArgs: string[] = [];
      for (const a of args) {
        if (a === '-9' || a === '-SIGKILL') signal = 9;
        else if (a === '-15' || a === '-SIGTERM') signal = 15;
        else if (!a.startsWith('-')) pidArgs.push(a);
      }
      if (pidArgs.length === 0) return err('kill: falta el PID');
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;
      const results: string[] = [];
      for (const pidStr of pidArgs) {
        const pid = parseInt(pidStr, 10);
        if (isNaN(pid)) {
          results.push(`kill: '${pidStr}': argumento inválido`);
          continue;
        }
        const res = lab1Store.killProcess(pid, signal, effectiveUser);
        if (!res.success) results.push(res.error ?? '');
        else if (res.message) results.push(res.message);
      }
      return ok(results);
    },
  },

  // --- Network --------------------------------------------------------------
  ss: {
    summary: 'Lista conexiones de red y sockets abiertos.',
    usage: 'ss [-tulpn]',
    run: (_args, ctx) => {
      const header = 'Netid  State   Recv-Q Send-Q    Local Address:Port    Peer Address:Port    Process';
      const rows = ctx.state.openSockets.map(
        (s) =>
          `${s.proto.toUpperCase().padEnd(6)} LISTEN  0      0         ${s.listenAddress}:${String(s.port).padEnd(6)} 0.0.0.0:*           users:(("${s.process}",pid=${s.pid},fd=4))`,
      );
      return ok([header, ...rows]);
    },
  },

  netstat: {
    summary: 'Muestra conexiones de red activas.',
    usage: 'netstat [-tulpn]',
    run: (_args, ctx) => COMMANDS.ss!.run([], ctx),
  },

  nmap: {
    summary: 'Escanea puertos en el host.',
    usage: 'nmap <host>',
    run: (args, ctx) => {
      const host = args[0] ?? ctx.state.hostname;
      const openPorts = ctx.state.openSockets.filter((s) => s.listenAddress === '0.0.0.0');
      const lines = [
        `Starting Nmap 7.93 ( https://nmap.org )`,
        `Nmap scan report for ${host} (127.0.0.1)`,
        `Host is up (0.00012s latency).`,
        `PORT     STATE SERVICE`,
        ...openPorts.map(
          (s) => `${String(s.port).padEnd(8)} open  ${s.process}`,
        ),
        `\nNmap done: 1 IP address (1 host up) scanned in 0.23 seconds`,
      ];
      return ok(lines);
    },
  },

  ping: {
    summary: 'Prueba conectividad con un host.',
    usage: 'ping <host>',
    run: (args, ctx) => {
      const host = args[0];
      if (!host) return err('ping: falta el host');
      const ip = lab1Store.resolveDomain(host);
      if (!ip) {
        return ok([
          `ping: ${host}: Nombre o servicio desconocido`,
        ]);
      }
      if (ip === '198.51.100.44') {
        return ok([
          `PING ${host} (198.51.100.44) 56(84) bytes of data.`,
          `64 bytes de 198.51.100.44: icmp_seq=1 ttl=64 tiempo=42.3 ms`,
          `[ADVERTENCIA] DNS respondió con IP sospechosa. ¿Posible envenenamiento DNS?`,
        ]);
      }
      return ok([
        `PING ${host} (${ip}) 56(84) bytes of data.`,
        `64 bytes de ${ip}: icmp_seq=1 ttl=64 tiempo=0.431 ms`,
        `64 bytes de ${ip}: icmp_seq=2 ttl=64 tiempo=0.418 ms`,
      ]);
    },
  },

  ip: {
    summary: 'Muestra u opera interfaces y direcciones de red.',
    usage: 'ip a | ip addr',
    run: () =>
      ok([
        '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000',
        '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00',
        '    inet 127.0.0.1/8 scope host lo',
        '       valid_lft forever preferred_lft forever',
        '    inet6 ::1/128 scope host',
        '       valid_lft forever preferred_lft forever',
        '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000',
        '    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff',
        '    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic eth0',
        '       valid_lft 86200sec preferred_lft 86200sec',
        '    inet6 fe80::5054:ff:fe12:3456/64 scope link',
        '       valid_lft forever preferred_lft forever',
      ]),
  },

  ifconfig: {
    summary: 'Configura o muestra interfaces de red.',
    usage: 'ifconfig',
    run: () =>
      ok([
        'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
        '        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255',
        '        inet6 fe80::5054:ff:fe12:3456  prefixlen 64  scopeid 0x20<link>',
        '        ether 52:54:00:12:34:56  txqueuelen 1000  (Ethernet)',
        '        RX packets 1420  bytes 128490 (125.4 KiB)',
        '        TX packets 980  bytes 87210 (85.1 KiB)',
        '',
        'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
        '        inet 127.0.0.1  netmask 255.0.0.0',
        '        inet6 ::1  prefixlen 128  scopeid 0x10<host>',
        '        loop  txqueuelen 1000  (Local Loopback)',
      ]),
  },

  dig: {
    summary: 'Consulta servidores de nombres DNS.',
    usage: 'dig <dominio>',
    run: (args, ctx) => {
      const domain = args.filter((a) => !a.startsWith('-'))[0] ?? 'invernadero.local';
      const dnsServer = ctx.state.dnsServer;
      const isLegitDns =
        dnsServer === '10.0.1.1' || dnsServer === '1.1.1.1' || dnsServer === '8.8.8.8';
      const ip = isLegitDns
        ? domain.includes('panel')
          ? '10.0.1.20'
          : '10.0.2.15'
        : '198.51.100.44';

      return ok([
        `; <<>> DiG 9.18.18-0ubuntu0.22.04.1-Ubuntu <<>> ${domain}`,
        `;; global options: +cmd`,
        `;; Got answer:`,
        `;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41285`,
        `;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1`,
        ``,
        `;; QUESTION SECTION:`,
        `;${domain}.\t\t\tIN\tA`,
        ``,
        `;; ANSWER SECTION:`,
        `${domain}.\t\t300\tIN\tA\t${ip}`,
        ``,
        `;; Query time: 4 msec`,
        `;; SERVER: ${dnsServer}#53(${dnsServer}) (UDP)`,
        `;; WHEN: ${new Date().toUTCString()}`,
        `;; MSG SIZE  rcvd: 64`,
      ]);
    },
  },

  nslookup: {
    summary: 'Consulta servidores DNS interactivos o directos.',
    usage: 'nslookup <dominio>',
    run: (args, ctx) => {
      const domain = args[0] ?? 'invernadero.local';
      const dnsServer = ctx.state.dnsServer;
      const isLegitDns =
        dnsServer === '10.0.1.1' || dnsServer === '1.1.1.1' || dnsServer === '8.8.8.8';
      const ip = isLegitDns ? '10.0.2.15' : '198.51.100.44';
      return ok([
        `Server:\t\t${dnsServer}`,
        `Address:\t${dnsServer}#53`,
        ``,
        `Name:\t${domain}`,
        `Address: ${ip}`,
      ]);
    },
  },

  curl: {
    summary: 'Transfiere datos hacia o desde un servidor HTTP/HTTPS.',
    usage: 'curl [-I] <url>',
    run: (args, ctx) => {
      const isHeadOnly = args.includes('-I') || args.includes('--head');
      const target = args.find((a) => !a.startsWith('-')) ?? 'http://127.0.0.1';
      const tele = ctx.state.greenhouse;

      if (tele.webPanelHttpCode === 503) {
        return err(
          `curl: (7) Failed to connect to ${target} port 80: Conexión rechazada (nginx inactivo)`,
        );
      }
      if (tele.webPanelHttpCode === 403) {
        if (isHeadOnly) {
          return ok([
            'HTTP/1.1 403 Forbidden',
            'Server: nginx/1.22.1',
            'Date: ' + new Date().toUTCString(),
            'Content-Type: text/html',
            'Content-Length: 162',
            'Connection: keep-alive',
          ]);
        }
        return ok([
          '<html><head><title>403 Forbidden</title></head>',
          '<body><center><h1>403 Forbidden</h1></center><hr><center>nginx/1.22.1</center></body></html>',
        ]);
      }

      if (isHeadOnly) {
        return ok([
          'HTTP/1.1 200 OK',
          'Server: nginx/1.22.1',
          'Date: ' + new Date().toUTCString(),
          'Content-Type: text/html; charset=UTF-8',
          'Content-Length: 2450',
          'Connection: keep-alive',
        ]);
      }
      const indexNode = ctx.state.fs['/var/www/invernadero/index.html'];
      return ok([indexNode?.content ?? '200 OK']);
    },
  },

  ssh: {
    summary: 'Cliente OpenSSH para inicio de sesión seguro.',
    usage: 'ssh [usuario@]host',
    run: (_args, ctx) => {
      const sshKey = ctx.state.fs['/home/cuidador/.ssh/id_ed25519'];
      if (sshKey && sshKey.perms === '777') {
        return err(
          [
            '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
            '@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @',
            '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
            "Permissions 0777 for '/home/cuidador/.ssh/id_ed25519' are too open.",
            'It is required that your private key files are NOT accessible by others.',
            'This private key will be ignored.',
            'Load key "/home/cuidador/.ssh/id_ed25519": bad permissions',
            'cuidador@localhost: Permission denied (publickey).',
          ].join('\n'),
        );
      }
      const sshdRunning = ctx.state.processes.some(
        (p) => p.serviceName === 'ssh.service' && p.status === 'running',
      );
      if (!sshdRunning) {
        return err('ssh: connect to host localhost port 22: Connection refused');
      }
      return ok([
        'Autenticación de clave pública OpenSSH verificada (Ed25519).',
        'Bienvenido al nodo de administración segura de invernadero-central.',
      ]);
    },
  },

  // --- Service Management ---------------------------------------------------
  systemctl: {
    summary: 'Controla servicios systemd.',
    usage: 'systemctl <start|stop|restart|status> <servicio>',
    run: (args, ctx) => {
      const action = args[0];
      const service = args[1];
      if (!action) return err('systemctl: falta la acción (start|stop|restart|status|list-units)');
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;

      if (action === 'list-units' || action === 'list-units --type=service') {
        const header = 'UNIT                           LOAD   ACTIVE SUB     DESCRIPTION';
        const rows = ctx.state.processes.map(
          (p) =>
            `${(p.serviceName ?? p.command.split(' ')[0]).padEnd(30)} loaded ${p.status === 'running' ? 'active running' : 'failed failed '} ${p.command.split(' ')[0]}`,
        );
        return ok([header, ...rows]);
      }

      if (!service) return err(`systemctl: falta el nombre del servicio`);

      if (action === 'status') {
        const proc = ctx.state.processes.find(
          (p) =>
            p.serviceName === service ||
            p.serviceName === service + '.service',
        );
        if (!proc) return err(`Unit ${service} could not be found.`);
        const activeState = proc.status === 'running' ? 'active (running)' : 'failed';
        return ok([
          `● ${proc.serviceName ?? service}`,
          `   Loaded: loaded (/lib/systemd/system/${proc.serviceName ?? service}; enabled)`,
          `   Active: ${activeState} since hace un momento`,
          `  Process: ${proc.pid} ExecStart=${proc.command}`,
          ``,
        ]);
      }

      if (action === 'start') {
        const res = lab1Store.startService(service, effectiveUser);
        if (!res.success) return err(res.error ?? '');
        return ok([res.message ?? '']);
      }
      if (action === 'stop') {
        const res = lab1Store.stopService(service, effectiveUser);
        if (!res.success) return err(res.error ?? '');
        return ok([res.message ?? '']);
      }
      if (action === 'restart') {
        const res = lab1Store.restartService(service, effectiveUser);
        if (!res.success) return err(res.error ?? '');
        return ok([res.message ?? '']);
      }

      if (action === 'disable') {
        const res = lab1Store.stopService(service, effectiveUser);
        const unitName = service.endsWith('.service') ? service : service + '.service';
        return ok([
          `Removed /etc/systemd/system/multi-user.target.wants/${unitName}.`,
          res.message ?? `Servicio ${service} deshabilitado.`,
        ]);
      }
      if (action === 'enable') {
        const unitName = service.endsWith('.service') ? service : service + '.service';
        return ok([
          `Created symlink /etc/systemd/system/multi-user.target.wants/${unitName} → /lib/systemd/system/${unitName}.`,
        ]);
      }

      return err(`systemctl: acción desconocida '${action}'`);
    },
  },

  service: {
    summary: 'Controla servicios (alias de systemctl).',
    usage: 'service <nombre> <start|stop|restart|status>',
    run: (args, ctx) => {
      // Reorder: service <name> <action> → systemctl <action> <name>
      const [name, action] = args;
      if (!name || !action) return err('service: uso: service <nombre> <acción>');
      return COMMANDS.systemctl!.run([action, name], ctx);
    },
  },

  // --- User Switching -------------------------------------------------------
  su: {
    summary: 'Cambia el usuario de la sesión.',
    usage: 'su [usuario]',
    run: (args, ctx) => {
      const rawUser = args.filter((a) => a !== '-' && a !== '-l')[0];
      const targetUser = rawUser ?? 'root';
      if (ctx.state.currentUser === targetUser) {
        return ok([`Ya eres ${targetUser}.`]);
      }
      if (targetUser === 'root' && ctx.state.currentUser !== 'cuidador' && !ctx.isSudo) {
        return ok([
          'Contraseña: ',
          'su: Fallo en la autenticación',
        ]);
      }
      return {
        output: [`Cambiando a usuario ${targetUser}...`],
        signal: { type: 'su', user: targetUser },
      };
    },
  },

  exit: {
    summary: 'Sale de la sesión actual o de privilegios elevados.',
    usage: 'exit',
    run: (_args, ctx) => {
      if (ctx.state.currentUser !== 'operario') {
        return {
          output: ['Cerrando sesión de superusuario...', 'Sesión restaurada como operario.'],
          signal: { type: 'su', user: 'operario' },
        };
      }
      return ok(['logout']);
    },
  },

  logout: {
    summary: 'Cierra la sesión actual.',
    usage: 'logout',
    run: (_args, ctx) => COMMANDS.exit!.run(_args, ctx),
  },

  nano: {
    summary: 'Editor de texto simple de terminal.',
    usage: 'nano <archivo>',
    run: (args, ctx) => {
      const target = args[0];
      if (!target) return err('nano: falta la ruta del archivo');
      const absPath = resolvePath(target, ctx.state.cwd, ctx.state.currentUser);
      const effectiveUser = ctx.isSudo ? 'root' : ctx.state.currentUser;

      if (absPath === '/etc/resolv.conf') {
        if (effectiveUser !== 'root')
          return err('nano: Permiso denegado para /etc/resolv.conf (requiere sudo)');
        lab1Store.writeFile('/etc/resolv.conf', 'nameserver 10.0.1.1\nsearch invernadero.local\n', effectiveUser);
        return ok([
          '[nano] /etc/resolv.conf guardado con éxito.',
          'nameserver 10.0.1.1 configurado correctamente.',
        ]);
      }

      if (absPath === '/etc/ssh/sshd_config') {
        if (effectiveUser !== 'root')
          return err('nano: Permiso denegado para /etc/ssh/sshd_config (requiere sudo)');
        const curr = ctx.state.fs['/etc/ssh/sshd_config'];
        if (curr?.content) {
          const updated = curr.content.replace('PermitRootLogin yes', 'PermitRootLogin no');
          lab1Store.writeFile('/etc/ssh/sshd_config', updated, effectiveUser);
        }
        return ok([
          '[nano] /etc/ssh/sshd_config guardado.',
          'Directiva cambiada: PermitRootLogin no',
        ]);
      }

      const node = ctx.state.fs[absPath];
      if (!node) {
        lab1Store.writeFile(absPath, '', effectiveUser);
        return ok([`[nano] Archivo nuevo '${absPath}' creado y guardado.`]);
      }
      return ok([`[nano] Archivo '${absPath}' guardado.`]);
    },
  },

  vim: {
    summary: 'Editor de texto vi/vim.',
    usage: 'vim <archivo>',
    run: (args, ctx) => COMMANDS.nano!.run(args, ctx),
  },

  vi: {
    summary: 'Editor de texto vi.',
    usage: 'vi <archivo>',
    run: (args, ctx) => COMMANDS.nano!.run(args, ctx),
  },

  // --- Search ---------------------------------------------------------------
  find: {
    summary: 'Busca archivos por nombre o patrón.',
    usage: 'find <dir> [-name <patrón>]',
    run: (args, ctx) => {
      const flags = args.filter((a) => a.startsWith('-'));
      const nonFlags = args.filter((a) => !a.startsWith('-'));
      const startDir = nonFlags[0]
        ? resolvePath(nonFlags[0], ctx.state.cwd, ctx.state.currentUser)
        : ctx.state.cwd;

      const nameIdx = flags.indexOf('-name');
      const namePattern = nameIdx !== -1 ? args[args.indexOf('-name') + 1] : undefined;

      const prefix = startDir === '/' ? '/' : startDir + '/';
      const results: string[] = [];

      for (const key of Object.keys(ctx.state.fs)) {
        if (key !== startDir && !key.startsWith(prefix)) continue;
        if (namePattern) {
          const base = key.split('/').pop() ?? '';
          // Glob-like: replace * with regex .*
          const regex = new RegExp('^' + namePattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
          if (!regex.test(base)) continue;
        }
        results.push(key);
      }
      return ok(results.sort());
    },
  },

  // --- Hash / Crypto --------------------------------------------------------
  md5sum: {
    summary: 'Calcula el MD5 de un archivo (simulado).',
    usage: 'md5sum <archivo>',
    run: (args, ctx) => {
      const path = args[0];
      if (!path) return err('md5sum: falta operando');
      const resolved = resolvePath(path, ctx.state.cwd, ctx.state.currentUser);
      const node = ctx.state.fs[resolved];
      if (!node) return err(`md5sum: ${path}: No existe el archivo o el directorio`);
      // Deterministic fake MD5 based on node size
      const fakeMd5 = (node.size * 31337).toString(16).padStart(32, '0').slice(0, 32);
      return ok([`${fakeMd5}  ${path}`]);
    },
  },

  // --- Misc -----------------------------------------------------------------
  history: {
    summary: 'Muestra el historial de comandos.',
    usage: 'history',
    run: (_a, ctx) => {
      // History is stored in Terminal.tsx local state, passed in context
      const hist = (ctx as CommandContext & { history?: readonly string[] }).history ?? [];
      const width = String(hist.length).length;
      return ok(hist.map((cmd, i) => `${String(i + 1).padStart(width)}  ${cmd}`));
    },
  },

  clear: {
    summary: 'Limpia el historial de la terminal.',
    usage: 'clear',
    run: () => ({ output: [], signal: { type: 'clear' } }),
  },

  open: {
    summary: 'Abre una app del escritorio por ID.',
    usage: 'open <appId>',
    run: (args, ctx) => {
      const appId = args[0];
      const listing = (): string[] => {
        if (ctx.openableAppIds.length === 0) return ['open: no hay apps disponibles'];
        const width = Math.max(...ctx.openableAppIds.map((id) => id.length));
        return [
          'Abre una de las siguientes apps:',
          ...ctx.openableAppIds
            .slice()
            .sort((a, b) => a.localeCompare(b))
            .map((id) => `  ${id.padEnd(width)}  ${ctx.appLabels[id] ?? ''}`.trimEnd()),
        ];
      };
      if (!appId) return ok(listing());
      if (!ctx.openableAppIds.includes(appId)) {
        return ok([`open: ${appId}: no existe esa app`, ...listing()]);
      }
      const label = ctx.appLabels[appId] ?? appId;
      return { output: [`Abriendo ${label}…`], signal: { type: 'open', appId } };
    },
  },

  help: {
    summary: 'Lista los comandos disponibles.',
    usage: 'help',
    run: () => {
      const defs = Object.entries(COMMANDS)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, def]) => def);
      const width = Math.max(...defs.map((d) => d.usage.length));
      return ok([
        'Comandos disponibles (soporta pipes \'|\' y redirecciones \'>\', \'>>\'):',
        ...defs.map((d) => `  ${d.usage.padEnd(width)}  ${d.summary}`),
      ]);
    },
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Command names known to the shell, sorted (for tab completion and help). */
export function commandNames(): string[] {
  return Object.keys(COMMANDS).sort((a, b) => a.localeCompare(b));
}

/** Tab-completion candidates for a partial first word. */
export function completeCommand(prefix: string): string[] {
  if (prefix.length === 0) return [];
  return commandNames().filter((name) => name.startsWith(prefix));
}

/**
 * Run a raw input line with full pipeline (|) and output redirection (>, >>) support.
 * `sudo` prefix is handled transparently by setting ctx.isSudo = true.
 */
export function runCommand(
  line: string,
  ctx: Omit<CommandContext, 'isSudo'> & { history?: readonly string[] },
): CommandResult {
  const trimmed = line.trim();
  if (trimmed === '') return { output: [], signal: { type: 'none' } };

  if (
    trimmed === 'sudo -i' ||
    trimmed === 'sudo -s' ||
    trimmed === 'sudo su' ||
    trimmed === 'sudo su -' ||
    trimmed === 'sudo bash' ||
    trimmed === 'sudo sh'
  ) {
    return {
      output: ['[sudo] Privilegios administrativos concedidos para operario.', 'Iniciando shell interactiva como root...'],
      signal: { type: 'su', user: 'root' },
    };
  }

  // Handle sudo prefix
  let isSudo = false;
  let effectiveLine = trimmed;

  if (trimmed.startsWith('sudo ')) {
    isSudo = true;
    effectiveLine = trimmed.slice(5).trim();
  }

  const fullCtx: CommandContext & { history?: readonly string[] } = {
    ...ctx,
    isSudo,
    history: ctx.history,
  };

  // Split on pipes
  const pipeSegments = effectiveLine
    .split('|')
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (pipeSegments.length === 0) return { output: [], signal: { type: 'none' } };

  let currentStdin: string[] = [];
  let lastSignal: ShellSignal = { type: 'none' };

  for (let i = 0; i < pipeSegments.length; i++) {
    const segment = pipeSegments[i]!;
    const isLastSegment = i === pipeSegments.length - 1;

    // Check for output redirection in the last segment
    let redirectMode: 'none' | 'overwrite' | 'append' = 'none';
    let redirectPath = '';
    let cleanCommand = segment;

    if (isLastSegment) {
      const appendMatch = segment.match(/^(.*?)\s*>>\s*(.+)$/);
      const overwriteMatch = segment.match(/^(.*?)\s*>\s*(.+)$/);

      if (appendMatch) {
        cleanCommand = appendMatch[1]!.trim();
        redirectPath = appendMatch[2]!.trim();
        redirectMode = 'append';
      } else if (overwriteMatch) {
        cleanCommand = overwriteMatch[1]!.trim();
        redirectPath = overwriteMatch[2]!.trim();
        redirectMode = 'overwrite';
      }
    }

    const words = cleanCommand.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    const name = words[0]!;
    const args = words.slice(1);
    const cmd = COMMANDS[name];

    if (!cmd) {
      return { output: [`${name}: command not found`], signal: { type: 'none' } };
    }

    const result = cmd.run(args, fullCtx, currentStdin);
    lastSignal = result.signal;

    if (result.signal.type === 'clear') return result;
    if (result.signal.type === 'cd') return result;
    if (result.signal.type === 'su') return result;

    if (redirectMode !== 'none') {
      const resolvedDest = resolvePath(redirectPath, ctx.state.cwd, ctx.state.currentUser);
      const fileContent = result.output.join('\n');

      if (redirectMode === 'append') {
        const existing = lab1Store.readFile(resolvedDest, ctx.state.currentUser);
        const combined = existing.success
          ? (existing.content ?? '') + (existing.content?.endsWith('\n') ? '' : '\n') + fileContent
          : fileContent;
        const res = lab1Store.writeFile(resolvedDest, combined, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
      } else {
        const res = lab1Store.writeFile(resolvedDest, fileContent, ctx.state.currentUser);
        if (!res.success) return err(res.error ?? '');
      }
      return { output: [], signal: lastSignal };
    }

    currentStdin = result.output;
  }

  return { output: currentStdin, signal: lastSignal };
}
