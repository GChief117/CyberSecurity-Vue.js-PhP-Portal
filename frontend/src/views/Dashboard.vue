<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-left">
        <h1 class="logo">Shield</h1>
        <span class="logo-divider"></span>
        <span class="logo-subtitle">Cybersecurity Operations Center</span>
      </div>
      
      <div class="header-center">
        <div class="status-dropdown">
          <div :class="['status-badge', statusClass]" @click="toggleStatusDropdown">
            {{ displayStatus }}
            <span class="status-arrow">▼</span>
          </div>
          <div v-if="showStatusDropdown" class="status-menu">
            <div class="status-option" @click="setStatus('NORMAL')">
              <span class="status-dot status-dot-normal"></span> NORMAL
            </div>
            <div class="status-option" @click="setStatus('WARNING')">
              <span class="status-dot status-dot-warning"></span> WARNING
            </div>
            <div class="status-option" @click="setStatus('CRITICAL')">
              <span class="status-dot status-dot-critical"></span> CRITICAL
            </div>
            <div class="status-option status-option-auto" @click="setStatus(null)">
              <span class="status-dot status-dot-auto"></span> AUTO (based on data)
            </div>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="datetime">
          <span class="time">{{ formattedTime }}</span>
          <span class="date">{{ formattedDate }}</span>
        </div>
        <button class="btn-signout" @click="handleSignOut">Sign Out</button>
      </div>
    </header>
    
    <div v-if="error" class="error-banner">
      {{ error }}
    </div>
    
    <main class="main">
      <SimulationPanel />
      
      <section class="stats-row">
        <div class="stat-card">
          <div class="stat-label">Active Threats</div>
          <div class="stat-value">{{ loading ? '—' : (stats?.threats.active || 0) }}</div>
          <div class="stat-meta">
            <span class="meta-critical">{{ stats?.threats.critical || 0 }} critical</span>
            <span class="meta-divider">·</span>
            <span>{{ stats?.threats.high || 0 }} high</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">Systems Online</div>
          <div class="stat-value">{{ loading ? '—' : (stats?.systems.online || 0) + '/' + (stats?.systems.total || 0) }}</div>
          <div class="stat-meta">
            <span class="meta-success">{{ stats?.systems.online || 0 }} operational</span>
            <span class="meta-divider">·</span>
            <span>{{ stats?.systems.degraded || 0 }} degraded</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">Open Incidents</div>
          <div class="stat-value">{{ loading ? '—' : (stats?.incidents.open || 0) }}</div>
          <div class="stat-meta">
            <span>{{ stats?.incidents.investigating || 0 }} investigating</span>
            <span class="meta-divider">·</span>
            <span class="meta-success">{{ stats?.incidents.resolved_today || 0 }} resolved today</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">System Uptime</div>
          <div class="stat-value stat-value-success">{{ loading ? '—' : (stats?.systems.uptime_percentage || 0) + '%' }}</div>
          <div class="stat-meta">
            <span>Avg resolution: {{ stats?.incidents.avg_resolution_time || 'N/A' }}</span>
          </div>
        </div>
      </section>
      
      <section class="panel-full">
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">System Health</h2>
          </div>
          <div class="panel-body">
            <SystemHealth />
          </div>
        </div>
      </section>
      
      <section class="panels-row">
        <div class="panel panel-wide">
          <div class="panel-header">
            <h2 class="panel-title">Incident Log</h2>
          </div>
          <div class="panel-body">
            <IncidentLog />
          </div>
        </div>
        
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Alerts</h2>
            <span v-if="stats?.alerts?.unread" class="alert-count">{{ stats.alerts.unread }}</span>
          </div>
          <div class="panel-body">
            <AlertPanel />
          </div>
        </div>
      </section>
    </main>
    
    <footer class="footer">
      <span>Shield Security Platform v1.0.0</span>
      <span class="footer-divider">|</span>
      <span>Internal Use Only</span>
    </footer>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-blue-900);
  margin: 0;
}

.logo-divider {
  width: 1px;
  height: 1.25rem;
  background: var(--color-border);
}

.logo-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  letter-spacing: 0.025em;
}

