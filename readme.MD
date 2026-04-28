# Answers

## 1. Database

### Level 1

```sql
SELECT COUNT(*) AS total_customers
FROM Customers
WHERE Country = 'Germany';
```

### Level 2

```sql
SELECT COUNT(*) AS "COUNT(CustomerID)", Country
FROM Customers
GROUP BY Country
HAVING COUNT(*) >= 5
ORDER BY COUNT(*) DESC;
```

### Level 3

```sql
SELECT
    c.CustomerName,
    COUNT(o.OrderID) AS OrderCount,
    MIN(o.OrderDate) AS FirstOrder,
    MAX(o.OrderDate) AS LastOrder
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderDate BETWEEN '1996-07-01' AND '1997-02-28'
GROUP BY c.CustomerName
HAVING COUNT(o.OrderID) >= 5
ORDER BY LastOrder DESC;
```

## 2. Typescript

### Level 1

**Title Case**

```typescript
function titleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
```

**Word Frequency**

```typescript
function wordFrequency(str: string): Record<string, number> {
  const words = str.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
  return words.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);
}

const result = wordFrequency("Four One two two three Three three four  four  four");
console.log(result);
```

### Level 2

```typescript
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

delay(3000).then(() => alert('runs after 3 seconds'));
```

### Level 2.5

```typescript
function fetchData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!url) {
        reject("URL is required");
      } else {
        resolve(`Data from ${url}`);
      }
    }, 1000);
  });
}

function processData(data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data) {
        reject("Data is required");
      } else {
        resolve(data.toUpperCase());
      }
    }, 1000);
  });
}

async function main() {
  try {
    const data = await fetchData("https://example.com");
    const processedData = await processData(data);
    console.log("Processed Data:", processedData);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
```

## 3. Real-time Chat

**Stack:** Vue 3 + TypeScript (Vite) · Node.js WebSocket server (`ws`) · Docker

---

### Live in Railway (not AWS):

Open `sentinel-test-production.up.railway.app`

---

### Run locally (development)

```bash
# Terminal 1 — start the WebSocket server
cd chat-app/server
npm install
npm run dev

# Terminal 2 — start the Vue dev server
cd chat-app/client
npm install
npm run dev
```

Open `http://localhost:5173` — both chat windows connect to the server on port 3000.

---

### Run with Docker

```bash
cd chat-app
docker compose up --build
```

Open `http://localhost:3000`

## 4. Vue.js

### 1. Explain Vue.js reactivity and common issues when tracking changes

Vue 3 uses a **Proxy-based reactivity system**. When you wrap an object with `reactive()` or a value with `ref()`, Vue intercepts every get/set through a JavaScript `Proxy`. When a property is read inside a component's render or a `computed`/`watch`, Vue records that dependency. When the property is later written, Vue notifies all recorded dependents and schedules a re-render.

```typescript
const state = reactive({ count: 0 })  // Proxy wraps the object
const double = computed(() => state.count * 2)  // tracks state.count

state.count++  // triggers double to recompute, component re-renders
```

**Common tracking issues:**

- **Destructuring loses reactivity** — pulling a primitive out of a reactive object breaks the Proxy link:
  ```typescript
  const { count } = reactive({ count: 0 })  // count is now a plain number, not reactive
  // Fix: use toRefs()
  const { count } = toRefs(reactive({ count: 0 }))
  ```
- **Replacing the whole reactive object** — reassigning the variable breaks the reference:
  ```typescript
  let state = reactive({ count: 0 })
  state = reactive({ count: 1 })  // old references no longer tracked
  // Fix: mutate properties, don't replace the object
  ```
- **Adding new properties to a plain object in Vue 2** — Vue 2 couldn't detect new keys added after creation (`Vue.set()` was needed). Vue 3 Proxy solves this completely.
- **Watching nested objects** — `watch()` is shallow by default; use `{ deep: true }` for nested structures.

---

### 2. Describe data flow between components in a Vue.js app

Vue follows a **one-way data flow**: data flows down through props, events bubble up.

```
Parent
  |  props (down)
Child
  |  $emit / events (up)
Parent
```

**Patterns:**


| Pattern                  | When to use                                  |
| ------------------------ | -------------------------------------------- |
| **Props / emit**         | Direct parent ↔ child communication          |
| `**v-model`**            | Two-way binding sugar (prop + emit combined) |
| `**provide` / `inject`** | Pass data deeply without prop drilling       |
| **Shared composable**    | Logic shared across unrelated components     |
| **Pinia / Vuex store**   | Global or cross-tree state                   |


A `provide`/`inject` example for avoiding prop drilling:

```typescript
// Grandparent
provide('theme', ref('dark'))

// Deeply nested child
const theme = inject('theme')
```

