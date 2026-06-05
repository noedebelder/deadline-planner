# Projektdokumentation - Deadline Planner

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
   1. [Understand & Define](#31-understand--define)
   2. [Sketch](#32-sketch)
   3. [Decide](#33-decide)
   4. [Prototype](#34-prototype)
   5. [Validate](#35-validate)
4. [Erweiterungen](#4-erweiterungen)
   1. [Login & Registrierung mit Rollenverwaltung](#41-login--registrierung-mit-rollenverwaltung)
   2. [Admin-Panel – Benutzerverwaltung](#42-admin-panel--benutzerverwaltung)
   3. [Tagesplanung / Workload-Rechner](#43-tagesplanung--workload-rechner)
   4. [Modulübersicht](#44-modulübersicht)
   5. [Statistik-Dashboard](#45-statistik-dashboard)
   6. [Kalenderansicht](#46-kalenderansicht)
   7. [iCal-Export](#47-ical-export)
   8. [Status & Fortschritts-Tracking](#48-status--fortschritts-tracking)
   9. [Smarte Warnungen & Benachrichtigungen](#49-smarte-warnungen--benachrichtigungen)
   10. [Dark Mode](#410-dark-mode)
5. [Projektorganisation](#5-projektorganisation)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang](#7-anhang)

---

## 1. Ausgangslage

- **Problem:** Ein zentraler Problemraum im Alltag von Studierenden liegt im Umgang mit Deadlines und Abgaben. Viele Studierende haben Schwierigkeiten, den Überblick über verschiedene Fristen in unterschiedlichen Modulen zu behalten. Aufgaben werden teilweise zu spät begonnen oder sogar vergessen, was zu Stress und schlechteren Leistungen führt.

  Ein weiteres Problem besteht darin, dass Deadlines oft nur als fixe Termine wahrgenommen werden, ohne eine sinnvolle Planung der dafür benötigten Arbeitszeit. Studierende wissen zwar, wann etwas abgegeben werden muss, jedoch nicht, wann sie effektiv damit beginnen sollten.

  Zudem fehlt häufig eine Priorisierung der Aufgaben. Wenn mehrere Deadlines gleichzeitig anstehen, fällt es schwer zu entscheiden, welche Aufgaben zuerst erledigt werden sollen. _(Beispiel: Eine Studentin hat gleichzeitig eine Seminararbeit, ein Gruppenreferat und eine Online-Prüfung – sie verliert den Überblick, wann sie mit welcher Aufgabe beginnen soll.)_

- **Ziele:**
  - Kostenlose Webapplikation zur zentralen Verwaltung aller Deadlines
  - Automatische Berechnung des täglichen Arbeitsaufwands pro Deadline
  - Priorisierung von Aufgaben (hoch / mittel / niedrig)
  - Status-Tracking pro Deadline (Offen / In Bearbeitung / Erledigt)
  - Visuelle Warnungen bei nahenden oder überfälligen Deadlines
  - Benutzerregistrierung und persönliches Konto mit Rollenverwaltung

- **Primäre Zielgruppe:** Studierende im Alter von 18–30 Jahren, die mehrere Module parallel besuchen und regelmässig Aufgaben und Projekte abgeben müssen. Die Anwendung richtet sich insbesondere an Personen, die neben dem Studium noch einem Nebenjob nachgehen und ihr Zeitbudget effizient einteilen müssen.

- **Weitere Stakeholder:**
  - _Dozierende:_ Können als Admin-User die Plattform zur Übersicht über Studierendenaktivitäten nutzen
  - _Studiengangskoordinatoren:_ Könnten aggregierte Auswertungen zur Semesterplanung nutzen

---

## 2. Lösungsidee

Deadline Planner ist eine kostenlose, webbasierte Applikation, die Studierenden ermöglicht, ihre Abgaben und Prüfungen zentral zu verwalten, den benötigten Arbeitsaufwand zu planen und nie wieder eine wichtige Deadline zu verpassen.

- **Kernfunktionalität:** Die App deckt vier zentrale Workflows ab:
  1. **Deadline erfassen:** Neue Deadline → Titel, Modul, Datum, Aufwand, Priorität, Typ eingeben → Speichern → erscheint in der Übersicht
  2. **Tagesplanung prüfen:** Login → Tagesplanung → automatische Berechnung h/Tag → Tagesziel sichtbar
  3. **Fortschritt tracken:** Deadline öffnen → Status anpassen (Offen / In Bearbeitung / Erledigt) → Fortschritt in % setzen
  4. **Übersicht behalten:** Dashboard → farbkodierte Warnungen → Statistiken → Modulübersicht

- **Annahmen:**
  - Studierende sind bereit, Deadlines einmalig manuell einzutragen, wenn der Aufwand gering und die Oberfläche intuitiv ist
  - Eine automatische Berechnung des täglichen Arbeitsaufwands reduziert das Aufschieben von Aufgaben
  - Eine klare Visualisierung von Priorität und verbleibenden Tagen reicht als tägliche Rückmeldung aus

- **Abgrenzung:**
  - Keine automatische Synchronisation mit Moodle oder anderen Lernplattformen
  - Kein integrierter Chat oder Kollaborationsfunktionen für Gruppenarbeiten
  - Keine mobile App (iOS/Android), reine Webapplikation
  - Keine E-Mail- oder Push-Benachrichtigungen im aktuellen Umfang

---

## 3. Vorgehen & Artefakte

### 3.1 Understand & Define

#### Zielgruppenverständnis

**Problemraumanalyse**

Viele Studierende verlassen sich auf Moodle-Kalender oder handschriftliche Notizen, um Deadlines zu verfolgen. Diese Lösungen bieten jedoch keine aktive Unterstützung bei der Planung. Bestehende Apps wie Todoist oder Google Tasks decken zwar allgemeine Aufgabenverwaltung ab, bieten jedoch keine auf Studierende ausgerichtete Funktionalität wie automatische Aufwandsverteilung oder modulbezogene Übersichten.

Die Recherche zeigt, dass das Kernproblem nicht das Vergessen von Deadlines ist, sondern das fehlende Bewusstsein, wann mit einer Aufgabe begonnen werden muss. Eine Deadline in zwei Wochen mit 10 Stunden Aufwand erfordert, heute zu beginnen – das zeigen bestehende Lösungen nicht.

---

**Proto-Persona 1 – Der überforderte Vollzeit-Student**

|                 |                                                                             |
| --------------- | --------------------------------------------------------------------------- |
| **Name**        | Luca, 21 Jahre                                                              |
| **Situation**   | Bachelorstudent Wirtschaftsinformatik, 6 Module pro Semester, kein Nebenjob |
| **Ziel**        | Alle Deadlines rechtzeitig erledigen, Stress vor Abgabeterminen reduzieren  |
| **Frustration** | Merkt erst 2 Tage vor der Abgabe, wie viel Arbeit noch aussteht             |
| **Bedürfnis**   | Frühzeitige Warnung, klare Tagesplanung, Priorisierungshilfe                |

---

**Proto-Persona 2 – Die berufstätige Teilzeit-Studentin**

|                 |                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------- |
| **Name**        | Nina, 26 Jahre                                                                                |
| **Situation**   | Studiert berufsbegleitend, 40% Pensum neben dem Studium                                       |
| **Ziel**        | Studium und Beruf vereinbaren, Deadlines nicht vergessen                                      |
| **Frustration** | Hat wenig Zeit und weiss nicht, wie sie die verbleibende Zeit auf die Aufgaben verteilen soll |
| **Bedürfnis**   | Schnelle Übersicht, Aufwandsberechnung pro Tag, mobil zugänglich                              |

---

#### Wesentliche Erkenntnisse

- Studierende wollen **auf einen Blick** sehen, welche Aufgaben dringend sind – eine klare Farbkodierung ist essenziell
- **Automatische Aufwandsverteilung** wird als wertvoller empfunden als reine Deadline-Listen
- Der **Einstieg in die App** muss reibungslos sein – zu viele Pflichtfelder bei der Registrierung schrecken ab
- Studierende wollen **Module trennen** können, um den Gesamtaufwand pro Fach zu verstehen
- Eine **Verbindung zwischen Deadline und konkretem Tagesplan** wird als fehlend in bestehenden Lösungen identifiziert
- **Überfällige Deadlines** sollen sofort erkennbar sein – visuelle Warnungen mit Farbe und Icon

### 3.2 Sketch

#### Variantenüberblick

Im Sketch-Schritt wurden konzeptionelle Varianten für das Layout und die Hauptinteraktion des Deadline Planners skizziert. Ziel war es, unterschiedliche Ansätze für die Navigation und den zentralen Workflow (Deadline erfassen → Tagesplan sehen) zu evaluieren.

|                          | Variante A                                        | Variante B                            | Variante C                            |
| ------------------------ | ------------------------------------------------- | ------------------------------------- | ------------------------------------- |
| **Konzept**              | Dashboard-zentriert                               | Liste-First                           | Kalender-First                        |
| **Startseite**           | Übersichtsdashboard mit Warnungen und Statistiken | Direkte Deadline-Liste als Startseite | Monatskalender als Einstieg           |
| **Navigation**           | Klassische Top-Navbar                             | Sidebar-Navigation                    | Bottom-Navigation (mobil)             |
| **Deadline-Darstellung** | Farbkodierte Tabelle mit Badges                   | Karten-Layout                         | Kalender-Punkte                       |
| **Stärke**               | Guter Gesamtüberblick, viele Infos auf einmal     | Schneller Zugriff auf Deadlines       | Zeitliche Einordnung sofort sichtbar  |
| **Schwäche**             | Viel Information auf einmal                       | Keine Priorisierungsübersicht         | Aufwandsplanung nicht direkt sichtbar |

#### Skizzen

Im Sketch-Schritt wurden grobe Seitenskizzen aller Hauptseiten erstellt. Die Navigation ist in allen Varianten persistent sichtbar. Der zentrale Unterschied liegt in der Priorisierung der Einstiegsseite.

- **Variante A – Dashboard-First:** Eine Übersichtsseite als Startpunkt mit Statistik-Karten und Warnungen.
- **Variante B – Liste-First:** Die Deadline-Liste steht direkt im Vordergrund.
- **Variante C – Kalender-First:** Der Monatskalender als Einstieg, mit Deadlines als Punkte eingetragen.

_[Screenshot Skizzen – Variante A, B, C]_

### 3.3 Decide

**Entscheid:** Variante A wurde als Grundlage gewählt, ergänzt mit der Kalenderansicht aus Variante C als separate Seite. Das Dashboard aus Variante A bietet die beste Übersicht und gibt Studierenden beim Öffnen der App sofort die wichtigsten Informationen.

**Entscheidkriterien:**

| Kriterium                           | Variante A             | Variante B     | Variante C              |
| ----------------------------------- | ---------------------- | -------------- | ----------------------- |
| **Gesamtüberblick auf einen Blick** | ✅ Stark               | ⚠️ Nur Liste   | ❌ Nur Termine          |
| **Einstieg für Neulinge**           | ✅ Klar & strukturiert | ✅ Einfach     | ⚠️ Mittel               |
| **Priorisierung sichtbar**          | ✅ Direkt              | ⚠️ Mittel      | ❌ Nicht sichtbar       |
| **Desktop & Mobile**                | ✅ Top-Navbar          | ⚠️ Sidebar eng | ⚠️ Bottom-Nav nur mobil |
| **Erweiterbarkeit**                 | ✅ Gut                 | ⚠️ Mittel      | ⚠️ Mittel               |
| **Umsetzbarkeit**                   | ✅ Realistisch         | ✅ Realistisch | ⚠️ Aufwändig            |

**Begründung:** Variante A überzeugt durch die ausgewogene Balance zwischen Überblick und Erreichbarkeit aller Funktionen. Das Dashboard zeigt beim Öffnen der App sofort die wichtigsten Informationen (überfällige Deadlines, Wochenziel, Gesamtaufwand) ohne Scrollen. Die Top-Navbar funktioniert auf Desktop und Mobile gleichermassen.

---

**End-to-End-Ablauf:**

| Schritt | Seite           | Aktion                                                | Nutzerziel                                    |
| ------- | --------------- | ----------------------------------------------------- | --------------------------------------------- |
| 1       | `/login`        | E-Mail & Passwort eingeben oder Registrieren          | Zugang zur App erhalten                       |
| 2       | `/`             | Dashboard prüfen – Warnungen und Statistiken sehen    | Verstehen, welche Deadlines dringend sind     |
| 3       | `/neu`          | Neue Deadline erfassen (Titel, Modul, Datum, Aufwand) | Abgabe in der App registrieren                |
| 4       | `/tagesplanung` | Automatische h/Tag-Berechnung einsehen                | Wissen, wie viel heute gearbeitet werden muss |
| 5       | `/`             | Status einer Deadline anpassen (In Bearbeitung)       | Fortschritt dokumentieren                     |
| 6       | `/statistik`    | Aufwand pro Modul und Statusverteilung analysieren    | Semesterplanung optimieren                    |

**User Journey Map (SOLL) – "Einen Tag mit dem Deadline Planner"**

|                 | 1) Login & Start                                         | 2) Deadline erfassen                       | 3) Tagesplanung prüfen                 | 4) Fortschritt tracken                               |
| --------------- | -------------------------------------------------------- | ------------------------------------------ | -------------------------------------- | ---------------------------------------------------- |
| **Ziel**        | Zugang erhalten und Überblick gewinnen                   | Neue Abgabe in der App registrieren        | Wissen, wie viel heute zu tun ist      | Erledigte Arbeit dokumentieren                       |
| **Aktionen**    | App öffnen → Login → Dashboard lädt → Warnungen sichtbar | /neu öffnen → Felder ausfüllen → Speichern | /tagesplanung → h/Tag-Berechnung lesen | Deadline öffnen → Status ändern → Fortschritt setzen |
| **Touchpoints** | Login-Seite, Dashboard                                   | Formularseite /neu                         | Tagesplanung-Seite                     | Bearbeitungsformular                                 |
| **Emotion**     | Orientierung & Überblick                                 | Kontrolle & Struktur                       | Klarheit & Motivation                  | Zufriedenheit & Fortschritt                          |
| **Risiko**      | Dashboard überladen                                      | Zu viele Pflichtfelder                     | Berechnung unklar                      | Status-Update zu viele Klicks                        |
| **Mitigation**  | Klare Karten mit Farbkodierung                           | Minimale Pflichtfelder, optionale Felder   | Erklärungstext bei h/Tag               | Direktes Bearbeiten in der Tabelle                   |

**Mockup:** [Figma Mockup – Deadline Planner](https://www.figma.com/design/LEyjt3Ir9PwxXuDjK9TyFG/Deadline-Planner-Mockup?node-id=0-1&p=f&t=h5NKSlflyNY1SQ3w-0)

_[Screenshot Mockup – Übersicht, Formular, Tagesplanung]_

---

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)

##### Informationsarchitektur

Der Deadline Planner ist als flache Navigation aufgebaut. Alle Hauptseiten sind direkt über die Navigationsleiste erreichbar. Das Ziel war eine klare Hierarchie mit minimalem Navigationsaufwand.

**Seitenstruktur & Navigation:**

```
Deadline Planner
├── Landingpage (/)                  → Einstieg für nicht eingeloggte User mit Preview
├── Übersicht (/übersicht)           → Dashboard mit allen Deadlines, Warnungen, Statistik-Karten
│   └── Deadline bearbeiten (/bearbeiten/[id])
├── Neue Deadline (/neu)             → Formular zum Erfassen einer Deadline
├── Tagesplanung (/tagesplanung)     → Automatische Aufwandsberechnung h/Tag
├── Kalender (/kalender)             → Monatsansicht aller Deadlines
├── Module (/module)                 → Deadlines nach Modul gruppiert
├── Statistik (/statistik)           → Charts: Aufwand, Status, Priorität
├── Archiv (/archiv)                 → Erledigte Deadlines
├── Profil (/profil)                 → Eigenes Konto, Passwort ändern
├── Admin (/admin)                   → Benutzerverwaltung (nur Admin)
├── Login (/login)                   → Authentifizierung & Registrierung
└── Logout (/logout)                 → Session beenden
```

**Navigationskonzept:**

- Die Hauptnavigation (Navbar) ist auf allen Seiten persistent sichtbar
- Admin-Link erscheint nur für Benutzer mit der Rolle "admin"
- Nicht eingeloggte Benutzer werden automatisch auf `/login` weitergeleitet

---

##### User Interface Design

**Screen 1 – Landingpage (`/`)**

_[Screenshot Landingpage]_

Die Landingpage dient als Einstieg für nicht eingeloggte Benutzer. Sie zeigt einen Hero-Bereich mit dem Slogan "Deine Deadlines. Immer im Blick." sowie eine Feature-Preview mit den vier Hauptfunktionen. Zwei CTAs ("Jetzt anmelden" und "Registrieren") führen neue Nutzer direkt weiter.

> _Designentscheid:_ Die Landingpage motiviert zur Registrierung durch eine kurze, überzeugende Darstellung des Mehrwerts, ohne zu überladen.

---

**Screen 2 – Übersicht (`/`nach Login)**

_[Screenshot Übersicht]_

Das Dashboard zeigt oben vier Statistik-Karten (Überfällig, Diese Woche, Geplant, Total Aufwand). Darunter folgt eine farbkodierte Tabelle aller Deadlines mit Spalten für Titel, Modul, Datum, verbleibende Tage, Aufwand, Priorität, Status und Aktionen (Bearbeiten / Löschen). Überfällige Zeilen sind rot hinterlegt, kritische orange.

> _Designentscheid:_ Die Farbkodierung der Zeilen gibt sofortige visuelle Rückmeldung über die Dringlichkeit, ohne dass Nutzende Zahlen lesen müssen.

---

**Screen 3 – Neue Deadline (`/neu`)**

_[Screenshot Formular]_

Das Formular enthält folgende Felder: Titel, Modul, Deadline (Datepicker), Geschätzter Aufwand in Stunden, Priorität (Dropdown: Hoch/Mittel/Niedrig), Typ (Dropdown: Prüfung/Projekt/Übung/Seminararbeit/Sonstiges), Status (Dropdown: Offen/In Bearbeitung/Erledigt) und ein optionales Notizfeld. Pflichtfelder sind mit \* markiert.

---

**Screen 4 – Tagesplanung (`/tagesplanung`)**

_[Screenshot Tagesplanung]_

Die Tagesplanung zeigt für jede offene Deadline eine automatische Berechnung: Aufwand ÷ verbleibende Tage = benötigte Stunden pro Tag. Deadlines werden nach Dringlichkeit gruppiert (Heute, Diese Woche, Später). Eine Tagesziel-Card zeigt den aggregierten Arbeitsaufwand für heute. Smarte Warnungen erscheinen wenn z.B. nächste Woche mehr als 15 Stunden anfallen.

> _Designentscheid:_ Die Tagesplanung ist das Herzstück der App und löst das Kernproblem: Studierende wissen nicht nur wann, sondern auch wie viel sie täglich arbeiten müssen.

---

**Screen 5 – Statistik (`/statistik`)**

_[Screenshot Statistik]_

Die Statistik-Seite zeigt vier Übersichtskarten (Total Deadlines, Gesamtaufwand, Erledigt, Offen), ein Balkendiagramm für den Aufwand pro Modul, eine Statusverteilung mit Fortschrittsbalken und eine Prioritätsverteilung als farbige Karten.

---

**Screen 6 – Admin-Panel (`/admin`)**

_[Screenshot Admin]_

Das Admin-Panel zeigt eine Tabelle aller registrierten Benutzer mit Name, Rolle und Erstellungsdatum. Ein Inline-Formular ermöglicht das Erstellen neuer Benutzer mit Passwort und Rollenzuweisung. Admin-Konten sind geschützt und können nicht gelöscht werden.

---

##### Designentscheidungen

| Entscheidung                         | Beschreibung                                              | Begründung                                                   |
| ------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| **Dark Mode als Standard**           | Die gesamte UI verwendet ein dunkles Farbschema           | Reduziert Augenmüdigkeit bei häufiger Nutzung; moderner Look |
| **Rot/Orange/Grün als Statusfarben** | Farbkodierung nach Dringlichkeit                          | Sofortige visuelle Einschätzung ohne Lesen                   |
| **Tabellenbasiertes Layout**         | Deadlines als sortierbare Tabelle                         | Gute Scannbarkeit bei vielen Einträgen; bekanntes Muster     |
| **Glassmorphism-Cards**              | Hauptkarten mit Blur-Effekt und transparentem Hintergrund | Modernes, professionelles Erscheinungsbild                   |
| **Flache Navigation**                | Alle Hauptseiten direkt über Navbar                       | Minimale Klicktiefe; keine versteckten Unterseiten           |
| **MongoDB als Datenbasis**           | Flexible Dokumentenstruktur                               | Passt zu variablen Datenstrukturen; einfache Skalierung      |

#### 3.4.2. Umsetzung (Technik)

##### Technologie-Stack

| Schicht               | Technologie         | Version | Zweck                                                 |
| --------------------- | ------------------- | ------- | ----------------------------------------------------- |
| **Framework**         | SvelteKit           | 2.x     | Full-Stack Web-Framework (Routing, SSR, Form Actions) |
| **Sprache**           | JavaScript (ES2022) | —       | Frontend & Backend Logik                              |
| **Datenbank**         | MongoDB Atlas       | 7.x     | Cloud-Datenbank für User und Deadlines                |
| **DB-Treiber**        | mongodb (Node.js)   | 6.x     | Verbindung zu MongoDB aus SvelteKit Server-Code       |
| **Authentifizierung** | bcryptjs + Cookies  | —       | Passwort-Hashing & Session-Verwaltung                 |
| **Styling**           | Custom CSS          | —       | Eigenständiges Dark-Mode Design mit CSS-Variablen     |
| **Deployment**        | Netlify             | —       | Serverless Deployment mit automatischem CI/CD         |

---

##### Tooling

| Tool                                | Einsatz                                       |
| ----------------------------------- | --------------------------------------------- |
| **Visual Studio Code**              | Primäre Entwicklungsumgebung                  |
| **Claude Code (VS Code Extension)** | KI-gestützte Code-Generierung und Refactoring |
| **GitHub Copilot**                  | Autovervollständigung im Editor               |
| **MongoDB Atlas**                   | Cloud-Datenbank und Verwaltungskonsole        |
| **Git & GitHub**                    | Versionskontrolle und Repository-Verwaltung   |
| **Netlify**                         | Deployment und Environment Variables          |
| **Figma**                           | Mockup-Erstellung                             |

> Der Einsatz von KI-Werkzeugen wird im Kapitel **KI-Deklaration** detailliert beschrieben.

---

##### Struktur & Komponenten

**Projektstruktur (vereinfacht):**

```
src/
├── lib/
│   ├── db.js                        ← MongoDB-Verbindung und Datenbankoperationen
│   ├── auth.js                      ← Session-Hilfsfunktionen (getUserFromCookie)
│   └── assets/
├── routes/
│   ├── +layout.svelte               ← Root-Layout mit Navbar und User-Info
│   ├── +layout.server.js            ← User aus Session laden
│   ├── +page.svelte                 ← Übersicht / Landingpage
│   ├── +page.server.js              ← Deadlines laden + Löschen-Action
│   ├── neu/
│   │   ├── +page.svelte             ← Formular neue Deadline
│   │   └── +page.server.js          ← Deadline speichern
│   ├── bearbeiten/[id]/
│   │   ├── +page.svelte             ← Bearbeitungsformular
│   │   └── +page.server.js          ← Deadline laden und aktualisieren
│   ├── tagesplanung/
│   │   ├── +page.svelte             ← Tagesplanung mit h/Tag-Berechnung
│   │   └── +page.server.js          ← Offene Deadlines laden
│   ├── kalender/
│   │   ├── +page.svelte             ← Monatskalender
│   │   └── +page.server.js          ← Deadlines für Kalender laden
│   ├── module/
│   │   ├── +page.svelte             ← Modulübersicht gruppiert
│   │   └── +page.server.js          ← Deadlines nach Modul aggregieren
│   ├── statistik/
│   │   ├── +page.svelte             ← Charts und Statistiken
│   │   └── +page.server.js          ← Statistische Auswertungen
│   ├── archiv/
│   │   ├── +page.svelte             ← Erledigte Deadlines
│   │   └── +page.server.js          ← Gefilterte Abfrage (status=erledigt)
│   ├── admin/
│   │   ├── +page.svelte             ← Benutzerverwaltung
│   │   └── +page.server.js          ← CRUD User (nur Admin)
│   ├── login/
│   │   ├── +page.svelte             ← Login & Registrierung
│   │   └── +page.server.js          ← Auth-Logik, Admin-Seeding
│   └── logout/
│       └── +page.server.js          ← Session-Cookie löschen
├── hooks.server.js                  ← Route-Schutz, User aus Cookie laden
└── app.html                         ← HTML-Template
```

**Wichtige Komponenten und Funktionen:**

- **`hooks.server.js`** – Prüft bei jedem Request den Session-Cookie; leitet nicht eingeloggte Benutzer auf `/login` um; macht User-Daten in `locals.user` verfügbar.
- **`db.js`** – Zentrales Datenbankmodul; kapselt alle MongoDB-Operationen (getDb, insertOne, updateOne, deleteOne) und wird ausschliesslich in server-seitigem Code importiert.
- **`auth.js`** – Hilfsfunktion `getUserFromCookie()` zum Laden des eingeloggten Benutzers aus dem Session-Cookie.
- **`+layout.server.js`** – Gibt User-Daten (ID, Username, Rolle) an alle Kindseiten weiter.

**State Management:**
Der Authentifizierungsstatus wird über einen `httpOnly`-Cookie verwaltet. Der User-State wird bei jedem Request serverseitig aus MongoDB geladen und via `locals.user` an alle Seiten weitergegeben.

---

##### Daten & Schnittstellen

**Datenbankstruktur (MongoDB Collections):**

| Collection  | Inhalt            | Wichtige Felder                                                                                                        |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `users`     | Benutzerkonten    | `username`, `password` (bcrypt-Hash), `role` (admin/user), `erstellt`                                                  |
| `deadlines` | Deadline-Einträge | `titel`, `modul`, `deadline`, `aufwand`, `prioritaet`, `status`, `typ`, `fortschritt`, `notizen`, `userId`, `erstellt` |

**Form Actions (SvelteKit):**

| Route              | Action         | Funktion                            |
| ------------------ | -------------- | ----------------------------------- |
| `/login`           | `default`      | Login validieren, Cookie setzen     |
| `/login`           | `registrieren` | Neuen User erstellen, Cookie setzen |
| `/logout`          | `default`      | Cookie löschen, Redirect zu /login  |
| `/neu`             | `default`      | Neue Deadline in MongoDB speichern  |
| `/bearbeiten/[id]` | `default`      | Deadline in MongoDB aktualisieren   |
| `/`                | `loeschen`     | Deadline aus MongoDB löschen        |
| `/admin`           | `erstellen`    | Neuen User erstellen (nur Admin)    |
| `/admin`           | `loeschen`     | User löschen (nur Admin)            |

---

##### Deployment

> Die Anwendung wurde lokal entwickelt und getestet (`localhost:5173`).
> Der produktive Link ist: **https://deadline-planner.netlify.app/**
>
> Deployment erfolgt über Netlify mit automatischem CI/CD: Jeder Push auf den `main`-Branch löst automatisch ein neues Deployment aus. Die MongoDB-URI wird als Umgebungsvariable (`MONGODB_URI`) in Netlify konfiguriert.

---

##### Besondere Entscheidungen

**1. Session via httpOnly-Cookie statt JWT**
Die Session wird als `httpOnly`-Cookie mit der MongoDB-User-ID gespeichert. Bei jedem Request wird der User aus der Datenbank geladen. Dies ist einfach implementierbar und sicher gegenüber XSS-Angriffen.

**2. Admin-Seeding beim Login**
Der erste Admin-User (`admin` / `Admin1234`) wird automatisch beim ersten Aufruf der Login-Seite erstellt, falls noch kein Admin in der Datenbank vorhanden ist. Dies vereinfacht das Setup erheblich.

**3. Clientseitige Filterung und Suche**
Die Suchfunktion und Sortierung auf der Übersichtsseite erfolgt clientseitig in Svelte. Alle Deadlines werden einmalig beim Seitenaufruf geladen und reaktiv gefiltert – kein zusätzlicher Server-Request nötig. Für die aktuelle Datenmenge (< 1000 Einträge pro User) ist dieser Ansatz performant genug.

**4. userId-basierte Datentrennung**
Jede Deadline ist mit der `userId` des erstellenden Benutzers verknüpft. Admin-User sehen alle Deadlines aller Nutzer; normale User sehen nur ihre eigenen. Dies wird serverseitig in der `load()`-Funktion durch eine bedingte MongoDB-Query sichergestellt.

---

### 3.5 Validate

**URL der getesteten Version:** https://deadline-planner.netlify.app/

#### Ziele der Prüfung

Die Evaluation soll folgende Fragen beantworten:

1. Können neue Nutzende ohne Anleitung einen Account erstellen und sich einloggen?
2. Ist die Navigation zwischen den Hauptseiten intuitiv verständlich?
3. Können Nutzende eine neue Deadline erfassen und in der Übersicht finden?
4. Verstehen Nutzende die Farbkodierung und Warnungen auf dem Dashboard?
5. Ist die Tagesplanung mit der automatischen h/Tag-Berechnung selbsterklärend?

---

#### Vorgehen

- **Methode:** Moderierter Usability-Test
- **Setting:** On-site (persönlich vor Ort)
- **Dauer pro Session:** ca. 20–30 Minuten
- **Werkzeuge:** Browser (Chrome), Beobachtungsprotokoll
- **Rolle Moderator:** Aufgaben vorlesen, keine Hilfestellung geben, Beobachtungen notieren

---

#### Stichprobe

Es wurden **2 Testpersonen** rekrutiert. Das Profil entspricht der Zielgruppe (Studierende mit mehreren Modulen parallel):

- **Testperson 1:** Student, 22 Jahre, Wirtschaftsstudium, nutzt keine Deadline-App
- **Testperson 2:** Studentin, 24 Jahre, Informatikstudium, nutzt Notion für Aufgaben

---

#### Aufgaben / Szenarien

**Aufgabe 1 – Registrierung & Login**

> „Du hörst zum ersten Mal von dieser App. Erstelle einen Account und melde dich an."

**Aufgabe 2 – Deadline erfassen**

> „Du hast nächste Woche eine Prüfung in Mathematik mit einem geschätzten Aufwand von 8 Stunden. Trage diese Deadline in die App ein."

**Aufgabe 3 – Tagesplanung verstehen**

> „Finde heraus, wie viele Stunden du heute für deine Deadlines arbeiten solltest."

**Aufgabe 4 – Status aktualisieren**

> „Markiere die Mathematik-Prüfung als 'In Bearbeitung'."

**Aufgabe 5 – Statistik lesen**

> „Wie viele Stunden Gesamtaufwand hast du diese Woche?"

---

#### Kennzahlen & Beobachtungen

**Erfolgsquoten:**

| Aufgabe               | T1  | T2  | Erfolgsquote |
| --------------------- | --- | --- | ------------ |
| 1 – Registrierung     | ✅  | ✅  | 100%         |
| 2 – Deadline erfassen | ✅  | ⚠️  | 75%          |
| 3 – Tagesplanung      | ⚠️  | ⚠️  | 50%          |
| 4 – Status ändern     | ✅  | ✅  | 100%         |
| 5 – Statistik lesen   | ✅  | ⚠️  | 75%          |

> ✅ = Erfolgreich ohne Hilfe | ⚠️ = Mit Zögern oder kleinen Fehlern | ❌ = Nicht erfolgreich

**Qualitative Findings (Issue Map):**

| ID   | Seite        | Schweregrad | Beobachtung                                                                                    |
| ---- | ------------ | ----------- | ---------------------------------------------------------------------------------------------- |
| U-01 | Tagesplanung | 🟡 Mittel   | Die h/Tag-Berechnung ist nicht sofort verständlich – Testperson 1 fragte, was „h/Tag" bedeutet |
| U-02 | Neu          | 🟢 Gering   | Das Feld „Typ" wurde von beiden Testpersonen ignoriert, obwohl es nützlich wäre                |
| U-03 | Übersicht    | 🟡 Mittel   | Testperson 2 fand die Sortierung der Tabelle nicht intuitiv                                    |
| U-04 | Statistik    | 🟢 Gering   | Die Balkendiagramme wurden als zu klein empfunden auf kleinen Bildschirmen                     |

---

#### Zusammenfassung der Resultate

Die Evaluation zeigt, dass die grundlegende Navigation und der Login-/Registrierungsprozess gut funktionieren und von beiden Testpersonen ohne Probleme abgeschlossen wurden. Die Tagesplanung mit der automatischen h/Tag-Berechnung wird als sehr nützlich bewertet, erfordert jedoch eine kurze Erklärung der Berechnung direkt auf der Seite. Die Farbkodierung der Deadlines wird intuitiv verstanden.

---

#### Abgeleitete Verbesserungen

| Priorität | Issue | Massnahme                                                 | Begründung                                               |
| --------- | ----- | --------------------------------------------------------- | -------------------------------------------------------- |
| 🟡 P1     | U-01  | Erklärungstext zur h/Tag-Berechnung ergänzen              | Kernfunktion der Tagesplanung muss selbsterklärend sein  |
| 🟡 P2     | U-03  | Sortierbarkeit der Tabellenspalten durch Klick auf Header | Nutzende erwarten klickbare Spaltenheader zur Sortierung |
| 🟢 P3     | U-02  | Tooltip beim Typ-Feld hinzufügen                          | Erklärt den Nutzen des Feldes ohne UI zu überladen       |
| 🟢 P4     | U-04  | Responsive Anpassung der Charts für Mobile                | Verbessert Lesbarkeit auf kleineren Bildschirmen         |

---

## 4. Erweiterungen

### 4.1 Login & Registrierung mit Rollenverwaltung

- **Beschreibung & Nutzen:** Nutzende können sich über ein Registrierungsformular einen eigenen Account erstellen. Beim Login wird ein Session-Cookie gesetzt. Es gibt zwei Rollen: `admin` (voller Zugriff) und `user` (eigene Deadlines). Nicht eingeloggte Nutzende werden automatisch auf `/login` weitergeleitet.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/login/+page.svelte` – Login- und Registrierungsformular mit Fehleranzeige
  - **Backend:** `src/routes/login/+page.server.js` – Passwort-Hashing mit bcryptjs, Cookie setzen; `src/hooks.server.js` – Route-Schutz
  - **Datenbank:** Collection `users` mit Feldern username, password (Hash), role, erstellt
- **Referenz:** Informationsarchitektur in Kap. 3.4.1; Screen 6 (Login)
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.2 Admin-Panel – Benutzerverwaltung

- **Beschreibung & Nutzen:** Nutzende mit der Rolle `admin` erhalten Zugriff auf `/admin`. Dort können neue Benutzer mit Passwort und Rollenzuweisung erstellt und bestehende Benutzer gelöscht werden. Der Admin-Link erscheint nur in der Navbar für Admin-Nutzende; normale Nutzende erhalten bei direktem Aufruf einen 403-Fehler.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/admin/+page.svelte` – Benutzertabelle, Inline-Formular zum Erstellen
  - **Backend:** `src/routes/admin/+page.server.js` – Zugriffsschutz (role !== 'admin' → error(403)); Actions `erstellen` und `loeschen`
  - **Datenbank:** MongoDB-Operationen auf Collection `users`
- **Referenz:** Screen 6 (Admin-Panel) in Kap. 3.4.1
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.3 Tagesplanung / Workload-Rechner

- **Beschreibung & Nutzen:** Die Tagesplanung berechnet automatisch für jede offene Deadline, wie viele Stunden pro Tag benötigt werden (Aufwand ÷ verbleibende Tage). Die Deadlines werden nach Dringlichkeit gruppiert (Heute, Diese Woche, Später). Eine Tagesziel-Card zeigt den aggregierten Gesamtaufwand für heute. Smarte Warnungen erscheinen bei Überlastung.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/tagesplanung/+page.svelte` – Berechnung und Darstellung der h/Tag-Werte; Gruppierung nach Dringlichkeit; Warnungs-Banners
  - **Backend:** `src/routes/tagesplanung/+page.server.js` – Lädt alle offenen Deadlines des Users
- **Referenz:** Screen 4 (Tagesplanung) in Kap. 3.4.1; Issue U-01 in Kap. 3.5
- **Aus Evaluation abgeleitet?:** Teilweise – Erklärungstext als Folge von Issue U-01 ergänzt

---

### 4.4 Modulübersicht

- **Beschreibung & Nutzen:** Die Modulübersicht gruppiert alle Deadlines nach Modul und zeigt pro Modul: Anzahl Deadlines, Gesamtaufwand in Stunden, erledigte vs. offene Tasks und einen Fortschrittsbalken (% erledigt). So sehen Studierende auf einen Blick, welches Fach am meisten Aufwand erfordert.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/module/+page.svelte` – Karten pro Modul mit Statistiken und Fortschrittsbalken
  - **Backend:** `src/routes/module/+page.server.js` – MongoDB-Aggregation nach Modul-Feld
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.5 Statistik-Dashboard

- **Beschreibung & Nutzen:** Die Statistik-Seite visualisiert den Deadline-Überblick durch Balkendiagramme (Aufwand pro Modul), Statusverteilung (Fortschrittsbalken) und Prioritätsverteilung (farbige Karten). Vier Kennzahl-Karten zeigen Total Deadlines, Gesamtaufwand, Erledigte und Offene Deadlines.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/statistik/+page.svelte` – CSS-basierte Charts ohne externe Bibliothek; animierte Balken
  - **Backend:** `src/routes/statistik/+page.server.js` – Aggregation der Statistikdaten aus MongoDB
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.6 Kalenderansicht

- **Beschreibung & Nutzen:** Die Kalenderansicht zeigt alle Deadlines im Monatsformat. Tage mit Deadlines werden farblich hervorgehoben. Ein Klick auf einen Tag zeigt alle Deadlines dieses Tages. Die Navigation zwischen Monaten ist über Pfeiltasten möglich.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/kalender/+page.svelte` – CSS-Grid-basierter Monatskalender; reaktive Datumsnavigation
  - **Backend:** `src/routes/kalender/+page.server.js` – Deadlines für den aktuellen Monat laden
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.7 iCal-Export

- **Beschreibung & Nutzen:** Alle Deadlines können als `.ics`-Datei exportiert und direkt in Google Calendar, Apple Calendar oder Outlook importiert werden. Jede Deadline wird als Termin mit Titel, Datum und Beschreibung angelegt.
- **Wo umgesetzt:**
  - **Backend:** `src/routes/api/export/ical/+server.js` – Generiert `.ics`-Datei aus allen Deadlines des Users; setzt korrekten Content-Type-Header
  - **Frontend:** Download-Button auf der Statistik- oder Übersichtsseite
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.8 Status & Fortschritts-Tracking

- **Beschreibung & Nutzen:** Jede Deadline kann einen Status (Offen / In Bearbeitung / Erledigt) und einen Fortschrittswert (0–100%) haben. Erledigte Deadlines werden automatisch ins Archiv verschoben. Der Fortschritt wird als Balken in der Übersichtstabelle visualisiert.
- **Wo umgesetzt:**
  - **Frontend:** Status-Dropdown und Fortschritts-Slider im Bearbeitungsformular; Fortschrittsbalken in der Übersichtstabelle
  - **Backend:** Felder `status` und `fortschritt` in MongoDB; Archiv-Abfrage filtert nach `status = 'erledigt'`
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.9 Smarte Warnungen & Benachrichtigungen

- **Beschreibung & Nutzen:** Das Dashboard zeigt farbige Warnungs-Banner: „🔥 X Deadlines in den nächsten 7 Tagen", „⚠️ Aufgabe X ist überfällig!", „✅ Du hast diese Woche Y Deadlines erledigt". In der Navigation erscheint ein roter Badge mit der Anzahl kritischer Deadlines (< 3 Tage).
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/+page.svelte` – Bedingte Banner basierend auf Deadline-Daten; Navigations-Badge in `+layout.svelte`
  - **Backend:** `+page.server.js` – Berechnung der Anzahl kritischer Deadlines beim Laden
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Erweiterung

---

### 4.10 Dark Mode

- **Beschreibung & Nutzen:** Die gesamte Anwendung verwendet standardmässig einen Dark Mode. Das Farbschema basiert auf CSS-Variablen (`--bg-primary: #1a1a2e`) und wird konsistent auf allen Seiten angewendet.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/+layout.svelte` – Globale CSS-Variablen für das Dark-Mode-Farbschema; Glassmorphism-Effekte für Cards
- **Aus Evaluation abgeleitet?:** Nein – eigenständige Designentscheidung

---

## 5. Projektorganisation

- **Repository:** [github.com/noedebelder/deadline-planner](https://github.com/noedebelder/deadline-planner) – Öffentliches GitHub-Repository mit vollständigem Sourcecode und dieser Dokumentation.

- **Struktur:** Monorepo – SvelteKit-Projekt in der Wurzel des Repositories. Sourcecode in `src/` gemäss der in Kap. 3.4.2 beschriebenen Struktur.

- **Commit-Praxis:** Commits wurden featurebezogen verfasst (z.B. _"Add login system, admin panel and improved design"_, _"Fix MongoDB connection for serverless"_, _"Add delete functionality"_). Jeder Commit enthält eine abgeschlossene, lauffähige Änderung.

- **Deployment:** Die App ist kontinuierlich über Netlify deployed. Jeder Push auf den `main`-Branch löst automatisch ein neues Deployment aus. Live-URL: [deadline-planner.netlify.app](https://deadline-planner.netlify.app/)

---

## 6. KI-Deklaration

### 6.1 KI-Tools

- **Eingesetzte Tools:**
  - _Claude (claude.ai / Claude Sonnet 4.6):_ Begleitung durch den gesamten Entwicklungsprozess; Setup-Anleitung, Debugging, Code-Generierung
  - _Claude Code (VS Code Extension):_ Direkte Code-Generierung im Editor; Implementierung grösserer Features (Login-System, Tagesplanung, Admin-Panel, Design-Überarbeitung)
  - _GitHub Copilot:_ Autovervollständigung bei repetitivem Code

- **Zweck & Umfang:**
  - Schritt-für-Schritt-Anleitung beim Projektsetup (SvelteKit, MongoDB, Netlify)
  - Generierung des gesamten App-Codes: Datenbankanbindung, Authentifizierungssystem, alle Routen und Seiten
  - Debugging von Build-Fehlern (Netlify-Adapter, CSS-Syntaxfehler)
  - Design-Entscheidungen und CSS-Implementierung (Dark Mode, Glassmorphism, Animationen)
  - Erstellung dieser Projektdokumentation (README.md)
  - Der KI-generierte Code wurde als Ausgangsbasis verwendet und iterativ durch Prompts verfeinert

- **Eigene Leistung (Abgrenzung):**
  - Eigenständige Konzeption der Applikationsidee (Deadline Planner) und Definition der Anforderungen
  - Problemraumanalyse, Personas und HMW-Fragen
  - Entscheidungen zu Features, Design und User Experience
  - Figma-Mockup erstellt
  - Testing der App in Browser und Identifikation von Problemen
  - Durchführung und Auswertung des Usability-Tests
  - Finale Überarbeitung und Qualitätssicherung aller Inhalte

---

### 6.2 Prompt-Vorgehen

Beim Einsatz von KI-Tools wurde grundsätzlich mit kontextbezogenen, detaillierten Prompts gearbeitet. Der bestehende Code wurde als Ausgangslage mitgeliefert, damit die KI konsistente Vorschläge machen konnte, die zum vorhandenen Stil und zur Projektstruktur passen.

Die Entwicklung erfolgte in mehreren Iterationen:

1. **Setup-Phase:** Schritt-für-Schritt-Prompts für SvelteKit-Setup, MongoDB-Verbindung, Netlify-Konfiguration
2. **Feature-Phase:** Grössere Feature-Prompts (z.B. "Implementiere ein vollständiges Login-System mit bcryptjs, Session-Cookies und Route-Schutz in hooks.server.js") mit konkreten technischen Anforderungen
3. **Design-Phase:** Design-Prompts mit spezifischen CSS-Anforderungen (Glassmorphism, Animationen, Farbschema)
4. **Claude Code-Phase:** Umfangreiche Prompts für Claude Code in VS Code mit vollständiger Anforderungsliste für mehrere Features gleichzeitig

Beispiel-Prompt (Claude Code): _"Mein SvelteKit Deadline Planner hat folgende Probleme: 1. Alle Routen müssen Login erfordern. 2. Erstelle eine Landingpage für nicht eingeloggte User. 3. Füge Loading-Spinner hinzu. 4. Implementiere Toast-Nachrichten bei Erfolg/Fehler..."_

---

### 6.3 Reflexion

**Nutzen:** Der Einsatz von KI hat die Entwicklung erheblich beschleunigt. Besonders beim Setup komplexer Systeme (Authentifizierung, MongoDB-Integration, Netlify-Deployment) hat die schrittweise Begleitung durch Claude Zeit gespart und Fehler frühzeitig identifiziert. Claude Code ermöglichte die Implementierung mehrerer Features gleichzeitig in kurzer Zeit.

**Grenzen:** KI-generierter Code muss stets auf Korrektheit und Kompatibilität geprüft werden. Vereinzelt wurden veraltete SvelteKit-Syntaxen oder CSS-Fehler (fehlende schliessende Klammern) produziert, die manuell korrigiert werden mussten. Komplexe Debugging-Situationen (z.B. Netlify Build-Fehler) erforderten mehrere Iterationen.

**Risiken & Qualitätssicherung:**

- Alle KI-Vorschläge wurden lokal mit `npm run dev` und `npm run build` getestet
- Datenbankoperationen wurden in MongoDB Atlas auf Korrektheit geprüft
- Die deployete App wurde nach jedem Push in Netlify getestet
- Sicherheitskritische Aspekte (Passwort-Hashing, Session-Cookie, Route-Schutz) wurden eigenständig auf Korrektheit geprüft

---

## 7. Anhang

- **Live-App:** https://deadline-planner.netlify.app/
- **GitHub-Repository:** https://github.com/noedebelder/deadline-planner
- **Figma-Mockup:** https://www.figma.com/design/LEyjt3Ir9PwxXuDjK9TyFG/Deadline-Planner-Mockup?node-id=0-1&p=f&t=h5NKSlflyNY1SQ3w-0
- **Testskript:** Aufgaben 1–5 gemäss Kap. 3.5
