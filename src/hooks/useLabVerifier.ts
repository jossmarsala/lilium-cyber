import { useEffect, useState, useCallback } from 'react'
import {
  labVerificationEngine,
  type LabVerificationState,
} from '@/services/verification'

export function useLabVerifier(labId = 'lab-01') {
  const [state, setState] = useState<LabVerificationState>(() => {
    labVerificationEngine.setLabId(labId)
    return labVerificationEngine.getState()
  })

  useEffect(() => {
    labVerificationEngine.setLabId(labId)
    const unsubscribe = labVerificationEngine.subscribe((newState) => {
      setState(newState)
    })
    return unsubscribe
  }, [labId])

  const toggleCheckItem = useCallback(
    (itemId: string, phaseId: string) => {
      labVerificationEngine.toggleCheckItem(itemId, phaseId)
    },
    []
  )

  const togglePhaseCompleted = useCallback(
    (phaseId: string, forceValue?: boolean) => {
      labVerificationEngine.togglePhaseCompleted(phaseId, forceValue)
    },
    []
  )

  const isPhaseLocked = useCallback(
    (phaseId: string) => {
      return labVerificationEngine.isPhaseLocked(phaseId)
    },
    []
  )

  const resetProgress = useCallback(() => {
    labVerificationEngine.resetProgress()
  }, [])

  return {
    labId: state.labId,
    activePhaseId: state.activePhaseId,
    checkedItems: state.checkedItems,
    completedPhases: state.completedPhases,
    commandHistory: state.commandHistory,
    isEvaluating: state.isEvaluating,
    toggleCheckItem,
    togglePhaseCompleted,
    isPhaseLocked,
    resetProgress,
  }
}
