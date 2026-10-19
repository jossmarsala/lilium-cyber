/**
 * Integration Test for LabVerificationEngine & Lab 01 Rules
 */
import { lab01VerificationConfig, lab01Phase1Rules, lab01Phase2Rules, lab01Phase3Rules } from '../src/services/verification/rules/lab01Rules.ts'

console.log('Testing Lab 01 Verification Rules...')

// Mock context factory
function createMockContext(overrides = {}) {
  return {
    labId: 'lab-01',
    activePhaseId: 'fase-1',
    completedPhases: {},
    checkedItems: {},
    commandHistory: [],
    lastCommand: undefined,
    terminalOutput: '',
    recentTerminalOutput: '',
    findings: [],
    consignas: [],
    ...overrides,
  }
}

// 1. Test Phase 1 Rules
console.log('\n--- 1. Testing Phase 1 Rules ---')

// v1-base
const v1Base = lab01Phase1Rules.find(r => r.id === 'v1-base')
const matchBaseCmd = v1Base.commandPatterns.some(p => p.test('whoami && uname -a'))
console.log('v1-base command match ("whoami && uname -a"):', matchBaseCmd)
if (!matchBaseCmd) throw new Error('v1-base failed command match')

// v1-inv
const v1Inv = lab01Phase1Rules.find(r => r.id === 'v1-inv')
const matchInvCmd = v1Inv.commandPatterns.some(p => p.test('cat /etc/invernadero/inventario.csv && dpkg -l'))
console.log('v1-inv command match:', matchInvCmd)
if (!matchInvCmd) throw new Error('v1-inv failed command match')

// v1-users
const v1Users = lab01Phase1Rules.find(r => r.id === 'v1-users')
const matchUsersCmd = v1Users.commandPatterns.some(p => p.test('cat /etc/passwd && sudo passwd -S ex_cuidador'))
console.log('v1-users command match:', matchUsersCmd)
if (!matchUsersCmd) throw new Error('v1-users failed command match')

// v1-perms
const v1Perms = lab01Phase1Rules.find(r => r.id === 'v1-perms')
const matchPermsCmd = v1Perms.commandPatterns.some(p => p.test('ls -la /srv/invernadero/informes && file /tmp/catalogo_orquideas.pdf'))
console.log('v1-perms command match:', matchPermsCmd)
if (!matchPermsCmd) throw new Error('v1-perms failed command match')

// v1-net
const v1Net = lab01Phase1Rules.find(r => r.id === 'v1-net')
const matchNetCmd = v1Net.commandPatterns.some(p => p.test('ip -br addr && sudo ss -tulpn && systemctl status nginx'))
console.log('v1-net command match:', matchNetCmd)
if (!matchNetCmd) throw new Error('v1-net failed command match')

// v1-logs
const v1Logs = lab01Phase1Rules.find(r => r.id === 'v1-logs')
const matchLogsCmd = v1Logs.commandPatterns.some(p => p.test('cat /var/log/invernadero/actividad.log && sudo journalctl'))
console.log('v1-logs command match:', matchLogsCmd)
if (!matchLogsCmd) throw new Error('v1-logs failed command match')

// v1-nobrk: should succeed if recon checks are done and NO destructive commands were run
const v1Nobrk = lab01Phase1Rules.find(r => r.id === 'v1-nobrk')
const ctxClean = createMockContext({
  checkedItems: { 'v1-base': true, 'v1-inv': true, 'v1-users': true },
  commandHistory: [
    { command: 'whoami', timestamp: 1, phaseId: 'fase-1' },
    { command: 'cat /etc/passwd', timestamp: 2, phaseId: 'fase-1' },
  ],
})
console.log('v1-nobrk on clean audit:', v1Nobrk.evaluate(ctxClean))
if (!v1Nobrk.evaluate(ctxClean)) throw new Error('v1-nobrk should pass on clean audit')

const ctxDestructive = createMockContext({
  checkedItems: { 'v1-base': true, 'v1-inv': true, 'v1-users': true },
  commandHistory: [
    { command: 'whoami', timestamp: 1, phaseId: 'fase-1' },
    { command: 'sudo rm -rf /etc/test', timestamp: 2, phaseId: 'fase-1' },
  ],
})
console.log('v1-nobrk on destructive audit (rm):', v1Nobrk.evaluate(ctxDestructive))
if (v1Nobrk.evaluate(ctxDestructive)) throw new Error('v1-nobrk should NOT pass after rm')

