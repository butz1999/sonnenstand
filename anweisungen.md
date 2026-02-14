# Sonnenstandsdiagramm auf Webseite

## Anforderungen

Ich möchte eine statische HTML Seite mit einem Sonnenstandsdiagramm generieren, welche ich in final meinem Home-Asssistant (HA) in einem Webview einfügen kann. Es soll ohne Webserver lokal im Browser funktionieren. Ich möchte erst einmal eine Zwischenlösung, welche ich im irgend einem Browser anschauen und das Resultat kontrollieren kann. Das Sonnenstandsdiagramm zeigt mit feinen Linien die Sonnenstandsverlauf aus einer Liste von Daten. Normalerweise werden zu den Solistien auch noch Tag- und Nachgleiche dargestellt. Ausserdem soll in der Grafik die Sonne als farbiger Punkt dargestellt werden, welcher über die Grafik streift. Aus Performance Gründen reicht eine Aktualisierungsrate von 15s.

### Foldende Anforderungen habe ich an Code und deine Ausführung
* Den aktuellen Standort als String im Format "47.251738, 8.765695"
* Die aktuelle Zeit soll automatisch ermittelt werden.
* Den aktuellen Sonnenstand zum Standort soll farbig eingetragen werden.
* Die Beschriftung des Diagramms ist wie auf https://de.wikipedia.org/wiki/Sonnenstandsdiagramm zu wählen. Hiesst:
  * x-Achse: Azimut in [°]
  * y-Achse: Elevation in [°]
  * Sinnvolle feine Linien als Achsen Intervall
  * Optional sollen die Stundenschleifen dargestellt werden (Siehe auch hier: https://de.wikipedia.org/wiki/Sonnenstandsdiagramm#/media/Datei:Sonnenstandsdiagramm_Wien.png)
  * Das Diagramm soll ein festes, durch Konstanten definierbares Seitenverhältnis haben, so dass es auf grossen und kleinen Bildschirmen hübsch skaliert
  * Die Webseite soll immer vollstänig im Browserfenster sichtbar sein.
* Sämtliche grafischen Elemente sollen mit sinnvollen Variablen definiert werden, damit die Darstellung später manuell angepasst werden kann.

### Zur grafischen Darstellung habe ich folgende zusätzlichen anforderungen
* Die Webseite hat vier Bereiche:
  * Titelbereich
    * Titel linksbündig
    * Zahnrad Symbol rechtsbündig
  * Datenzeile
  * Testbereich
  * Grafik
  * Legende

### Zum Testbereich habe ich folgende zusätzlichen Anforderungen:
* Neben dem Titel gibt es ein Zahnrad-Symbol, welches einen Testbereich aufklappen lässt.
* Wenn der Testbereich aufgeklappt wird, wird auch der Test-Mode aktiviert
* Als Testfunktionalität gibt es:
  * Simulation der Tageszeit von 00:00 bis 23:59 mit einem Slider.
  * Simulation des Tages im aktuellen Jahr von 1 bis 365
  * Simulation mit einer Funktionalität der Auswahl eines alternativen Standortes. Der alternative Standort soll aus einer statischen Liste mit 5 Orten in Europa und je einem Ort auf nicht europäischen Kontinenten beinhalten. Die Standortauswahl soll im Klartext sein und bei dessen Auswahl in geografische Koordinaten umgerechnet wird.
* Wenn der Testbereich zugeklappt wird, soll wieder die aktuelle Tageszeit für die Darstellung der Sonne verwendet werden.