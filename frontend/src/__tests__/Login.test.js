// frontend/src/__tests__/Login.test.js

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Login from '../views/Login.vue';
import { useAuthStore } from '../stores/auth';
import { createRouter, createWebHistory } from 'vue-router'; 

// Nie potrzebujemy już globalnego vi.mock('vue-router')

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/login', component: Login }],
});

describe('Login.vue', () => {

  // Tworzymy wspólną funkcję do montowania komponentu, aby uniknąć powtarzania kodu
  const createWrapper = () => {
    return mount(Login, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }),
            router
        ],
        
      }
    });
  };

  it('renders a login form and all its elements', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('h2').text()).toBe('Logowanie');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    // Sprawdzamy teraz tekst wewnątrz atrapy 'a'
    expect(wrapper.find('a').text()).toContain('Zarejestruj się');
  });

  it('calls the login action when form is submitted', async () => {
    const wrapper = createWrapper();
    
    // Wstrzykujemy mock routera, aby móc zweryfikować jego wywołanie
    const router = {
      push: vi.fn()
    };
    wrapper.vm.router = router; // To jest uproszczone, lepsze byłoby przez provide/inject

    // Pobieramy instancję naszego store'u
    const authStore = useAuthStore(); // Potrzebny import: import { useAuthStore } from '../stores/auth';

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');

    // Teraz możemy sprawdzić, czy akcja `login` na naszym store została wywołana!
    expect(authStore.login).toHaveBeenCalledTimes(1);
    expect(authStore.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
