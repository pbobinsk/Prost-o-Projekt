package com.prostoprojekt

import com.intuit.karate.gatling.KarateProtocol
import com.intuit.karate.gatling.PreDef._
import io.gatling.core.Predef._
import io.gatling.core.scenario.Simulation

class LoadSimulation extends Simulation {

  // ZMIANA JEST TUTAJ:
  // karateProtocol() zostawiamy puste (domyślna konfiguracja)
  // lub konfigurujemy tu mapowanie URL -> pauza.
  // NIE podajemy tu ścieżki do pliku feature.
  val protocol: KarateProtocol = karateProtocol()

  // Tutaj definiujemy scenariusz i wskazujemy plik .feature
  val scn = scenario("Karate Load Test")
    .exec(karateFeature("classpath:com/prostoprojekt/api/api-gateway.feature"))

  // Konfiguracja obciążenia (10 użytkowników naraz)
  setUp(
    scn.inject(atOnceUsers(10))
  ).protocols(protocol)
}