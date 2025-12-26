Feature: Krytyczna ścieżka UI (E2E)

  Background:
    # Konfiguracja sterownika (używamy Chrome)
    * configure driver = { type: 'chrome', showDriverLog: true }
    # Generujemy dane
    * def uniqueId = java.lang.System.currentTimeMillis()
    * def userEmail = 'ui-user-' + uniqueId + '@test.com'
    * def userPassword = 'password123'

  Scenario: Użytkownik rejestruje się, loguje i zarządza projektem
    
    # 1. Otwórz aplikację
    Given driver uiBaseUrl
    # Czekaj na załadowanie
    And waitFor('h2') 

    # 2. Przejdź do rejestracji
    # Karate szuka linku z tekstem
    And click('{a}Zarejestruj się')
    And waitForUrl('/register')
    
    # 3. Wypełnij formularz rejestracji
    # Używamy selektorów CSS
    And input('input[type=email]', userEmail)
    And input('input[type=password]', userPassword)
    And click('button[type=submit]')
    
    # 4. Weryfikacja sukcesu poprzez URL
    # Zamiast szukać znikającego napisu, czekamy aż aplikacja
    # sama przekieruje nas na stronę logowania.
    # To potwierdza, że rejestracja się udała (bo tylko wtedy następuje redirect).
    And waitForUrl('/login')

    # 5. Logowanie
    # Jesteśmy już na stronie /login, więc od razu wpisujemy dane
    And input('input[type=email]', userEmail)
    And input('input[type=password]', userPassword)
    And click('button[type=submit]')

    # 6. Weryfikacja strony projektów
    And waitForUrl('/projects')
    And match text('h2') contains 'Twoje Projekty'

    # 7. Dodaj nowy projekt
    And input('input#title', 'Projekt UI Karate')
    And input('textarea#description', 'Klikane przez robota')
    And click('{button}Dodaj projekt')

    # 8. Sprawdź, czy projekt się pojawił
    # Czekamy na pojawienie się tekstu w DOM
    And waitFor('{h3}Projekt UI Karate')
    And match text('body') contains 'Klikane przez robota'

    # 9. Wyloguj
    And click('{button}Wyloguj')
    And waitForUrl('/login')