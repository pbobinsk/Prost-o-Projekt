package com.prostoprojekt;

import com.intuit.karate.junit5.Karate;

class KarateRunner {

    // Uruchom wszystkie testy API
    @Karate.Test
    Karate testApi() {
        return Karate.run("api/api-gateway").relativeTo(getClass());
    }

    // Uruchom testy UI (wymaga zainstalowanego Chrome)
    @Karate.Test
    Karate testUi() {
        return Karate.run("ui/ui-critical-path").relativeTo(getClass());
    }
    
    // Lub uruchom wszystko naraz
    // @Karate.Test
    // Karate testAll() {
    //    return Karate.run().relativeTo(getClass());
    // }
}