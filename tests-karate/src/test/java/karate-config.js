function fn() {
  var env = karate.env; // pobierz środowisko (opcjonalne)
  
  var config = {
    // Adres API Gateway (dla testów API)
    apiBaseUrl: 'http://localhost:3000',
    
    // Adres Frontendu (dla testów UI)
    uiBaseUrl: 'http://localhost:80'
  };

  // Konfiguracja timeoutów
  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);

  return config;
}