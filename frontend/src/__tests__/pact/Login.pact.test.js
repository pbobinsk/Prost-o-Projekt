// frontend/src/__tests__/pact/Login.pact.test.js

import { describe, it, expect } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import axios from 'axios';

// Konfiguracja Providera (bez zmian)
const provider = new PactV3({
  consumer: 'ProstOProjekt-Frontend',
  provider: 'ProstOProjekt-UserService',
  port: 1234,
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Pact contract for User Service', () => {

  // === Scenariusz #1: Logowanie istniejącego użytkownika ===
  describe('when a user logs in successfully', () => {
    it('should return an access token', async () => {
      // Definicja interakcji
      provider
        .given('a user with email pact.user@example.com exists')
        .uponReceiving('a request to log in')
        .withRequest({
          method: 'POST',
          path: '/login',
          headers: { 'Content-Type': 'application/json' },
          body: {
            email: 'pact.user@example.com',
            password: 'a.secure.password',
          },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            access_token: MatchersV3.string(),
            token_type: 'bearer',
          },
        });

      // Uruchomienie testu
      await provider.executeTest(async (mockServer) => {
        const url = `${mockServer.url}/login`;
        const response = await axios.post(url, {
          email: 'pact.user@example.com',
          password: 'a.secure.password',
        }, { headers: { 'Content-Type': 'application/json' } });

        expect(response.status).toBe(200);
        expect(typeof response.data.access_token).toBe('string');
      });
    });
  });

  // ==========================================================
  // === NOWY SCENARIUSZ #2: Rejestracja nowego użytkownika ===
  // ==========================================================
  describe('when registering a new user', () => {
    
    it('should create a new user and return its data', async () => {
      const newUserCredentials = {
        email: 'new.pact.user@example.com',
        password: 'a.very.secure.password'
      };

      // Definicja interakcji
      provider
        .given('no user exists for new.pact.user@example.com') // Dajemy czytelny stan
        .uponReceiving('a request to register a new user')
        .withRequest({
          method: 'POST',
          path: '/register',
          headers: { 'Content-Type': 'application/json' },
          body: newUserCredentials,
        })
        .willRespondWith({
          status: 201,
          headers: { 'Content-Type': 'application/json' },
          body: {
            id: MatchersV3.regex('^[0-9a-fA-F]{24}$', '507f1f77bcf86cd799439011'),
            email: newUserCredentials.email,
          },
        });

      // Uruchomienie testu
      await provider.executeTest(async (mockServer) => {
        const url = `${mockServer.url}/register`;
        const response = await axios.post(url, newUserCredentials, {
          headers: { 'Content-Type': 'application/json' },
        });

        expect(response.status).toBe(201);
        expect(response.data.email).toBe(newUserCredentials.email);
      });
    });
  });
});