<template>
  <div class="sim-panel">
    <div class="sim-header">
      <div class="sim-title-group">
        <span class="sim-title">Data Simulation</span>
        <span class="sim-subtitle">Demonstrates Laravel API → Vue.js data flow</span>
      </div>
      <span v-if="isRunning" class="sim-status sim-status-running">STREAMING</span>
      <span v-else class="sim-status sim-status-stopped">STOPPED</span>
    </div>
    
    <div class="sim-row">
      <div class="sim-controls">
        <button 
          :class="['btn', isRunning ? 'btn-danger' : 'btn-primary']" 
          @click="toggleStream"
        >
          {{ isRunning ? 'Stop Stream' : 'Start Stream' }}
        </button>
      </div>
      
      <div v-if="lastEvent" class="last-event">
        Last event: <strong class="event-type">{{ lastEvent.type }}</strong> at {{ lastEvent.time }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sim-panel {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.sim-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.sim-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.sim-title {
  font-weight: 600;
  color: var(--color-blue-900);
  font-size: 0.875rem;
}

.sim-subtitle {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
}

.sim-status {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.sim-status-running {
  background: #e6f4ea;
  color: var(--color-success);
}

.sim-status-stopped {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.sim-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.sim-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.select-input {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  background: var(--color-bg-primary);
}

.select-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sim-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--color-blue-700);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--color-blue-800);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
  border: none;
}

.btn-danger:hover {
  opacity: 0.9;
}

.btn-outline {
  background: var(--color-bg-primary);
  color: var(--color-blue-700);
  border: 1px solid var(--color-blue-700);
}

.btn-outline:hover {
  background: var(--color-blue-50);
}

.last-event {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}

.event-type {
  color: var(--color-blue-700);
}
</style>

<script setup>
import { ref, onUnmounted } from 'vue';
import api from '@/services/api';

const isRunning = ref(false);
const interval = ref(3000);
const dataSource = ref('random');
const lastEvent = ref(null);
let timer = null;

const dataSources = [
  { value: 'random', label: 'Random Events' },
  { value: 'threats', label: 'Threat Feed' },
  { value: 'alerts', label: 'System Alerts' },
  { value: 'incidents', label: 'Incidents' },
];

async function generateThreat() {
  try {
    await api.simulate.threat();
    lastEvent.value = { type: 'Threat', time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error('Failed to generate threat', e);
  }
}

async function generateAlert() {
  try {
    await api.simulate.alert();
    lastEvent.value = { type: 'Alert', time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error('Failed to generate alert', e);
  }
}

async function generateIncident() {
  try {
    await api.simulate.incident();
    lastEvent.value = { type: 'Incident', time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error('Failed to generate incident', e);
  }
}

async function seedSystems() {
  try {
    await api.post('/simulate/systems');
    lastEvent.value = { type: 'Systems Seeded', time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error('Failed to seed systems', e);
  }
}

async function generateBySource() {
  switch (dataSource.value) {
    case 'threats':
      await generateThreat();
      break;
    case 'alerts':
      await generateAlert();
      break;
    case 'incidents':
      await generateIncident();
      break;
    default:
      await api.simulate.random();
      lastEvent.value = { type: 'Random', time: new Date().toLocaleTimeString() };
  }
}

function toggleStream() {
  if (isRunning.value) {
    clearInterval(timer);
    timer = null;
    isRunning.value = false;
  } else {
    isRunning.value = true;
    timer = setInterval(generateBySource, interval.value);
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
