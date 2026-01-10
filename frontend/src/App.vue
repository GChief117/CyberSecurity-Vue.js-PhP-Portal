<template>
  <router-view />
</template>

<style>
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #f0f2f5;
  --color-text-primary: #0a2540;
  --color-text-secondary: #4a6785;
  --color-text-tertiary: #8898a9;
  --color-border: #d0d7de;
  --color-blue-900: #0a2540;
  --color-blue-800: #0d3a6a;
  --color-blue-700: #0969da;
  --color-blue-50: #f0f7ff;
  --color-success: #1a7f37;
  --color-warning: #9a6700;
  --color-danger: #cf222e;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-md: 0 4px 12px rgba(10, 37, 64, 0.08);
  --shadow-lg: 0 8px 24px rgba(10, 37, 64, 0.12);
  --font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  line-height: 1.5;
}
</style>

<script setup>
</script>
