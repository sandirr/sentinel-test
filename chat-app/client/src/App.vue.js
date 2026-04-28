/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from "vue";
import ChatWindow from "./components/ChatWindow.vue";
const users = [
    { id: "user-alice", name: "Alice", color: "#7c6af7" },
    { id: "user-bob", name: "Bob", color: "#06b6d4" },
];
const activeUser = ref(null);
function selectUser(u) {
    activeUser.value = u;
    const url = new URL(location.href);
    url.searchParams.set("user", u.id);
    history.replaceState(null, "", url.toString());
}
onMounted(() => {
    const param = new URLSearchParams(location.search).get("user");
    const found = users.find((u) => u.id === param);
    if (found)
        activeUser.value = found;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pick-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (!__VLS_ctx.activeUser) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pick-screen" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pick-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pick-logo" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pick-buttons" },
    });
    for (const [u] of __VLS_getVForSourceType((__VLS_ctx.users))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.activeUser))
                        return;
                    __VLS_ctx.selectUser(u);
                } },
            key: (u.id),
            ...{ class: "pick-btn" },
            ...{ style: ({ '--accent': u.color }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "pick-avatar" },
        });
        (u.name.charAt(0));
        (u.name);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-layout" },
    });
    /** @type {[typeof ChatWindow, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(ChatWindow, new ChatWindow({
        userId: (__VLS_ctx.activeUser.id),
        userName: (__VLS_ctx.activeUser.name),
        accentColor: (__VLS_ctx.activeUser.color),
    }));
    const __VLS_1 = __VLS_0({
        userId: (__VLS_ctx.activeUser.id),
        userName: (__VLS_ctx.activeUser.name),
        accentColor: (__VLS_ctx.activeUser.color),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
/** @type {__VLS_StyleScopedClasses['pick-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pick-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-layout']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChatWindow: ChatWindow,
            users: users,
            activeUser: activeUser,
            selectUser: selectUser,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