The key rule: **never mutate props directly inside a child** — emit an event and let the parent decide whether to update.

---

### 3. Common causes of memory leaks in Vue.js and how to fix them


| Cause                             | Problem                                                                                       | Fix                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Event listeners not removed**   | `addEventListener` on `window`/`document` in `onMounted` stays alive after component unmounts | Remove in `onUnmounted`             |
| **Timers not cleared**            | `setInterval` keeps running and holds a reference to the component                            | `clearInterval` in `onUnmounted`    |
| **WebSocket not closed**          | Connection stays open after navigation                                                        | Close in `onUnmounted`              |
| **Third-party library instances** | Charts, maps, etc. not destroyed                                                              | Call `.destroy()` in `onUnmounted`  |
| **Global event bus listeners**    | `emitter.on(...)` never cleaned up                                                            | `emitter.off(...)` in `onUnmounted` |


Example pattern:

```typescript
onMounted(() => {
  window.addEventListener('resize', onResize)
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  clearInterval(timer)
})
```

Vue 3's `watchEffect` and `watch` auto-cleanup when the component unmounts, so those are safe by default.

### 4. State management

I have used **Pinia** as the primary state management solution in Vue 3 projects. It is the officially recommended replacement for Vuex and integrates natively with the Composition API.

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const profile = ref<User | null>(null)
  async function fetchUser(id: string) {
    profile.value = await api.getUser(id)
  }
  return { profile, fetchUser }
})

// In a component
const userStore = useUserStore()
await userStore.fetchUser('123')
```

---

### 5. Pre-rendering vs Server-Side Rendering (SSR)

Both techniques solve the same problem — making the app deliver ready HTML to the browser instead of an empty `<div id="app">` — but they run at different times.


|                               | Pre-rendering (SSG)          | Server-Side Rendering (SSR)               |
| ----------------------------- | ---------------------------- | ----------------------------------------- |
| **When HTML is generated**    | At **build time** (once)     | At **request time** (every request)       |
| **Server needed at runtime?** | No — static files only       | Yes — Node.js server                      |
| **Data freshness**            | Stale until next build       | Always fresh                              |
| **Performance**               | Fastest — served from CDN    | Slightly slower (server work per request) |
| **Best for**                  | Marketing pages, docs, blogs | Dashboards, user-specific pages           |
| **Vue tooling**               | VitePress, `vite-ssg`        | Nuxt.js, `@vue/server-renderer`           |


## 5. Website Security Best Practices

1. Input validation and sanitization
2. Use HTTPS
3. Authentication and verification
4. CSRF protection
5. Keep dependencies up to date
6. Rate limiting and DDoS protection
7. Encrypt sensitive data

## 6. Website Performance Best Practices

1. Minimize and compress assets — bundle JS/CSS with Vite/Webpack, enable gzip/Brotli
2. Use a CDN to serve static assets closer to the user
3. Lazy load routes and components — only load what the current page needs
4. Optimize images — use WebP/AVIF, correct sizes, and `loading="lazy"`
5. Cache aggressively — HTTP cache headers, CDN caching, service workers
6. Reduce render-blocking resources — defer non-critical JS, inline critical CSS
7. Use HTTP/2 or HTTP/3 — multiplexing reduces latency for multiple requests
8. Debounce and throttle expensive event handlers (scroll, resize, input)
9. Database optimization — use indexes, avoid N+1 queries, paginate large datasets
10. Monitor Core Web Vitals (LCP, FID, CLS) with Lighthouse or Datadog

## 7. Golang

### Word Frequency

```go
package main

import (
	"fmt"
	"regexp"
	"strings"
)

func wordFrequency(s string) map[string]int {
	re := regexp.MustCompile(`[^\w\s]`)
	cleaned := re.ReplaceAllString(strings.ToLower(s), "")
	words := strings.Fields(cleaned)

	freq := make(map[string]int)
	for _, word := range words {
		freq[word]++
	}
	return freq
}

func main() {
	result := wordFrequency("Four, One two two three Three three four  four   four")
	for word, count := range result {
		fmt.Printf("%s => %d\n", word, count)
	}
}
```

## 8. Tools (Rate yourself 1 to 5)


| Tool               | Rating |
| ------------------ | ------ |
| Git                | 5      |
| Redis              | 4      |
| VSCode / JetBrains | 5      |
| Linux              | 4      |
| AWS — EC2          | 5      |
| AWS — Lambda       | 3      |
| AWS — RDS          | 4      |
| AWS — CloudWatch   | 3      |
| AWS — S3           | 5      |
| Unit Testing       | 5      |
| Kanban boards      | 5      |


