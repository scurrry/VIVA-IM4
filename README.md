# VIVA – Die Angebotsplattform für Menschen ab 50

## Idee & Entstehung

Wir haben uns zu Beginn überlegt, welche Bedürfnisse und Nutzungsgewohnheiten eine Zielgruppe **Ü50** bei digitalen Angeboten hat. Interviews und Beobachtungen zeigten:

- Diese Zielgruppe nutzt weniger Apps zur Unterhaltung, sondern mehr für praktische Zwecke (z. B. TWINT, News, Wetter).
- Sie wünschen sich **klare, reduzierte Oberflächen** und **übersichtliche Inhalte**.
- Sie fühlen sich schnell überfordert von zu vielen Auswahlmöglichkeiten.

> Unsere Lösung: Eine webbasierte App mit **persönlich kuratierten Angeboten** aus den Bereichen Restaurant, Bars, Wellness und Kultur – übersichtlich, klar und ohne Überladung.

---

## Features

- Registrierung & Login mit persönlichem Benutzerkonto
- Dynamisch geladene Angebote aus Datenbank
- Filterung nach vier Kategorien
- Favoriten speichern & verwalten
- Verlinkung zu externen Angebotsseiten ("Zum Angebot")

---

## Hosting & Infrastruktur

- **Webhost:** Infomaniak  
  - Gute Dokumentation
  - Einfaches SFTP-Handling mit VS Code
  - Integration von MySQL via phpMyAdmin
- **Deployment:** Visual Studio Code + `sftp.json`
- **Versionskontrolle:** Git & GitHub

---

## Was gut lief

- Aufbau der Dateistruktur (HTML, CSS, JS)
- Datenbankverbindung zwischen `phpMyAdmin` und der Webanwendung
- Anzeigen von Angeboten aus der Datenbank
- Interaktive Funktionen wie Filterung und Favoriten
- Teamarbeit & Aufgabenverteilung funktionierten gut

---

## Herausforderungen

- **Login & Logout-Logik**:  
  - Das Login-Popup verschwand nach Login nicht korrekt  
  - Sessions gingen beim Seitenwechsel verloren  
  - Unterschiedliche JS-Files und Session-Handling in PHP mussten exakt aufeinander abgestimmt werden

- **Projektstruktur**:  
  - Zu Beginn zu viele unsortierte Dateien  
  - Ordnerstruktur wurde überarbeitet (`api`, `css`, `js`, `system`, `bilder`, ...)

- **Verlorene Dateien**:  
  - `gespeichert.html` ging zwischendurch verloren und musste rekonstruiert werden

---

## Datenbankstruktur

### `users`

| Spalte     | Typ      |
|------------|----------|
| id         | INT, AUTO_INCREMENT |
| email      | VARCHAR  |
| password   | VARCHAR (verschlüsselt) |

### `locations`

| Spalte     | Typ      |
|------------|----------|
| id         | INT, AUTO_INCREMENT |
| name       | VARCHAR |
| category   | VARCHAR |
| address    | TEXT |
| description | TEXT |
| link       | TEXT (z. B. zur Webseite) |
| image1     | TEXT (Pfad) |
| image2     | TEXT |
| image3     | TEXT |

### `favorites`

| Spalte        | Typ      |
|---------------|----------|
| id            | INT, AUTO_INCREMENT |
| locations_id  | INT |
| users_id      | INT |
| created_at    | TIMESTAMP |

---

## Sicherheit & Datenschutz

- Passwörter werden mit `password_hash()` sicher verschlüsselt
- Sessions werden über PHP verwaltet (`$_SESSION`)
- API-Endpoints wie `protected.php` prüfen, ob ein Nutzer eingeloggt ist

---

## Team & Modul

> Dieses Projekt entstand im Rahmen des Moduls **Interactive Media 4 (IM4)** an der FHGR im Sommersemester 2025.  
> Entwickelt von Tanja Julmy & Laura Khoury

---

## Fazit

Wir konnten viel über **Datenbankintegration**, **User-Authentifizierung**, **Dateistrukturierung** und **modulares Frontend** lernen.  
Obwohl technische Hürden auftraten, haben wir die meisten Herausforderungen gemeinsam gelöst und eine funktionale, zielgruppengerechte Anwendung entwickelt.