.status-normal {
  background: #e6f4ea;
  color: var(--color-success);
}

.status-warning {
  background: #fef7e0;
  color: var(--color-warning);
}

.status-critical {
  background: #fce8e8;
  color: var(--color-danger);
}

.status-loading {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.status-dropdown {
  position: relative;
}

.status-badge {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-arrow {
  font-size: 0.5rem;
  opacity: 0.7;
}

.status-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.15s ease;
}

.status-option:hover {
  background: var(--color-bg-tertiary);
}

.status-option-auto {
  border-top: 1px solid var(--color-border);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot-normal {
  background: var(--color-success);
}

.status-dot-warning {
  background: var(--color-warning);
}

.status-dot-critical {
  background: var(--color-danger);
}

.status-dot-auto {
  background: var(--color-blue-700);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.datetime {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.time {
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--color-blue-900);
}

.date {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.btn-signout {
  padding: 0.375rem 0.75rem;
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-signout:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.error-banner {
  padding: 0.625rem 1.5rem;
  background: #fce8e8;
  border-bottom: 1px solid #f5c6c6;
  color: var(--color-danger);
  font-size: 0.8125rem;
}

.main {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-blue-900);
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.stat-value-success {
  color: var(--color-success);
}

.stat-meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.meta-critical {
  color: var(--color-danger);
}

.meta-success {
  color: var(--color-success);
}

.meta-divider {
  margin: 0 0.375rem;
  opacity: 0.5;
}

.panels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  flex: 1;
  min-height: 0;
}

.panel-full {
  display: block;
}

.panel-full .panel {
  min-height: 180px;
}

.panels-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
}

.panel {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.panel-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-blue-900);
  margin: 0;
}

.panel-badge {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: var(--color-blue-50);
  color: var(--color-blue-700);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.alert-count {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  background: var(--color-danger);
  color: white;
  border-radius: 10px;
}

.panel-body {
  flex: 1;
  overflow: auto;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
}

.footer-divider {
  opacity: 0.4;
}

@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .panels-grid {
    grid-template-columns: 1fr;
  }
  
  .panels-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .main {
    padding: 1rem;
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import SystemHealth from '@/components/SystemHealth.vue';
import IncidentLog from '@/components/IncidentLog.vue';
import AlertPanel from '@/components/AlertPanel.vue';
import SimulationPanel from '@/components/SimulationPanel.vue';

const router = useRouter();
const authStore = useAuthStore();

const stats = ref(null);
const loading = ref(true);
const error = ref(null);
const currentTime = ref(new Date());
const manualStatus = ref(null);
const showStatusDropdown = ref(false);

let statsInterval = null;
let timeInterval = null;

const securityStatus = computed(() => {
  if (!stats.value) return 'LOADING';
  const openIncidents = stats.value.incidents?.open || 0;
  
  if (openIncidents >= 5) return 'CRITICAL';
  if (openIncidents >= 1) return 'WARNING';
  return 'NORMAL';
});

const displayStatus = computed(() => {
  return manualStatus.value || securityStatus.value;
});

const statusClass = computed(() => {
  const classes = {
    'CRITICAL': 'status-critical',
    'WARNING': 'status-warning',
    'NORMAL': 'status-normal',
    'LOADING': 'status-loading',
  };
  return classes[displayStatus.value] || 'status-loading';
});

const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

async function fetchStats() {
  try {
    const response = await api.dashboard.getStats();
    stats.value = response.data.data;
    error.value = null;
  } catch (err) {
    console.error('[Dashboard] Failed to fetch stats:', err);
    error.value = 'Failed to refresh dashboard data. Retrying...';
  } finally {
    loading.value = false;
  }
}

async function handleSignOut() {
  await authStore.logout();
  router.push('/login');
}

function toggleStatusDropdown() {
  showStatusDropdown.value = !showStatusDropdown.value;
}

function setStatus(status) {
  manualStatus.value = status;
  showStatusDropdown.value = false;
}

onMounted(() => {
  fetchStats();
  statsInterval = setInterval(fetchStats, 5000);
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval);
  if (timeInterval) clearInterval(timeInterval);
});
</script>
