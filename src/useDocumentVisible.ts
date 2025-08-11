import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const isVisibleState = (visibilityState: DocumentVisibilityState) => visibilityState === 'visible'

interface UseDocumentVisibleReturn {
  readonly documentVisible: Ref<boolean>
}

export const useDocumentVisible = (): UseDocumentVisibleReturn => {
  if (typeof document === 'undefined') {
    return {
      documentVisible: ref(false),
    }
  }

  const documentVisible = ref<boolean>(isVisibleState(document.visibilityState))

  const handleVisibilityChange = () => {
    documentVisible.value = isVisibleState(document.visibilityState)
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    documentVisible,
  }
}