// 2. Test Phase 2 Rules
console.log('\n--- 2. Testing Phase 2 Rules ---')

// v2-proc
const v2Proc = lab01Phase2Rules.find(r => r.id === 'v2-proc')
const matchProcCmd = v2Proc.commandPatterns.some(p => p.test('cat /tmp/polilla_emisora && cat /opt/invernadero/scripts/riego_nocturno.sh'))
console.log('v2-proc command match:', matchProcCmd)
if (!matchProcCmd) throw new Error('v2-proc failed command match')

// v2-pdf
const v2Pdf = lab01Phase2Rules.find(r => r.id === 'v2-pdf')
const matchPdfCmd = v2Pdf.commandPatterns.some(p => p.test('cat /tmp/catalogo_orquideas.pdf'))
console.log('v2-pdf command match:', matchPdfCmd)
if (!matchPdfCmd) throw new Error('v2-pdf failed command match')

// v2-bak
const v2Bak = lab01Phase2Rules.find(r => r.id === 'v2-bak')
const matchBakCmd = v2Bak.commandPatterns.some(p => p.test('cat /var/backups/invernadero/catalogo_2026-10-17.bak'))
console.log('v2-bak command match:', matchBakCmd)
if (!matchBakCmd) throw new Error('v2-bak failed command match')

// v2-kill
const v2Kill = lab01Phase2Rules.find(r => r.id === 'v2-kill')
const ctxKill = createMockContext({
  activePhaseId: 'fase-2',
  commandHistory: [{ command: 'sudo kill -15 412', timestamp: 1, phaseId: 'fase-2' }],
})
console.log('v2-kill match (sudo kill -15 412):', v2Kill.evaluate(ctxKill))
if (!v2Kill.evaluate(ctxKill)) throw new Error('v2-kill failed to detect kill -15')

// 3. Test Phase 3 Rules
console.log('\n--- 3. Testing Phase 3 Rules ---')

// v3-acc
const v3Acc = lab01Phase3Rules.find(r => r.id === 'v3-acc')
const ctxAcc = createMockContext({
  activePhaseId: 'fase-3',
  commandHistory: [
    { command: 'sudo usermod -s /usr/sbin/nologin ex_cuidador', timestamp: 1, phaseId: 'fase-3' },
    { command: 'sudo usermod -L ex_cuidador', timestamp: 2, phaseId: 'fase-3' },
  ],
})
console.log('v3-acc match (usermod -s /usr/sbin/nologin and -L):', v3Acc.evaluate(ctxAcc))
if (!v3Acc.evaluate(ctxAcc)) throw new Error('v3-acc failed to detect usermod')

// v3-perms
const v3Perms = lab01Phase3Rules.find(r => r.id === 'v3-perms')
const ctxPerms = createMockContext({
  activePhaseId: 'fase-3',
  commandHistory: [
    { command: 'sudo chmod 600 /home/cuidador/.ssh/id_ed25519', timestamp: 1, phaseId: 'fase-3' },
    { command: 'sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv', timestamp: 2, phaseId: 'fase-3' },
  ],
})
console.log('v3-perms match (chmod 600 key and conf):', v3Perms.evaluate(ctxPerms))
if (!v3Perms.evaluate(ctxPerms)) throw new Error('v3-perms failed to detect chmod 600')

// v3-ssh
const v3Ssh = lab01Phase3Rules.find(r => r.id === 'v3-ssh')
const matchSshCmd = v3Ssh.commandPatterns.some(p => p.test('sudo systemctl disable --now ssh'))
console.log('v3-ssh command match:', matchSshCmd)
if (!matchSshCmd) throw new Error('v3-ssh failed to detect systemctl disable --now ssh')

// v3-patch
const v3Patch = lab01Phase3Rules.find(r => r.id === 'v3-patch')
const ctxPatchClean = createMockContext({
  activePhaseId: 'fase-3',
  commandHistory: [{ command: 'apt list --upgradable', timestamp: 1, phaseId: 'fase-3' }],
})
console.log('v3-patch match (apt list --upgradable):', v3Patch.evaluate(ctxPatchClean))
if (!v3Patch.evaluate(ctxPatchClean)) throw new Error('v3-patch failed to detect apt list --upgradable')

console.log('\n[ALL TESTS PASSED] Declarative verification rules verified successfully.')
