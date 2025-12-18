# План: Header-дегі User Menu (Логинден кейін)

## 1. Жалпы идея

**Қазір:**
- Header-де: "Register Now" және "Log in" батырмалары

**Логиннен кейін:**
- Header-де: Пайдаланушы аты/аватары + Dropdown меню (Профиль, Шығу)

---

## 2. Компонент құрылымы

### Вариант 1: Бөлек компонент (Ұсынылатын)
```
src/components/common/UserMenu.vue
```

**Не бар:**
- Аватар (круглый) + пайдаланушы аты
- Dropdown меню (клик кезінде ашылады)
  - "Профиль" → `/profile/:id`
  - "Шығу" → logout функциясы

**Преимущества:**
- Код таза
- Қайта пайдалануға ыңғайлы
- Header компоненті тазарақ

### Вариант 2: Header ішінде (inline)
- Header.vue ішінде `v-if`/`v-else` қолдану
- Код ұзақ, бірақ бір файлда

---

## 3. Дизайн (Desktop)

**Егер логин жасалмаған:**
```
[Register Now] [Log in]
```

**Егер логин жасалған:**
```
[👤 Асхат Н.]  ← клик кезінде dropdown ашылады
                ├─ Профиль
                └─ Шығу
```

**Dropdown дизайн:**
- Ақ фон
- Төменге shadow
- 2 пункт: "Профиль" және "Шығу"
- Hover эффектісі

---

## 4. Дизайн (Mobile)

**Егер логин жасалмаған:**
```
[Register Now]
[Log in]
```

**Егер логин жасалған:**
```
[👤 Асхат Н.]
[Профиль]
[Шығу]
```

---

## 5. Header.vue өзгерістері

### Desktop (header-actions блок):
```vue
<div class="header-actions">
  <!-- Егер логин жасалмаған -->
  <template v-if="!authStore.isAuthenticated">
    <RouterLink to="/register" class="register-btn">Register Now</RouterLink>
    <RouterLink to="/login" class="login-link">Log in</RouterLink>
  </template>
  
  <!-- Егер логин жасалған -->
  <UserMenu v-else />
</div>
```

### Mobile (mobile-nav ішінде):
```vue
<template v-if="!authStore.isAuthenticated">
  <RouterLink to="/register" class="mobile-register-btn">Register Now</RouterLink>
  <RouterLink to="/login" class="mobile-login-link">Log in</RouterLink>
</template>

<template v-else>
  <div class="user-info-mobile">
    <span>👤 {{ authStore.user.name }}</span>
  </div>
  <RouterLink to="/profile" class="mobile-link">Профиль</RouterLink>
  <button @click="handleLogout" class="mobile-link">Шығу</button>
</template>
```

---

## 6. UserMenu.vue компоненті (Вариант 1)

**Template:**
```vue
<template>
  <div class="user-menu" ref="userMenuRef">
    <!-- Аватар + аты (клик кезінде dropdown ашылады) -->
    <button @click="toggleDropdown" class="user-trigger">
      <img :src="userAvatar" class="user-avatar" alt="Avatar" />
      <span class="user-name">{{ userName }}</span>
      <svg class="dropdown-arrow" ...>...</svg>
    </button>
    
    <!-- Dropdown меню -->
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <RouterLink to="/profile" @click="closeDropdown" class="dropdown-item">
        Профиль
      </RouterLink>
      <button @click="handleLogout" class="dropdown-item logout-btn">
        Шығу
      </button>
    </div>
  </div>
</template>
```

**Script:**
```javascript
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()
const isDropdownOpen = ref(false)
const userMenuRef = ref(null)

const userName = computed(() => {
  return authStore.user?.name || authStore.user?.username || 'User'
})

const userAvatar = computed(() => {
  return authStore.user?.avatar || '/default-avatar.png'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  closeDropdown()
}

// Dropdown-ды сыртта басқанда жабу
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
      closeDropdown()
    }
  })
})
```

---

## 7. Стильдер (UserMenu.vue)

**Desktop:**
- `.user-trigger`: flex, align-items: center, gap: 0.5rem
- `.user-avatar`: круглый, 36px × 36px
- `.dropdown-menu`: position: absolute, top: 100%, right: 0, white background, shadow
- `.dropdown-item`: padding, hover эффектісі
- `.logout-btn`: қызыл түс

**Mobile:**
- Mobile-де dropdown емес, тікелей пункттер көрсетіледі (Header.vue ішінде)

---

## 8. Auth Store қолдану

**Header.vue-де:**
```javascript
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)
```

---

## 9. LoginPage/RegisterPage-да логиннен кейін

**Логиннен кейін:**
```javascript
// LoginPage.vue ішінде
const handleLogin = async () => {
  // API шақыру
  const response = await fetch('/api/auth/login', { ... })
  const data = await response.json()
  
  // Store-ға сақтау
  authStore.login(data.user, data.token)
  
  // Бетке өту
  router.push('/')
}
```

---

## 10. Логиннен кейінгі беттер

**Профиль беті:**
- `/profile` - өз профилі
- `/profile/:id` - басқа пайдаланушының профилі

**Header-дегі UserMenu:**
- "Профиль" → `/profile` (өз профилі)
- "Шығу" → authStore.logout() + `/` бетіне өту

---

## 11. Түйінді қадамдар

### 1-ші қадам: UserMenu компонентін құру
- `src/components/common/UserMenu.vue`
- Аватар + аты + dropdown

### 2-ші қадам: Header.vue-ді өзгерту
- `v-if`/`v-else` қолдану
- UserMenu-ді импорттау
- Auth store қосылу

### 3-ші қадам: LoginPage/RegisterPage-да store-ға сақтау
- Логиннен кейін `authStore.login()` шақыру
- Регистрациядан кейін де логин ету

### 4-ші қадам: Logout функциясын қосу
- UserMenu-де "Шығу" батырмасы
- `authStore.logout()` шақыру
- `/` бетіне өту

### 5-ші қадам: Mobile версиясы
- Mobile-де dropdown емес, тікелей пункттер
- Header.vue ішінде `v-if`/`v-else`

---

## 12. Қорытынды

**Не қосылады:**
1. `UserMenu.vue` компоненті (бөлек)
2. Header.vue-де `v-if`/`v-else` логикасы
3. Auth store-ды Header-де қолдану
4. LoginPage/RegisterPage-да store-ға сақтау
5. Logout функциясы

**Дизайн:**
- Desktop: Аватар + аты + dropdown меню
- Mobile: Аватар + аты + тікелей пункттер

**Барлығы дайын болғанда:**
- Логиннен кейін Header-де "Register Now" / "Log in" жоғалуы
- Олардың орнына UserMenu пайда болуы
- "Шығу" батырмасы арқылы logout істеу



