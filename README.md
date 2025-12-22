# Prost-o-Projekt: Ewolucja Aplikacji Webowej

To repozytorium jest materiałem dydaktycznym pokazującym ewolucję aplikacji od monolitu MVC do architektury mikroserwisów z frontendem SPA.

## Struktura Gałęzi

Każda faza ewolucji projektu znajduje się na osobnej, niezależnej gałęzi. Aby przeanalizować kod dla konkretnego etapu, należy przełączyć się na odpowiednią gałąź.

---

### ✅ Faza 1: `phase-1-monolith`

**Cel:** Zbudowanie klasycznej aplikacji monolitycznej w architekturze MVC.

*   **Opis:**
    W tej fazie stworzyliśmy w pełni funkcjonalną, samodzielną aplikację do zarządzania projektami. Cały kod (backend i frontend) znajduje się w jednej bazie kodu i jest wdrażany jako pojedyncza jednostka. To doskonały przykład na start dla wielu projektów: prosty w rozwoju i wdrożeniu.
*   **Architektura:** Node.js (Express) + EJS (SSR) + PostgreSQL (Sequelize).
*   **Jak uruchomić?**
    1.  Przełącz się na gałąź: `git checkout phase-1-monolith`
    2.  Uruchom środowisko: `docker-compose up --build`
    3.  Otwórz w przeglądarce: `http://localhost:3000`

---

### ➡️ Faza 2: `phase-2-microservices`

**Cel:** Migracja architektury z monolitu do mikroserwisów.

*   **Opis:**
    W odpowiedzi na rosnące wymagania, zdekomponowaliśmy nasz monolit. Zastosowaliśmy strategię **"Dusiciela Figi"**, wprowadzając **API Gateway** jako nowy punkt wejścia. Istniejąca funkcjonalność projektów została wydzielona do osobnego mikroserwisu w Node.js (`project-service`). Jednocześnie, aby pokazać elastyczność technologiczną, dodaliśmy zupełnie nowy mikroserwis do obsługi użytkowników w Pythonie (`user-service`).

*   **Architektura:**
    *   **Brama API:** `api-gateway` (Node.js + Express)
    *   **Mikroserwisy:**
        *   `project-service` (Node.js + Express + PostgreSQL) - wydzielony z monolitu.
        *   `user-service` (Python + FastAPI) - nowa funkcjonalność.
    *   **Relikt:** `legacy-monolith` (obsługuje już tylko stronę główną).

*   **Jak uruchomić i testować?**
    1.  Przełącz się na tę gałąź: `git checkout phase-2-microservices`
    2.  Uruchom środowisko: `docker-compose up --build`
    3.  **Testuj API w przeglądarce lub kliencie API (np. Postman):**
        *   **Serwis projektów:** `http://localhost:3000/api/projects`
        *   **Serwis użytkowników:** `http://localhost:3000/api/users`
    4.  **Sprawdź stary monolit:** `http://localhost:3000/` (Strona główna nadal działa, ale link do projektów zwróci błąd 404 - to jest **oczekiwane zachowanie**!).

---

### ➡️ Faza 3: `phase-3-api-first`

**Cel:** Wprowadzenie podejścia API-First, uwierzytelniania oraz komunikacji asynchronicznej.

*   **Opis:**
    To kluczowa faza profesjonalizacji naszego systemu. Sformalizowaliśmy komunikację między serwisami za pomocą kontraktów **OpenAPI**. Rozbudowaliśmy `user-service` (Python) o logikę rejestracji/logowania z użyciem **MongoDB** i tokenów **JWT**. `API Gateway` stała się "strażnikiem", zabezpieczającym dostęp do chronionych zasobów (`project-service`). Wprowadziliśmy również **komunikację asynchroniczną** z użyciem brokera wiadomości **RabbitMQ**, aby odciążyć proces rejestracji od zadań takich jak wysyłka powiadomień.

*   **Architektura:**
    *   **Nowe technologie:** MongoDB, RabbitMQ, JWT, OpenAPI.
    *   **Serwisy:**
        *   `api-gateway` (z logiką walidacji JWT).
        *   `user-service` (z bazą MongoDB, logiką JWT, producent wiadomości RabbitMQ).
        *   `project-service` (zabezpieczony, z logiką autoryzacji `ownerId`).
        *   `notification-service` (opcja Java/Spring Boot, konsument wiadomości RabbitMQ).

