<template>
  <div class="task-container">
    <div class="task-item-container">
      <div class="task-item" :class="{ done: task.done }">
        <img v-if="task.img_url" :src="task.img_url" class="task-thumbnail" alt="Imagem da tarefa" />
        <label class="task-label">
          <input type="checkbox" :checked="task.done" @change="$emit('toggle', task.id)" />
          <span class="task-title">{{ task.title }}</span>
        </label>
        <div class="task-actions">
          <button v-if="hasLocation" type="button" class="task-location-btn" @click="showMap = !showMap">
            {{ showMap ? 'Ocultar Mapa' : 'Ver Local' }}
          </button>
          <button class="task-edit" @click="$emit('edit', task)">Editar</button>
          <button class="task-remove" @click="$emit('remove', task.id)">Remover</button>
        </div>
      </div>
      <div class="task-map-container">
        <div v-if="showMap && hasLocation" class="map-wrapper">
          <p v-if="task.location_label" class="location-title">
            {{ task.location_label }}
          </p>
          <TaskLocationMap :location="formattedLocation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskLocationMap from './TaskLocationMap.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})
const showMap = ref(false)

const hasLocation = computed(() => {
  return props.task.latitude != null && props.task.longitude != null;
});

const formattedLocation = computed(() => {
  if (!hasLocation.value) return null;
  return {
    latitude: Number(props.task.latitude),
    longitude: Number(props.task.longitude),
    accuracy: props.task.geolocation_accuracy ?? 0,
    label: props.task.location_label || '',
  };
});

defineEmits(['toggle', 'remove', 'edit'])
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  padding: 12px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s;
}

.task-thumbnail {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  flex-shrink: 0;
}

.task-item.done {
  opacity: 0.6;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.task-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: #4a90d9;
}

.task-title {
  font-size: 1rem;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-remove {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-remove:hover {
  text-decoration: underline;
}

.task-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.task-edit {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-edit:hover {
  text-decoration: underline;
}

.task-location-btn {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-item-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-container{
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s;
}

.location-title {
  font-size: 1.2rem;
  color: black;
  margin-bottom: 4px;
}
</style>
