<template>
  <div class="system-health">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading systems...</span>
    </div>
    
    <!-- Systems Grid -->
    <div v-else-if="sortedSystems.length > 0" class="systems-grid">
      <div 
        v-for="system in sortedSystems" 
        :key="system.id"
        :class="['system-card', 'status-' + system.status]"
        @click="selectSystem(system)"
      >
        <div class="system-header">
          <span :class="['status-dot', 'dot-' + system.status]"></span>
          <span class="system-status">{{ system.status }}</span>
        </div>
        
        <div class="system-name">{{ system.name }}</div>
        <div class="system-type">{{ formatType(system.type) }}</div>
        
        <div class="system-details">
          <div class="detail-item">
            <span class="detail-label">IP</span>
            <span class="detail-value">{{ system.ip_address || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Last Seen</span>
            <span class="detail-value">{{ formatHeartbeat(system.last_heartbeat) }}</span>
          </div>
        </div>
        
        <div v-if="system.location" class="system-location">
          {{ system.location }}
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty">
      <div class="empty-text">No systems configured</div>
    </div>
    
    <!-- Detail Modal -->
    <div v-if="selectedSystemDetail" class="modal-overlay" @click="selectedSystemDetail = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">System Details</h3>
          <button class="modal-close" @click="selectedSystemDetail = null">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-detail-row">
            <span class="modal-detail-label">Name</span>
            <span class="modal-detail-value">{{ selectedSystemDetail.name }}</span>
          </div>
          <div class="modal-detail-row">
            <span class="modal-detail-label">Type</span>
            <span class="modal-detail-value">{{ formatType(selectedSystemDetail.type) }}</span>
          </div>
          <div class="modal-detail-row">
            <span class="modal-detail-label">Status</span>
            <span :class="['status-badge', 'badge-' + selectedSystemDetail.status]">
              {{ selectedSystemDetail.status }}
            </span>
          </div>
          <div class="modal-detail-row">
            <span class="modal-detail-label">IP Address</span>
            <span class="modal-detail-value mono">{{ selectedSystemDetail.ip_address || 'N/A' }}</span>
          </div>
          <div class="modal-detail-row">
            <span class="modal-detail-label">Location</span>
            <span class="modal-detail-value">{{ selectedSystemDetail.location || 'N/A' }}</span>
          </div>
          <div class="modal-detail-row">
            <span class="modal-detail-label">Last Heartbeat</span>
            <span class="modal-detail-value">{{ formatDateTime(selectedSystemDetail.last_heartbeat) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-health {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
}

.loading {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-blue-700);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.system-card {
  padding: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.system-card:hover {
  border-color: var(--color-blue-700);
  box-shadow: 0 2px 8px rgba(9, 105, 218, 0.1);
}

.system-card.status-offline {
  border-left: 3px solid var(--color-danger);
}

.system-card.status-degraded {
  border-left: 3px solid var(--color-warning);
}

.system-card.status-online {
  border-left: 3px solid var(--color-success);
}

.system-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-online {
  background: var(--color-success);
}

.dot-degraded {
  background: var(--color-warning);
}

.dot-offline {
  background: var(--color-danger);
}

.system-status {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.system-name {
  font-weight: 600;
  color: var(--color-blue-900);
  margin-bottom: 0.125rem;
  font-size: 0.875rem;
}

.system-type {
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.system-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.detail-label {
  color: var(--color-text-tertiary);
}

.detail-value {
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.system-location {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 37, 64, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-blue-900);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
}

.modal-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.modal-detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.modal-detail-value {
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.modal-detail-value.mono {
  font-family: var(--font-mono);
}

.status-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.badge-online {
  background: #e6f4ea;
  color: var(--color-success);
}

.badge-degraded {
  background: #fef7e0;
  color: var(--color-warning);
}

.badge-offline {
  background: #fce8e8;
  color: var(--color-danger);
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';

const systems = ref([]);
const loading = ref(true);
const selectedSystemDetail = ref(null);

let pollInterval = null;

const sortedSystems = computed(() => {
  const statusOrder = { offline: 0, degraded: 1, online: 2 };
  return [...systems.value].sort((a, b) => {
    return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
  });
});

async function fetchSystems(showLoading = true) {
  if (showLoading) loading.value = true;
  
  try {
    const response = await api.systems.getAll();
    systems.value = response.data.data || [];
  } catch (error) {
    console.error('[SystemHealth] Failed to fetch:', error);
  } finally {
    loading.value = false;
  }
}

function selectSystem(system) {
  selectedSystemDetail.value = system;
}

function formatType(type) {
  if (!type) return 'System';
  return type.replace(/_/g, ' ');
}

function formatHeartbeat(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  return Math.floor(diff / 3600) + 'h ago';
}

function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
}

onMounted(() => {
  fetchSystems();
  pollInterval = setInterval(() => fetchSystems(false), 5000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
