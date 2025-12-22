// frontend/src/__tests__/Register.test.js

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '../stores/auth';
import Register from '../views/Register.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/register', component: Register }],
});

describe('Register.vue', () => {
  
  // Funkcja pomocnicza do tworzenia wrapper'a
  const createWrapper = () => {
    return mount(Register, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }),
            router
        ],
      }
    });
  };

  it('renders the registration form correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('h2').text()).toBe('Rejestracja');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Zarejestruj');
  });

  it('calls the register action on form submission', async () => {
    const wrapper = createWrapper();
    const authStore = useAuthStore();

    // Symulujemy wpisanie danych
    await wrapper.find('input[type="email"]').setValue('newuser@example.com');
    await wrapper.find('input[type="password"]').setValue('newpassword123');

    // Symulujemy wysłanie formularza
    await wrapper.find('form').trigger('submit.prevent');

    // Sprawdzamy, czy akcja 'register' została wywołana
    expect(authStore.register).toHaveBeenCalledTimes(1);
    expect(authStore.register).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'newpassword123'
    });
  });

  it('displays a success message on successful registration', async () => {
    const wrapper = createWrapper();
    const authStore = useAuthStore();

    // Symulujemy, że akcja 'register' zakończyła się sukcesem
    authStore.register.mockResolvedValue();

    await wrapper.find('form').trigger('submit.prevent');
    
    // Czekamy na aktualizację DOM po asynchronicznej akcji
    await wrapper.vm.$nextTick(); 

    expect(wrapper.find('p.success').exists()).toBe(true);
    expect(wrapper.find('p.success').text()).toContain('Rejestracja pomyślna');
  });
});