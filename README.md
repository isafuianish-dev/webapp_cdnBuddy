# cdnBuddy — the shared toolkit behind every Buddy app

cdnBuddy isn't an app you open on its own. It's the shared toolkit that all
the other "Buddy" apps in this repo (todoBuddy, kanbanBuddy, noteBuddy,
snakeBuddy, and the rest) quietly load in the background. Because every app
pulls from the same toolkit, they all feel like part of one consistent
family — same look, same settings panel, same icons, same little moments of
delight — instead of a pile of unrelated pages.

Think of it as the "house style" that every app inherits automatically.

## What it provides

### A dark/light theme, remembered per app
Every app can switch between a light and dark look. Whichever one you pick
is remembered (per app) so it's already set the way you like it the next
time you open that app. If you've never chosen one, the app quietly matches
your device's system-wide light/dark setting on first visit.

### A consistent settings panel, everywhere
Apps that use the toolkit share the same settings dialog, so learning it
once means you know it everywhere. From that panel you can:
- Switch between **light and dark theme**
- Pick an **accent color** for the app's buttons and highlights — choose
  from Indigo (the default), Blue, Green, Rose, Amber, or Purple
- Find a link to see the other apps in the collection
- Find the license/credit info, along with a small "Made with love" heart
  you can click for a fun surprise (see below)

Your theme and accent choices are saved separately for each app, so you can,
for example, run one app in dark mode with a green accent and another in
light mode with blue, and each will remember its own preference.

### A shared set of icons
All apps draw from the same library of over 70 simple, single-color line
icons — things like checkmarks, trash cans, calendars, charts, shopping
carts, weather symbols, search engine logos, media controls, and
formatting marks (bold, italic, links, quotes). Because they all come from
one shared set, icons look and feel consistent no matter which app you're
in, and they automatically pick up whatever accent color the app is using.

### Pop-up dialogs (modals) that behave the same way everywhere
Confirmation prompts, forms, and the settings panel all open in the same
style of pop-up window across every app — same header, same close button,
same "click outside or press Escape to dismiss" behavior. Some dialogs
(like a "type to confirm this destructive action" prompt) are designed to
require an explicit choice and won't close until you make one.

### Markdown rendering for note-style apps
Any app that lets you write and preview formatted notes (headings, bold and
italic text, bullet and numbered lists, links, tables, blockquotes, and code
blocks) uses the same shared renderer, so notes look and behave the same way
across apps. It also supports special callout boxes — labeled "Warning,"
"Error," or "Success" — that render with a colored icon and background to
make important notes stand out.

### Small celebration effects
A few playful touches are shared across apps and pop up at satisfying
moments:
- **Confetti** bursts across the screen when you complete something worth
  celebrating — for example, finishing a to-do item or habit, dragging a
  kanban card into "Done," winning a game of Snake, Sudoku, Minesweeper, or
  Memory Match, or winning a round of Ludo.
- A **heart burst** animation (little floating hearts plus a "Thank you!"
  message) plays if you click the heart in the settings panel's credit line.
- Both effects automatically stay off if your device has "reduce motion"
  turned on, so they won't play if you've asked your system to limit
  animations.

### A few shared extras
- A small collection of **ambient background music tracks** (Beat, Forest,
  Relaxation, Sunset) is available for apps that offer a focus timer or
  background music feature.
- Some apps offer **starter sample data** you can load in to see the app
  populated with realistic example content right away, instead of starting
  from a completely empty state.
- Consistent small touches throughout — like a thin, theme-matched
  scrollbar — so even minor details feel like part of the same app family.

## Why this matters as you browse the repo

Any polish you notice in one app — the theme toggle, the accent colors, the
icon style, the confetti when you finish a task — isn't unique to that app.
It's coming from cdnBuddy, and you'll find the exact same experience waiting
for you in every other app in the collection.
