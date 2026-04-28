<template>
  <div class="chat-window">
    <!-- Header -->
    <div class="chat-header" :style="{ borderColor: accentColor }">
      <div class="avatar" :style="{ background: accentColor }">
        {{ userName.charAt(0) }}
      </div>
      <div class="header-info">
        <span class="user-name">{{ userName }}</span>
        <span class="status" :class="{ connected: isConnected }">
          <span class="dot" />
          {{ isConnected ? "Connected" : "Connecting…" }}
        </span>
      </div>
    </div>

    <!-- Messages -->
    <div class="messages-wrap" ref="messagesEl">
      <div v-if="messages.length === 0" class="empty-state">
        No messages yet. Say hello! 👋
      </div>

      <TransitionGroup name="message" tag="div" class="messages">
        <div
          v-for="msg in messages"
          :key="msg.timestamp + msg.senderId"
          class="message-row"
          :class="msg.senderId === userId ? 'own' : 'other'"
        >
          <div class="bubble" :style="msg.senderId === userId ? { background: accentColor } : {}">
            <span class="bubble-sender" v-if="msg.senderId !== userId">{{ msg.senderName }}</span>
            <span class="bubble-text">{{ msg.text }}</span>
            <span class="bubble-time">{{ formatTime(msg.timestamp) }}</span>
          </div>
        </div>
      </TransitionGroup>

      <!-- sentinel: always scroll this into view on new message -->
      <div ref="bottomEl" />
    </div>

    <!-- Input -->
    <form class="chat-input" @submit.prevent="sendMessage">
      <input
        v-model="inputText"
        type="text"
        placeholder="Type a message…"
        :disabled="!isConnected"
        autocomplete="off"
      />
      <button type="submit" :disabled="!inputText.trim() || !isConnected" :style="{ background: accentColor }">
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import type { ChatMessage } from "../types";

const props = defineProps<{
  userId: string;
  userName: string;
  accentColor: string;
}>();

const messages = ref<ChatMessage[]>([]);
const inputText = ref("");
const isConnected = ref(false);
const messagesEl = ref<HTMLElement | null>(null);
const bottomEl = ref<HTMLElement | null>(null);
let ws: WebSocket | null = null;

function getWsUrl() {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${location.host}/ws`;
}

function connect() {
  ws = new WebSocket(getWsUrl());

  ws.onopen = () => (isConnected.value = true);

  ws.onmessage = async (event) => {
    const msg: ChatMessage = JSON.parse(event.data);
    messages.value.push(msg);
    await nextTick();
    scrollToBottom();
  };

  ws.onclose = () => {
    isConnected.value = false;
    setTimeout(connect, 2000);
  };

  ws.onerror = () => ws?.close();
}

function sendMessage() {
  if (!inputText.value.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
  const msg: ChatMessage = {
    senderId: props.userId,
    senderName: props.userName,
    text: inputText.value.trim(),
    timestamp: Date.now(),
  };
  ws.send(JSON.stringify(msg));
  inputText.value = "";
}

function scrollToBottom() {
  bottomEl.value?.scrollIntoView({ behavior: "smooth", block: "end" });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

onMounted(connect);
onUnmounted(() => ws?.close());
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: #1a1a24;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #2a2a3a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #13131c;
  border-bottom: 2px solid;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  flex-shrink: 0;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  font-size: 15px;
}

.status {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status.connected {
  color: #4ade80;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

/* Messages */
.messages-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.messages-wrap::-webkit-scrollbar {
  width: 4px;
}
.messages-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.messages-wrap::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  text-align: center;
  color: #444;
  margin-top: 40px;
  font-size: 14px;
}

/* Rows */
.message-row {
  display: flex;
}

.message-row.own {
  justify-content: flex-end;
}

.message-row.other {
  justify-content: flex-start;
}

/* Bubbles */
.bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  background: #2a2a3a;
  display: flex;
  flex-direction: column;
  gap: 4px;
  word-break: break-word;
}

.message-row.own .bubble {
  border-bottom-right-radius: 4px;
  color: #fff;
}

.message-row.other .bubble {
  border-bottom-left-radius: 4px;
}

.bubble-sender {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.75;
}

.bubble-text {
  font-size: 14px;
  line-height: 1.5;
}

.bubble-time {
  font-size: 10px;
  opacity: 0.5;
  align-self: flex-end;
}

/* Input */
.chat-input {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  background: #13131c;
  border-top: 1px solid #2a2a3a;
}

.chat-input input {
  flex: 1;
  background: #2a2a3a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 10px 14px;
  color: #e8e8f0;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input input:focus {
  border-color: #555;
}

.chat-input input::placeholder {
  color: #555;
}

.chat-input button {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s, transform 0.1s;
}

.chat-input button:hover:not(:disabled) {
  opacity: 0.85;
}

.chat-input button:active:not(:disabled) {
  transform: scale(0.97);
}

.chat-input button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Animations */
.message-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.message-move {
  transition: transform 0.3s ease;
}
</style>
