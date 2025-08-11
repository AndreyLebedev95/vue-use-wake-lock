# ⚡️ vue-use-wake-lock

A lightweight Vue 3 hook for managing the Wake Lock API — prevents your device from going to sleep.

---

## 🚀 Installation

```bash
pnpm add vue-use-wake-lock
# or
npm install vue-use-wake-lock
# or
yarn add vue-use-wake-lock
```

## 🛠️ Usage

```
<script setup lang="ts">
import { useWakeLock } from 'vue-use-wake-lock'

const {
  wakeLockSentinel,
  active,
  supported,
  request,
  forceRequest,
  release
} = useWakeLock()

const enableWakeLock = async () => {
  if (supported) {
    await request()
  }
}

const disableWakeLock = async () => {
  if (active.value) {
    await release()
  }
}
</script>

<template>
  <button @click="enableWakeLock">Enable Wake Lock</button>
  <button @click="disableWakeLock">Disable Wake Lock</button>
  <p v-if="!supported">Wake Lock API is not supported in this browser.</p>
</template>

```

## 📚 Hook return values

| Property / Method     | Type                                             | Description                                                                  | 
| --------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| `wakeLockSentinel`    | `Ref<WakeLockSentinel \| null>`                  | Reactive reference to the Wake Lock sentinel instance                        |
| `active`              | `ComputedRef<boolean>`                           | Indicates whether the Wake Lock is currently active                          |     |
| `supported`           | `boolean`                                        | Whether the Wake Lock API is supported in the browser                        |     |
| `request(type?)`      | `(type?: WakeLockSentinelType) => Promise<void>` | Request a Wake Lock, optionally specifying the type (screen by default)      |     |
| `forceRequest(type?)` | `(type?: WakeLockSentinelType) => Promise<void>` | Force a Wake Lock request, ignoring some internal checks (screen by default) |     |
| `release()`           | `() => Promise<void>`                            | Release the active Wake Lock                                                 |     |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/AndreyLebedev95/vue-use-wake-lock/issues).

## 🌐 Compatibility

Vue 3.5+

Modern browsers supporting the [Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)

## 📄 License

[https://github.com/AndreyLebedev95/vue-use-wake-lock/blob/main/LICENSE](MIT License) © 2025-PRESENT Andrei Lebedev
