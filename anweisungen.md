# Sonnenstandsdiagramm auf Webseite

## Anforderungen

Ich möchte eine statische HTML Seite mit einem Sonnenstandsdiagramm generieren, welche ich in final meinem Home-Asssistant (HA) in einem Webview einfügen kann. Es soll ohne Webserver lokal im Browser funktionieren. Ich möchte erst einmal eine Zwischenlösung, welche ich im irgend einem Browser anschauen und das Resultat kontrollieren kann. Das Sonnenstandsdiagramm zeigt mit feinen Linien die Sonnenstandsverlauf aus einer Liste von Daten. Normalerweise werden zu den Solistien auch noch Tag- und Nachgleiche dargestellt. Ausserdem soll in der Grafik die Sonne als farbiger Punkt dargestellt werden, welcher über die Grafik streift. Aus Performance Gründen reicht eine Aktualisierungsrate von 15s.

Foldende Anforderungen habe ich an Code und deine Ausführung:
* Den aktuellen Standort als String im Format "47.251738, 8.765695"
* Die aktuelle Zeit soll automatisch ermittelt werden.
* Den aktuellen Sonnenstand zum Standort soll farbig eingetragen werden.
* Die Beschriftung des Diagramms ist wie auf https://de.wikipedia.org/wiki/Sonnenstandsdiagramm zu wählen. Hiesst:
  * x-Achse: Azimut in [°]
  * y-Achse: Elevation in [°]
  * Sinnvolle feine Linien als Achsen Intervall
  * Optional sollen die Stundenschleifen dargestellt werden (Siehe auch hier: https://de.wikipedia.org/wiki/Sonnenstandsdiagramm#/media/Datei:Sonnenstandsdiagramm_Wien.png)
  * Das Diagramm soll ein festes Seitenverhältnis haben, so dass es auf grossen und kleinen Bildschirmen hübsch skaliert
* Sämtliche grafischen Elemente sollen mit sinnvollen Variablen definiert werden, damit die Darstellung später manuell angepasst werden kann.