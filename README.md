# Prost-o-Projekt: Ewolucja Aplikacji Webowej

To repozytorium jest materiałem dydaktycznym pokazującym ewolucję aplikacji od monolitu MVC do architektury mikroserwisów z frontendem SPA.

## Struktura Gałęzi

Każda faza ewolucji projektu znajduje się na osobnej, niezależnej gałęzi. Aby przeanalizować kod dla konkretnego etapu, należy przełączyć się na odpowiednią gałąź.

---

### ➡️ Faza 1: `phase-1-monolith`

**Cel:** Zbudowanie klasycznej aplikacji monolitycznej w architekturze MVC.

*   **Opis:**
    W tej fazie stworzyliśmy w pełni funkcjonalną, samodzielną aplikację do zarządzania projektami. Cały kod (backend i frontend) znajduje się w jednej bazie kodu i jest wdrażany jako pojedyncza jednostka. To doskonały przykład na start dla wielu projektów: prosty w rozwoju i wdrożeniu.

*   **Architektura:**
    *   **Wzorzec:** Model-View-Controller (MVC)
    *   **Backend:** Node.js + Express.js
    *   **Frontend:** Widoki renderowane po stronie serwera (SSR) za pomocą szablonów EJS.
    *   **Baza Danych:** PostgreSQL (jedna, współdzielona baza).
    *   **ORM:** Sequelize

*   **Jak uruchomić?**
    1.  Upewnij się, że masz zainstalowany Docker i Docker Compose.
    2.  Przełącz się na tę gałąź: `git checkout phase-1-monolith`
    3.  Uruchom środowisko: `docker-compose up --build`
    4.  Otwórz w przeglądarce: `http://localhost:3000`

---

### ➡️ Faza 2: `phase-2-microservices`

**Cel:** Migracja architektury z monolitu do mikroserwisów.

*   **Opis:**
    W odpowiedzi na rosnące wymagania (hipotetyczne), dekomponujemy nasz monolit na mniejsze, niezależne usługi. Wprowadzamy kluczowe wzorce dla systemów rozproszonych, takie jak API Gateway i strategia migracji "Dusiciela Figi".

---

### ➡️ Faza 3: `phase-3-api-first`

**Cel:** Wprowadzenie podejścia API-First w celu profesjonalizacji komunikacji.

*   **Opis:**
    Formalizujemy komunikację między naszymi nowymi mikroserwisami za pomocą specyfikacji OpenAPI (Swagger). Umożliwia to automatyczne generowanie dokumentacji, walidację i pracę równoległą.

---

### ➡️ Faza 4: `phase-4-spa-frontend`

**Cel:** Stworzenie nowoczesnego, oddzielonego frontendu jako Single Page Application.

*   **Opis:**
    Budujemy od zera nowy interfejs użytkownika w technologii Vue.js. Aplikacja frontendowa jest całkowicie oddzielona od backendu i komunikuje się z nim wyłącznie przez API. Pokazuje to pełną elastyczność i moc współczesnych architektur webowych.