<template>
  <div class="alert-panel">
    <!-- Filter -->
    <div class="filter-bar">
      <select v-model="selectedType" class="filter-select">
        <option value="all">All Alerts</option>
        <option value="security">Security</option>
        <option value="system">System</option>
        <option value="maintenance">Maintenance</option>
        <option value="info">Info</option>
      </select>
      <div class="filter-stats">
        <span v-if="dismissedCount > 0" class="dismissed-count">{{ dismissedCount }} dismissed</span>
        <span v-if="highPriorityCount > 0" class="high-count">{{ highPriorityCount }} high priority</span>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading alerts...</span>
    </div>
    
    <!-- Alert List -->
    <div v-else-if="displayedAlerts.length > 0" class="alert-list">
      <div 
        v-for="alert in displayedAlerts" 
        :key="alert.id"
        :class="['alert-item', 'priority-' + alert.priority]"
        @click="selectAlert(alert)"
      >
        <div class="alert-icon">{{ getTypeIcon(alert.type) }}</div>
        
        <div class="alert-content">
          <div class="alert-header">
            <span class="alert-type">{{ alert.type }}</span>
            <span class="alert-time">{{ formatTime(alert.created_at) }}</span>
          </div>
          <div class="alert-title">{{ alert.title }}</div>
          <div class="alert-message">{{ alert.message }}</div>
        </div>
        
        <button class="dismiss-btn" @click.stop="dismissAlert(alert)" title="Dismiss">
          ×
        </button>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty">
      <div class="empty-icon">—</div>
      <div class="empty-text">No alerts to display</div>
    </div>
    
    <!-- Detail Modal -->
    <div v-if="selectedAlertDetail" class="modal-overlay" @click="selectedAlertDetail = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Alert Details</h3>
          <button class="modal-close" @click="selectedAlertDetail = null">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">ID</span>
            <span class="detail-value">#{{ selectedAlertDetail.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type</span>
            <span class="detail-value">{{ selectedAlertDetail.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Priority</span>
            <span :class="['priority-badge', 'priority-' + selectedAlertDetail.priority]">
              {{ selectedAlertDetail.priority }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Title</span>
            <span class="detail-value">{{ selectedAlertDetail.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created</span>
            <span class="detail-value">{{ formatDateTime(selectedAlertDetail.created_at) }}</span>
          </div>
          <div class="detail-row detail-row-full">
            <span class="detail-label">Message</span>
            <p class="detail-text">{{ selectedAlertDetail.message }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-dismiss-alert" @click="dismissSelectedAlert">Dismiss Alert</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-panel {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.filter-select {
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.8125rem;
}

.high-count {
  font-size: 0.75rem;
  color: var(--color-danger);
  font-weight: 500;
}

.filter-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dismissed-count {
  font-size: 0.75rem;
  color: var(--color-success);
  font-weight: 500;
}

.loading {
  flex: 1;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

.alert-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
}

.alert-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.alert-item:hover {
  border-color: var(--color-blue-700);
}

.alert-item.priority-high {
  border-left: 3px solid var(--color-danger);
}

.alert-item.priority-medium {
  border-left: 3px solid var(--color-warning);
}

.alert-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-blue-50);
  color: var(--color-blue-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.alert-type {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
}

.alert-time {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
}

.alert-title {
  font-weight: 500;
  color: var(--color-blue-900);
  font-size: 0.8125rem;
  margin-bottom: 0.125rem;
}

.alert-message {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.dismiss-btn {
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.dismiss-btn:hover {
  color: var(--color-danger);
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

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-row-full {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.detail-value {
  font-size: 0.875rem;
  color: var(--color-text-primary);
}

.detail-text {
  font-size: 0.875rem;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.5;
}

.priority-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.priority-badge.priority-high {
  background: #fce8e8;
  color: var(--color-danger);
}

.priority-badge.priority-medium {
  background: #fef7e0;
  color: var(--color-warning);
}

.priority-badge.priority-low {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.btn-dismiss-alert {
  width: 100%;
  padding: 0.625rem 1rem;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.btn-dismiss-alert:hover {
  opacity: 0.9;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';

const alerts = ref([]);
const loading = ref(true);
const selectedType = ref('all');
const selectedAlertDetail = ref(null);
const dismissedCount = ref(0);

let pollInterval = null;

const filteredAlerts = computed(() => {
  if (selectedType.value === 'all') return alerts.value;
  return alerts.value.filter(alert => alert.type === selectedType.value);
});

const displayedAlerts = computed(() => {
  return filteredAlerts.value.slice(0, 10);
});

const highPriorityCount = computed(() => {
  return displayedAlerts.value.filter(a => a.priority === 'high').length;
});

async function fetchAlerts(showLoading = true) {
  if (showLoading) loading.value = true;
  
  try {
    const response = await api.alerts.getAll();
    alerts.value = response.data.data || [];
  } catch (error) {
    console.error('[AlertPanel] Failed to fetch:', error);
  } finally {
    loading.value = false;
  }
}

async function dismissAlert(alert) {
  try {
    await api.alerts.dismiss(alert.id);
    alerts.value = alerts.value.filter(a => a.id !== alert.id);
    dismissedCount.value++;
  } catch (error) {
    console.error('[AlertPanel] Failed to dismiss:', error);
  }
}

async function dismissSelectedAlert() {
  if (selectedAlertDetail.value) {
    await dismissAlert(selectedAlertDetail.value);
    selectedAlertDetail.value = null;
  }
}

function selectAlert(alert) {
  selectedAlertDetail.value = alert;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
}

function getTypeIcon(type) {
  const icons = { security: '!', system: 'S', maintenance: 'M', info: 'i', warning: '!' };
  return icons[type] || '•';
}

onMounted(() => {
  fetchAlerts();
  pollInterval = setInterval(() => fetchAlerts(false), 5000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
