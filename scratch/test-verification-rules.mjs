/**
 * Integration Test for LabVerificationEngine & Lab 01 Sub-step Rules
 */
import {
  lab01VerificationConfig,
  lab01Phase1Rules,
  lab01Phase2Rules,
  lab01Phase3Rules,
} from '../src/services/verification/rules/lab01Rules.ts'

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
console.log('\n--- 1. Testing Phase 1 Sub-step Rules ---')

// v1.1-whoami
const v1Whoami = lab01Phase1Rules.find((r) => r.id === 'v1.1-whoami')
if (!v1Whoami || !v1Whoami.commandPatterns.some((p) => p.test('whoami'))) {
  throw new Error('v1.1-whoami failed command pattern match')
}
console.log('✓ v1.1-whoami passed')

// v1.1-id
const v1Id = lab01Phase1Rules.find((r) => r.id === 'v1.1-id')
if (!v1Id || !v1Id.commandPatterns.some((p) => p.test('id'))) {
  throw new Error('v1.1-id failed command pattern match')
}
console.log('✓ v1.1-id passed')

// v1.1-uname
const v1Uname = lab01Phase1Rules.find((r) => r.id === 'v1.1-uname')
if (!v1Uname || !v1Uname.commandPatterns.some((p) => p.test('uname -a'))) {
  throw new Error('v1.1-uname failed command pattern match')
}
console.log('✓ v1.1-uname passed')

// v1.2-dpkg-l
const v1Dpkg = lab01Phase1Rules.find((r) => r.id === 'v1.2-dpkg-l')
if (!v1Dpkg || !v1Dpkg.commandPatterns.some((p) => p.test('dpkg -l'))) {
  throw new Error('v1.2-dpkg-l failed command pattern match')
}
console.log('✓ v1.2-dpkg-l passed')

// v1.3-passwd-ex-cuidador
const v1Passwd = lab01Phase1Rules.find((r) => r.id === 'v1.3-passwd-ex-cuidador')
if (!v1Passwd || !v1Passwd.commandPatterns.some((p) => p.test('sudo passwd -S ex_cuidador'))) {
  throw new Error('v1.3-passwd-ex-cuidador failed command pattern match')
}
console.log('✓ v1.3-passwd-ex-cuidador passed')

// v1.4-file-tmp
const v1File = lab01Phase1Rules.find((r) => r.id === 'v1.4-file-tmp')
if (!v1File || !v1File.commandPatterns.some((p) => p.test('file /tmp/catalogo_orquideas.pdf'))) {
  throw new Error('v1.4-file-tmp failed command pattern match')
}
console.log('✓ v1.4-file-tmp passed')

// v1.5-ss-tulpn
const v1Ss = lab01Phase1Rules.find((r) => r.id === 'v1.5-ss-tulpn')
if (!v1Ss || !v1Ss.commandPatterns.some((p) => p.test('sudo ss -tulpn'))) {
  throw new Error('v1.5-ss-tulpn failed command pattern match')
}
console.log('✓ v1.5-ss-tulpn passed')

// v1.6-cat-actividad
const v1Act = lab01Phase1Rules.find((r) => r.id === 'v1.6-cat-actividad')
if (!v1Act || !v1Act.commandPatterns.some((p) => p.test('sudo cat /var/log/invernadero/actividad.log'))) {
  throw new Error('v1.6-cat-actividad failed command pattern match')
}
console.log('✓ v1.6-cat-actividad passed')

// v1-nobrk: should succeed if recon checks are done and NO destructive commands were run
const v1Nobrk = lab01Phase1Rules.find((r) => r.id === 'v1-nobrk')
const ctxClean = createMockContext({
  checkedItems: { 'v1.1-whoami': true, 'v1.1-id': true, 'v1.2-dpkg-l': true },
  commandHistory: [
    { command: 'whoami', timestamp: 1, phaseId: 'fase-1' },
    { command: 'cat /etc/passwd', timestamp: 2, phaseId: 'fase-1' },
  ],
})
console.log('v1-nobrk on clean audit:', v1Nobrk.evaluate(ctxClean))
if (!v1Nobrk.evaluate(ctxClean)) throw new Error('v1-nobrk should pass on clean audit')

