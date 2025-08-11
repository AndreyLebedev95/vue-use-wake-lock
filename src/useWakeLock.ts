import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useDocumentVisible } from './useDocumentVisible'

interface UseWakeLockReturn {
  readonly wakeLockSentinel: Ref<WakeLockSentinel | null>
  readonly active: ComputedRef<boolean>
  readonly supported: boolean
  readonly request: (type?: WakeLockSentinelType) => Promise<void>
  readonly forceRequest: (type?: WakeLockSentinelType) => Promise<void>
  readonly release: () => Promise<void>
}

type WakeLockSentinelType = 'screen'

export const useWakeLock = (): UseWakeLockReturn => {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
    return {
      active: computed<boolean>(() => false),
      supported: false,
      wakeLockSentinel: ref<null>(null),
      request: () => Promise.resolve(),
      forceRequest: () => Promise.resolve(),
      release: () => Promise.resolve(),
    }
  }

  const { documentVisible } = useDocumentVisible()

  const wakeLockSentinel = ref<WakeLockSentinel | null>(null)
  const requestedWakeLock = ref<WakeLockSentinelType | null>(null)
  const wakeLockSentinelRequestPromise = ref<Promise<WakeLockSentinel> | null>(null)

  const active = computed<boolean>(() => !!wakeLockSentinel.value)

  const request = async (type: WakeLockSentinelType = 'screen') => {
    if (!documentVisible.value) {
      requestedWakeLock.value = type
    } else if (wakeLockSentinelRequestPromise.value) {
      await wakeLockSentinelRequestPromise.value
    } else {
      await doWakeLockRequest(type)
    }
  }

  const forceRequest = async (type: WakeLockSentinelType = 'screen') => {
    if (wakeLockSentinelRequestPromise.value) {
      release()
    }

    await doWakeLockRequest(type)
  }

  const doWakeLockRequest = async (type: WakeLockSentinelType) => {
    return (wakeLockSentinelRequestPromise.value = new Promise<WakeLockSentinel>(
      async (resolve, reject) => {
        try {
          if (wakeLockSentinel.value) {
            await wakeLockSentinel.value.release()
          }

          wakeLockSentinel.value = await navigator.wakeLock.request(type)
          requestedWakeLock.value = null

          wakeLockSentinel.value.addEventListener('release', handleWakeLockSentinelReleased, {
            once: true,
            passive: true,
          })

          resolve(wakeLockSentinel.value)
        } catch (error) {
          reject(error)
        } finally {
          wakeLockSentinelRequestPromise.value = null
        }
      },
    ))
  }

  const release = async () => {
    requestedWakeLock.value = null

    const currentWakeLockSentinel = await (wakeLockSentinelRequestPromise.value ??
      Promise.resolve(wakeLockSentinel.value))

    if (!currentWakeLockSentinel) {
      return
    }

    currentWakeLockSentinel.removeEventListener('release', handleWakeLockSentinelReleased)
    await currentWakeLockSentinel.release()

    if (wakeLockSentinel.value === currentWakeLockSentinel) {
      wakeLockSentinel.value = null
    }
  }

  const handleWakeLockSentinelReleased = () => {
    if (!wakeLockSentinel.value) {
      return
    }

    requestedWakeLock.value = wakeLockSentinel.value.type
    wakeLockSentinel.value = null
  }

  watch(documentVisible, (visible) => {
    if (visible && requestedWakeLock.value && !wakeLockSentinelRequestPromise.value) {
      doWakeLockRequest(requestedWakeLock.value)
    }
  })

  return {
    active,
    wakeLockSentinel,
    supported: true,
    request,
    forceRequest,
    release,
  }
}
