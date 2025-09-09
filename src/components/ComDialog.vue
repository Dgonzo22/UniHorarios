<template>
  <div v-if="visible" class="overlay">
    <div class="dialog">
      <header class="dialog-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="closeDialog">✖</button>
      </header>
      <section class="dialog-body">
        <slot>
        </slot>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Título del diálogo"
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.dialog-body {
  padding: 1rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
