/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted, nextTick } from "vue";
const props = defineProps();
const messages = ref([]);
const inputText = ref("");
const isConnected = ref(false);
const messagesEl = ref(null);
const bottomEl = ref(null);
let ws = null;
function getWsUrl() {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${location.host}/ws`;
}
function connect() {
    ws = new WebSocket(getWsUrl());
    ws.onopen = () => (isConnected.value = true);
    ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
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
    if (!inputText.value.trim() || !ws || ws.readyState !== WebSocket.OPEN)
        return;
    const msg = {
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
function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
onMounted(connect);
onUnmounted(() => ws?.close());
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['own']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['other']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-window" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chat-header" },
    ...{ style: ({ borderColor: __VLS_ctx.accentColor }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar" },
    ...{ style: ({ background: __VLS_ctx.accentColor }) },
});
(__VLS_ctx.userName.charAt(0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "user-name" },
});
(__VLS_ctx.userName);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "status" },
    ...{ class: ({ connected: __VLS_ctx.isConnected }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "dot" },
});
(__VLS_ctx.isConnected ? "Connected" : "Connecting…");
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "messages-wrap" },
    ref: "messagesEl",
});
/** @type {typeof __VLS_ctx.messagesEl} */ ;
if (__VLS_ctx.messages.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
}
const __VLS_0 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.TransitionGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "message",
    tag: "div",
    ...{ class: "messages" },
}));
const __VLS_2 = __VLS_1({
    name: "message",
    tag: "div",
    ...{ class: "messages" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [msg] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (msg.timestamp + msg.senderId),
        ...{ class: "message-row" },
        ...{ class: (msg.senderId === __VLS_ctx.userId ? 'own' : 'other') },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bubble" },
        ...{ style: (msg.senderId === __VLS_ctx.userId ? { background: __VLS_ctx.accentColor } : {}) },
    });
    if (msg.senderId !== __VLS_ctx.userId) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "bubble-sender" },
        });
        (msg.senderName);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bubble-text" },
    });
    (msg.text);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bubble-time" },
    });
    (__VLS_ctx.formatTime(msg.timestamp));
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ref: "bottomEl",
});
/** @type {typeof __VLS_ctx.bottomEl} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.sendMessage) },
    ...{ class: "chat-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.inputText),
    type: "text",
    placeholder: "Type a message…",
    disabled: (!__VLS_ctx.isConnected),
    autocomplete: "off",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    disabled: (!__VLS_ctx.inputText.trim() || !__VLS_ctx.isConnected),
    ...{ style: ({ background: __VLS_ctx.accentColor }) },
});
/** @type {__VLS_StyleScopedClasses['chat-window']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['header-info']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['messages']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-sender']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-text']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-time']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            messages: messages,
            inputText: inputText,
            isConnected: isConnected,
            messagesEl: messagesEl,
            bottomEl: bottomEl,
            sendMessage: sendMessage,
            formatTime: formatTime,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
