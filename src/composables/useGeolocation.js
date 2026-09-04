import { ref } from 'vue'

export function useGeolocation() {
  const isSupported =
    typeof navigator !== 'undefined' && typeof navigator.geolocation !== 'undefined'
  const permissionState = ref('unknown')
  const loadingLocation = ref(false)
  const locationError = ref('')
  const location = ref(null)

  async function readPermissionState() {
    if (!navigator.permissions?.query) return
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' })
      permissionState.value = status.state
      status.onchange = () => {
        permissionState.value = status.state
      }
    } catch {
      permissionState.value = 'unknown'
    }
  }

  function setLocationFromTask(task) {
    if (!task || task.latitude == null || task.longitude == null) {
      location.value = null
      return
    }
    location.value = {
      latitude: task.latitude,
      longitude: task.longitude,
      accuracy: task.geolocation_accuracy ?? null,
      timestamp: task.geolocation_timestamp
        ? Date.parse(task.geolocation_timestamp)
        : Date.now(),
      label: task.location_label ?? null,
    }
  }

  function clearLocation() {
    location.value = null
    locationError.value = ''
  }

  function setLocationLabel(label) {
    if (location.value) location.value = { ...location.value, label: label || null }
  }

  // Faz uma única tentativa de leitura de posição com as opções fornecidas.
  function getPosition(options) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  function requestCurrentLocation() {
    if (!isSupported) {
      locationError.value = 'Geolocalização não suportada neste dispositivo.'
      return Promise.resolve(null)
    }

    loadingLocation.value = true
    locationError.value = ''

    // 1ª tentativa: alta precisão (GPS), timeout curto.
    // Se der timeout (comum em desktop sem GPS, ou GPS lento em ambientes fechados),
    // cai para uma 2ª tentativa sem alta precisão (Wi-Fi/rede), com timeout maior.
    // Isso evita que o usuário fique preso esperando um GPS que nunca responde.
    return attempt({ enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 })
      .catch((error) => {
        if (error.code === error.TIMEOUT) {
          return attempt({ enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 })
        }
        throw error
      })
      .then((position) => {
        permissionState.value = 'granted'
        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          label: null,
        }
        return location.value
      })
      .catch((error) => {
        if (error.code === error.PERMISSION_DENIED) {
          permissionState.value = 'denied'
          locationError.value =
            'Permissão de localização negada. Verifique as permissões do site e se o serviço de localização do dispositivo está ativado.'
        } else if (error.code === error.TIMEOUT) {
          locationError.value =
            'Tempo esgotado para obter localização. Verifique se o GPS/serviço de localização está ativado e tente novamente ao ar livre ou perto de uma janela.'
        } else {
          locationError.value = 'Não foi possível obter a localização agora.'
        }
        return null
      })
      .finally(() => {
        loadingLocation.value = false
      })

    function attempt(options) {
      return getPosition(options)
    }
  }

  return {
    isSupported,
    permissionState,
    loadingLocation,
    locationError,
    location,
    readPermissionState,
    setLocationFromTask,
    clearLocation,
    setLocationLabel,
    requestCurrentLocation,
  }
}
