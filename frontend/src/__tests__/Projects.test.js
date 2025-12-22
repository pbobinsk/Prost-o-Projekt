// frontend/src/__tests__/Projects.test.js

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Projects from '../views/Projects.vue';
import { useAuthStore } from '../stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

// Mockujemy globalnie cały moduł 'axios'
vi.mock('axios', () => ({
  // Domyślnie eksportujemy obiekt z mockowanymi funkcjami
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

// Import axios MUSI być PO vi.mock
import axios from 'axios';

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/projects', component: Projects }, { path: '/login', component: { template: '<div>Login</div>' } }],
});


describe('Projects.vue', () => {

  // Przygotowujemy dane testowe
  const mockProjects = [
    { id: 1, title: 'Projekt Alfa', description: 'Opis Alfa' },
    { id: 2, title: 'Projekt Beta', description: 'Opis Beta' },
  ];

  // Resetujemy mocki przed każdym testem
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays a list of projects on mount', async () => {
    // Arrange
    // Symulujemy, że axios.get zwróci naszą listę projektów
    axios.get.mockResolvedValue({ data: mockProjects });

    const wrapper = mount(Projects, {
      global: {
        // Symulujemy zalogowanego użytkownika
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: { token: 'fake-token', user: { email: 'test@user.com' } }
          }
        }),router],
      }
    });
    
    // Act
    // Poczekaj na zakończenie onMounted i re-render komponentu
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); // Czasami potrzeba dwóch 'ticków'

    // Assert
    expect(axios.get).toHaveBeenCalledWith('/api/projects');
    const projectTitles = wrapper.findAll('h3');
    expect(projectTitles).toHaveLength(mockProjects.length + 1); // +1 za tytuł formularza
    expect(projectTitles[1].text()).toBe('Projekt Alfa');
    expect(wrapper.text()).toContain('Opis Beta');
  });

  it('calls the logout action when logout button is clicked', async () => {
    const wrapper = mount(Projects, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }),router],
      }
    });

    // Musimy zasymulować istnienie routera
    const pushSpy = vi.spyOn(router, 'push');
    const authStore = useAuthStore();
    
    // Act
    await wrapper.find('button.secondary').trigger('click');

    // Assert
    expect(authStore.logout).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith('/login');
  });
});