<template>
  <!-- User selection screen -->
  <div v-if="!activeUser" class="pick-screen">
    <div class="pick-card">
      <div class="pick-logo">💬</div>
      <h1>Real-Time Chat</h1>
      <p>Who are you in this session?</p>
      <div class="pick-buttons">
        <button
          v-for="u in users"
          :key="u.id"
          class="pick-btn"
          :style="{ '--accent': u.color }"
          @click="selectUser(u)"
        >
          <span class="pick-avatar">{{ u.name.charAt(0) }}</span>
          {{ u.name }}
        </button>
      </div>
    </div>
  </div>

  <!-- Single full-screen chat window -->
  <div v-else class="chat-layout">
    <ChatWindow
      :userId="activeUser.id"
      :userName="activeUser.name"
      :accentColor="activeUser.color"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ChatWindow from "./components/ChatWindow.vue";

interface User { id: string; name: string; color: string }

const users: User[] = [
  { id: "user-alice", name: "Alice", color: "#7c6af7" },
  { id: "user-bob",   name: "Bob",   color: "#06b6d4" },
];

const activeUser = ref<User | null>(null);

function selectUser(u: User) {
  activeUser.value = u;
  const url = new URL(location.href);
  url.searchParams.set("user", u.id);
  history.replaceState(null, "", url.toString());
}

onMounted(() => {
  const param = new URLSearchParams(location.search).get("user");
  const found = users.find((u) => u.id === param);
  if (found) activeUser.value = found;
});
</script>

<style scoped>
/* ── Selection screen ── */
.pick-screen {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.pick-card {
  background: #1a1a24;
  border: 1px solid #2a2a3a;
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.pick-logo {
  font-size: 48px;
  margin-bottom: 16px;
}

.pick-card h1 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #e8e8f0;
}

.pick-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.pick-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pick-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #2a2a3a;
  background: #13131c;
  color: #e8e8f0;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.1s;
}

.pick-btn:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, #13131c);
}

.pick-btn:active {
  transform: scale(0.98);
}

.pick-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  flex-shrink: 0;
}

/* ── Chat layout ── */
.chat-layout {
  height: 100%;
  padding: 20px;
}
</style>
