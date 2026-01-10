<template>
  <div class="incident-log">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="filters">
        <select v-model="selectedSeverity" class="filter-select">
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
        </select>
        
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search incidents..."
          class="search-input"
        >
      </div>
      
      <div class="toolbar-right">
        <span v-if="resolvedCount > 0" class="resolved-count">{{ resolvedCount }} resolved</span>
        <span class="incident-count">{{ displayedIncidents.length }} incidents</span>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading incidents...</span>
    </div>
    
    <!-- Incidents Table -->
    <div v-else-if="displayedIncidents.length > 0" class="incidents-table">
      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incident in displayedIncidents" :key="incident.id" @click="selectIncident(incident)">
            <td>
              <span :class="['severity-badge', 'severity-' + incident.severity]">
                {{ incident.severity }}
              </span>
            </td>
            <td class="title-cell">{{ incident.title }}</td>
            <td>
              <span :class="['status-badge', 'status-' + incident.status]">
                {{ incident.status }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(incident.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty">
      <div class="empty-text">No incidents found</div>
    </div>
    
    <!-- Detail Modal -->
    <div v-if="selectedIncidentDetail" class="modal-overlay" @click="selectedIncidentDetail = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Incident Details</h3>
          <button class="modal-close" @click="selectedIncidentDetail = null">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">ID</span>
            <span class="detail-value">#{{ selectedIncidentDetail.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Title</span>
            <span class="detail-value">{{ selectedIncidentDetail.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Severity</span>
            <span :class="['severity-badge', 'severity-' + selectedIncidentDetail.severity]">
              {{ selectedIncidentDetail.severity }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span :class="['status-badge', 'status-' + selectedIncidentDetail.status]">
              {{ selectedIncidentDetail.status }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created</span>
            <span class="detail-value">{{ formatDateTime(selectedIncidentDetail.created_at) }}</span>
          </div>
          <div class="detail-row detail-row-full">
            <span class="detail-label">Description</span>
            <p class="detail-text">{{ selectedIncidentDetail.description }}</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-success" @click="resolveIncident(selectedIncidentDetail)">
              Resolve Incident
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.incident-log {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.8125rem;
}

.search-input {
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.8125rem;
  width: 180px;
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
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.incidents-table {
  flex: 1;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

th {
  text-align: left;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-size: 0.6875rem;
  background: var(--color-bg-secondary);
}

td {
  text-align: left;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

tbody tr {
  cursor: pointer;
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: var(--color-bg-tertiary);
}

.title-cell {
  color: var(--color-blue-900);
  font-weight: 500;
}

.date-cell {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.severity-badge {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.severity-critical {
  background: #fce8e8;
  color: var(--color-danger);
}

.severity-high {
  background: #fef7e0;
  color: var(--color-warning);
}

.severity-medium {
  background: var(--color-blue-50);
  color: var(--color-blue-700);
}

.severity-low {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.status-badge {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.status-open {
  background: #fce8e8;
  color: var(--color-danger);
}

.status-investigating {
  background: #fef7e0;
  color: var(--color-warning);
}

.status-resolved {
  background: #e6f4ea;
  color: var(--color-success);
}

.btn {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-blue-700);
  color: white;
  border: none;
}

.btn-secondary {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-success {
  background: var(--color-success);
  color: white;
  border: none;
}

.btn-danger {
  background: var(--color-danger);
  color: white;
  border: none;
}

.incident-count {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.resolved-count {
  font-size: 0.75rem;
  color: var(--color-success);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
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
  max-width: 480px;
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

.form-group {
  margin-bottom: 0.875rem;
}

.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
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
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';

const incidents = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedSeverity = ref('all');
const selectedStatus = ref('all');
const selectedIncidentDetail = ref(null);
const resolvedCount = ref(0);

let pollInterval = null;

const filteredIncidents = computed(() => {
  return incidents.value.filter(incident => {
    const matchesSearch = !searchQuery.value || 
      incident.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSeverity = selectedSeverity.value === 'all' || 
      incident.severity === selectedSeverity.value;
    const matchesStatus = selectedStatus.value === 'all' || 
      incident.status === selectedStatus.value;
    return matchesSearch && matchesSeverity && matchesStatus;
  });
});

const displayedIncidents = computed(() => {
  return filteredIncidents.value.slice(0, 10);
});

async function fetchIncidents(showLoading = true) {
  if (showLoading) loading.value = true;
  try {
    const response = await api.incidents.getAll();
    incidents.value = response.data.data || [];
  } catch (error) {
    console.error('[IncidentLog] Failed to fetch:', error);
  } finally {
    loading.value = false;
  }
}

async function resolveIncident(incident) {
  try {
    await api.incidents.delete(incident.id);
    resolvedCount.value++;
    selectedIncidentDetail.value = null;
    fetchIncidents(false);
  } catch (error) {
    console.error('[IncidentLog] Failed to resolve:', error);
  }
}

function selectIncident(incident) {
  selectedIncidentDetail.value = incident;
}

function formatDate(timestamp) {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
}

onMounted(() => {
  fetchIncidents();
  pollInterval = setInterval(() => fetchIncidents(false), 5000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
