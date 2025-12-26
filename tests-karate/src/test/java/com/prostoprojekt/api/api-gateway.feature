Feature: Testowanie API Gateway i Mikroserwisów

  Background:
    # Ustawiamy URL bazowy z konfiguracji
    * url apiBaseUrl
    # Generujemy unikalny email dla każdego uruchomienia testu
    * def uniqueId = java.lang.System.currentTimeMillis()
    * def userEmail = 'karate-' + uniqueId + '@test.com'
    * def userPassword = 'password123'

  Scenario: Pełny przepływ API: Rejestracja -> Logowanie -> Projekty
    
    # 1. Rejestracja użytkownika (User Service)
    Given path '/api/auth/register'
    And request { email: '#(userEmail)', password: '#(userPassword)' }
    When method POST
    Then status 201
    And match response.email == userEmail
    And match response.id == '#string'

    # 2. Logowanie i pobranie tokenu (User Service)
    Given path '/api/auth/login'
    And request { email: '#(userEmail)', password: '#(userPassword)' }
    When method POST
    Then status 200
    And match response.access_token == '#string'
    # Zapisz token do zmiennej
    * def authToken = response.access_token

    # 3. Utworzenie projektu (Project Service - wymaga autoryzacji)
    Given path '/api/projects'
    And header Authorization = 'Bearer ' + authToken
    And request { title: 'Projekt Karate', description: 'Testowanie API przez Karate DSL' }
    When method POST
    Then status 201
    And match response.title == 'Projekt Karate'
    And match response.ownerId == '#string'
    * def projectId = response.id

    # 4. Pobranie listy projektów
    Given path '/api/projects'
    And header Authorization = 'Bearer ' + authToken
    When method GET
    Then status 200
    # Sprawdź, czy lista zawiera nasz projekt (używamy filtru JSONPath)
    And match response[*].id contains projectId

Scenario Outline: Rejestracja z nieprawidłowymi danymi
  Given path '/api/auth/register'
  And request { email: '<email>', password: '<haslo>' }
  When method POST
  Then match [400, 422] contains responseStatus

  Examples:
    | email             | haslo       |
    | zly-email         | pass123     |
    |                   | pass123     |
    | user@test.com     |             |