const ctxDestructive = createMockContext({
  checkedItems: { 'v1.1-whoami': true, 'v1.1-id': true, 'v1.2-dpkg-l': true },
  commandHistory: [
    { command: 'whoami', timestamp: 1, phaseId: 'fase-1' },
    { command: 'sudo rm -rf /etc/test', timestamp: 2, phaseId: 'fase-1' },
  ],
})
console.log('v1-nobrk on destructive audit (rm):', v1Nobrk.evaluate(ctxDestructive))
if (v1Nobrk.evaluate(ctxDestructive)) throw new Error('v1-nobrk should NOT pass after rm')

// 2. Test Phase 2 Rules
console.log('\n--- 2. Testing Phase 2 Sub-step Rules ---')

// v2.2-grep-polilla
const v2Grep = lab01Phase2Rules.find((r) => r.id === 'v2.2-grep-polilla')
if (!v2Grep || !v2Grep.commandPatterns.some((p) => p.test('ps aux | grep polilla_emisora'))) {
  throw new Error('v2.2-grep-polilla failed command match')
}
console.log('✓ v2.2-grep-polilla passed')

// v2.3-file-pdf
const v2File = lab01Phase2Rules.find((r) => r.id === 'v2.3-file-pdf')
if (!v2File || !v2File.commandPatterns.some((p) => p.test('file /tmp/catalogo_orquideas.pdf'))) {
  throw new Error('v2.3-file-pdf failed command match')
}
console.log('✓ v2.3-file-pdf passed')

// v2.4-cat-bak
const v2Bak = lab01Phase2Rules.find((r) => r.id === 'v2.4-cat-bak')
if (!v2Bak || !v2Bak.commandPatterns.some((p) => p.test('cat /var/backups/invernadero/catalogo_2026-10-17.bak'))) {
  throw new Error('v2.4-cat-bak failed command match')
}
console.log('✓ v2.4-cat-bak passed')

// v2.5-kill-polilla
const v2Kill = lab01Phase2Rules.find((r) => r.id === 'v2.5-kill-polilla')
const ctxKill = createMockContext({
  activePhaseId: 'fase-2',
  commandHistory: [{ command: 'sudo kill -15 412', timestamp: 1, phaseId: 'fase-2' }],
})
console.log('v2.5-kill-polilla match (sudo kill -15 412):', v2Kill.evaluate(ctxKill))
if (!v2Kill.evaluate(ctxKill)) throw new Error('v2.5-kill-polilla failed to detect kill -15')

// 3. Test Phase 3 Rules
console.log('\n--- 3. Testing Phase 3 Sub-step Rules ---')

// v3.1-usermod-nologin
const v3Nologin = lab01Phase3Rules.find((r) => r.id === 'v3.1-usermod-nologin')
if (!v3Nologin || !v3Nologin.commandPatterns.some((p) => p.test('sudo usermod -s /usr/sbin/nologin ex_cuidador'))) {
  throw new Error('v3.1-usermod-nologin failed command pattern match')
}
console.log('✓ v3.1-usermod-nologin passed')

// v3.2-chmod-ssh
const v3Chmod = lab01Phase3Rules.find((r) => r.id === 'v3.2-chmod-ssh')
if (!v3Chmod || !v3Chmod.commandPatterns.some((p) => p.test('sudo chmod 600 /home/cuidador/.ssh/id_ed25519'))) {
  throw new Error('v3.2-chmod-ssh failed command pattern match')
}
console.log('✓ v3.2-chmod-ssh passed')

// v3.3-disable-ssh
const v3Ssh = lab01Phase3Rules.find((r) => r.id === 'v3.3-disable-ssh')
if (!v3Ssh || !v3Ssh.commandPatterns.some((p) => p.test('sudo systemctl disable --now ssh'))) {
  throw new Error('v3.3-disable-ssh failed command pattern match')
}
console.log('✓ v3.3-disable-ssh passed')

// v3.4-apt-upgradable
const v3Apt = lab01Phase3Rules.find((r) => r.id === 'v3.4-apt-upgradable')
if (!v3Apt || !v3Apt.commandPatterns.some((p) => p.test('apt list --upgradable'))) {
  throw new Error('v3.4-apt-upgradable failed command pattern match')
}
console.log('✓ v3.4-apt-upgradable passed')

console.log(`\nTotal Phase 1 rules: ${lab01Phase1Rules.length}`)
console.log(`Total Phase 2 rules: ${lab01Phase2Rules.length}`)
console.log(`Total Phase 3 rules: ${lab01Phase3Rules.length}`)
console.log('\n[ALL TESTS PASSED] Declarative verification rules verified successfully.')
