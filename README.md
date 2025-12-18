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

**Cel:** Wprowadzenie podejścia API-First oraz mechanizmu uwierzytelniania.

*   **Opis:**
    Formalizujemy komunikację między serwisami za pomocą kontraktów **OpenAPI**. Rozbudowujemy `user-service` o logikę rejestracji/logowania z użyciem tokenów **JWT**, a `api-gateway` staje się "strażnikiem", który zabezpiecza dostęp do chronionych zasobów.

---

### ➡️ Faza 4: `phase-4-spa-frontend`

**Cel:** Stworzenie nowoczesnego, oddzielonego frontendu jako Single Page Application.

*   **Opis:**
    Budujemy od zera nowy interfejs użytkownika w technologii **Vue.js**. Aplikacja frontendowa jest całkowicie oddzielona od backendu i komunikuje się z nim wyłącznie przez API, konsumując dane udostępniane przez nasze mikroserwisy.