*   **Jak uruchomić i testować?**
    1.  Przełącz się na tę gałąź: `git checkout phase-3-api-first`
    2.  Uruchom środowisko: `docker-compose up --build`
    3.  **Testuj w kliencie API (np. Postman):**
        *   **Zarejestruj się:** `POST /api/auth/register`
        *   **Zaloguj się i pobierz token:** `POST /api/auth/login`
        *   **Użyj tokenu (Bearer Token)** do dostępu do chronionych ścieżek, np. `GET /api/projects`.

---

### ➡️ Faza 4: `phase-4-spa-frontend`

**Cel:** Stworzenie nowoczesnego, oddzielonego frontendu jako Single Page Application.

*   **Opis:**
    W tej fazie zbudowaliśmy od zera interfejs użytkownika jako **Single Page Application (SPA)**. Aplikacja frontendowa jest całkowicie oddzielona od backendu i komunikuje się z nim wyłącznie przez API Gateway. Wykorzystaliśmy nowoczesny stos technologiczny oparty na **Vue.js** (z Composition API) i **Vite**. Aplikacja obsługuje pełny cykl życia użytkownika: rejestrację, logowanie, zarządzanie sesją (token JWT), a także pełną funkcjonalność **CRUD** (Create, Read, Update, Delete) dla projektów. Routing po stronie klienta jest obsługiwany przez **Vue Router**, a globalne zarządzanie stanem (token, dane użytkownika) przez **Pinia**. W środowisku produkcyjnym, zbudowana aplikacja jest serwowana jako zbiór statycznych plików przez wydajny serwer **Nginx**, który działa również jako **reverse proxy** do naszego backendowego API.

*   **Architektura Frontendu:**
    *   **Framework:** Vue.js 3
    *   **Narzędzia:** Vite
    *   **Routing:** Vue Router
    *   **Zarządzanie Stanem:** Pinia
    *   **Serwer:** Nginx

*   **Jak uruchomić?**
    1.  Przełącz się na tę gałąź: `git checkout phase-4-spa-frontend`
    2.  Uruchom całe środowisko (backend + frontend): `docker-compose up --build`
    3.  Otwórz w przeglądarce: **http://localhost** (bez podawania portu).

### ➡️ Faza 5: `phase-5-testing`

**Cel:** Zaimplementowanie kompleksowej strategii testowania dla całego systemu.

#### **Część A: Testy Jednostkowe i Integracyjne (Wewnętrzna Jakość)**

*   **Opis:**
    W tej części skupiliśmy się na zapewnieniu wewnętrznej jakości każdego serwisu i frontendu. Dla każdego komponentu naszego systemu stworzyliśmy dedykowany zestaw testów, uruchamiany w izolowanym środowisku kontenerowym. Używaliśmy narzędzi specyficznych dla danej technologii, aby przetestować zarówno małe fragmenty logiki (testy jednostkowe), jak i współpracę komponentów wewnątrz serwisu (testy integracyjne).

*   **Zaimplementowane Testy:**
    *   **`notification-service` (Java):** Testy jednostkowe i integracyjne z użyciem **JUnit 5** i **Mockito**, sprawdzające logikę listenera RabbitMQ.
    *   **`user-service` (Python):** Testy jednostkowe dla logiki bezpieczeństwa oraz testy integracyjne dla endpointów API z użyciem **PyTest** i **HTTPX**, weryfikujące współpracę z bazą danych MongoDB.
    *   **`project-service` (Node.js):** Testy jednostkowe dla modelu danych oraz testy integracyjne dla API REST z użyciem **Jest** i **Supertest**, weryfikujące logikę autoryzacji i współpracę z bazą PostgreSQL.
    *   **`frontend` (Vue.js):** Testy komponentów z użyciem **Vitest** i **Vue Test Utils**, sprawdzające poprawne renderowanie i logikę wewnętrzną widoków.

*   **Jak uruchomić testy?**
    1.  Przełącz się na tę gałąź: `git checkout phase-5-testing`
    2.  Użyj dedykowanego pliku `docker-compose.test.yml`, aby uruchomić testy dla wybranego serwisu (lub wszystkich naraz):
        *   `docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit` (uruchamia wszystkie testy)
        *   `docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit <nazwa-serwisu-testowego>` (uruchamia testy dla jednego serwisu, np. `frontend-tests`)
