import type { LabVerificationConfig } from '../types'
import { lab01VerificationConfig } from './lab01Rules'

const LAB_CONFIGS: Record<string, LabVerificationConfig> = {
  'lab-01': lab01VerificationConfig,
}

export function getLabVerificationConfig(labId: string): LabVerificationConfig {
  return LAB_CONFIGS[labId] ?? lab01VerificationConfig
}

export { lab01VerificationConfig }
