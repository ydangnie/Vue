<template>
  <div v-if="show" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <div :class="['toast show', toastClass]" role="alert">
      <div class="toast-header">
        <i :class="iconClass" class="me-2"></i>
        <strong class="me-auto">{{ title }}</strong>
        <button type="button" class="btn-close" @click="close"></button>
      </div>
      <div class="toast-body">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'info', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  computed: {
    toastClass() {
      return `toast-${this.type}`;
    },
    iconClass() {
      const icons = {
        success: 'fas fa-check-circle text-success',
        error: 'fas fa-exclamation-triangle text-danger',
        warning: 'fas fa-exclamation-circle text-warning',
        info: 'fas fa-info-circle text-info'
      };
      return icons[this.type] || icons.info;
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.duration > 0) {
        setTimeout(() => {
          this.close();
        }, this.duration);
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.toast-container {
  min-width: 350px;
}

.toast {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
}

.toast-success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border-left: 4px solid #28a745;
}

.toast-error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border-left: 4px solid #dc3545;
}

.toast-warning {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-left: 4px solid #ffc107;
}

.toast-info {
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  border-left: 4px solid #17a2b8;
}

.toast-header {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.8);
  border-radius: 8px 8px 0 0;
}

.toast-body {
  font-weight: 500;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  opacity: 0.7;
}

.btn-close:hover {
  opacity: 1;
}
</style>