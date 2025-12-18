<template>
  <div class="user-menu" ref="menuRef">
    <button class="user-trigger" @click="toggleDropdown" aria-haspopup="true">
      <span class="user-name">{{ displayName }}</span>
      <svg
        class="chevron"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <transition name="dropdown-slide">
      <div
        v-if="isDropdownOpen"
        class="dropdown"
        role="menu"
        @click.stop
      >
        <RouterLink
          to="/profile"
          class="dropdown-item"
          @click="closeDropdown"
        >
          Profile
        </RouterLink>
        <button class="dropdown-item logout" @click="handleLogout">
          Log out
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

const isDropdownOpen = ref(false)
const menuRef = ref(null)

const displayName = computed(() => {
  const fullName =
    authStore.user?.expertProfile?.fullName ||
    authStore.user?.expertProfile?.full_name

  const name =
    fullName ||
    authStore.user?.name ||
    [authStore.user?.firstName, authStore.user?.lastName]
      .filter(Boolean)
      .join(' ')

  return (
    name ||
    authStore.user?.username ||
    authStore.user?.email ||
    'Profile'
  )
})

const userRole = computed(() => authStore.user?.role || 'Пайдаланушы')

const userInitials = computed(() => {
  const fullName =
    authStore.user?.expertProfile?.fullName ||
    authStore.user?.expertProfile?.full_name ||
    authStore.user?.name

  const split = fullName ? fullName.split(' ').filter(Boolean) : []

  const first =
    split[0]?.[0] ||
    authStore.user?.firstName?.[0] ||
    authStore.user?.username?.[0] ||
    authStore.user?.email?.[0] ||
    'U'
  const last =
    split[1]?.[0] ||
    authStore.user?.lastName?.[0] ||
    ''

  return `${first}${last}`.toUpperCase()
})

const userAvatar = computed(() => authStore.user?.avatar || null)

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

const handleClickOutside = (event) => {
  if (!menuRef.value) return
  if (!menuRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.user-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: color 0.2s ease;
}

.user-trigger::after {
  content: '';
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.35rem;
  height: 2px;
  background: #10b981;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.40s ease;
}

.user-trigger:hover::after,
.user-trigger:focus-visible::after,
.user-trigger:active::after {
  transform: scaleX(1);
}

.user-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  line-height: 1.1;
}

.chevron {
  color: #6b7280;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.35rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
  padding: 0.5rem;
  min-width: 180px;
  border: none;
  z-index: 200;
}

.dropdown-item {
  width: 100%;
  text-align: left;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1f2937;
  background: transparent;
  border: none;
  cursor: pointer;
  display: block;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background: #f0fdf4;
  color: #047857;
}

.dropdown-item.logout {
  color: #b91c1c;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #991b1b;
}

.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.16s ease;
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>



