# PokeAPI React Project – Detailed Architecture & Flow

## Entry Flow

The app starts in **`src/main.jsx` (line 1)**. React mounts the application into the DOM using:

```jsx
createRoot(...).render(...)
```

The main screen component rendered is **`Pokeapi`**.

### Important Observation

In **`src/main.jsx` (line 4)**, the application imports:

```jsx
import "./pokeapi.jsx";
```

while the actual filename is:

```text
Pokeapi.jsx
```

This usually works on **Windows** because the filesystem is case-insensitive. However, it can fail on **Linux/macOS deployment environments** where filenames are case-sensitive.

---

# Main Screen Responsibility

The core application logic lives inside:

```
src/Pokeapi.jsx
```

(Line 7)

This component is responsible for:

- Calling the custom data-fetch hook
- Storing UI state
- Filtering Pokémon
- Pagination
- Rendering Pokémon cards
- Rendering pagination controls

The important React states are:

| State | Purpose |
|--------|----------|
| `search` | Stores the Pokémon name search text |
| `selectedType` | Stores the selected Pokémon type |
| `currentPage` | Current pagination page |
| `pageInput` | Stores the page number entered in the Jump-to-Page input |

---

# How API Fetching Works

The API logic is implemented inside the custom hook:

```
src/FetchApiData.jsx
```

(Line 3)

```jsx
useFetchApiData(baseAPI)
```

The hook internally maintains four pieces of state:

```jsx
pokemon
loading
error
totalCount
```

---

## Fetch Flow

Inside `fetchPokemon()`:

**Location**

```
src/FetchApiData.jsx
```

(Line 9)

The application first requests the master Pokémon list:

```text
https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0
```

This endpoint returns:

- Pokémon names
- URL for each Pokémon

It **does not** return complete Pokémon information.

Example response:

```json
{
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    }
  ]
}
```

---

## Second Fetch

For every Pokémon returned in the master list:

(Location: **FetchApiData.jsx line 25**)

```jsx
fetch(curPokemon.url)
```

is executed.

Each of those URLs returns complete Pokémon information including:

- Image
- Height
- Weight
- Types
- Stats
- Abilities
- Base Experience

---

## Promise.all()

At:

```
src/FetchApiData.jsx
```

(Line 35)

The application uses:

```jsx
Promise.all(...)
```

This waits until **every Pokémon detail request** completes.

After all requests finish:

```jsx
setPokemon(fullPokemonData)
```

stores the complete Pokémon array into React state.

---

## Fetch Process Summary

```
First API Call
        │
        ▼
Master Pokémon List
(Name + URL)

        │
        ▼

Fetch every URL individually

        │
        ▼

Promise.all()

        │
        ▼

Detailed Pokémon Array

        │
        ▼

Stored in React State
```

Because of this design, every Pokémon card can display:

- Official artwork
- Types
- Stats
- Abilities
- Height
- Weight
- Base experience

The master list endpoint alone is not enough for these details.

---

# Why the Fetch Strategy Was Changed

Originally, the application fetched **only one API page at a time**.

Then filtering was performed only on that page.

Example problem:

Suppose page 5 contained:

```
Charmander
Eevee
Pikachu
Fairy Pokémon
```

Filtering by:

```
Fairy
```

would only search inside page 5.

Instead of showing the **first 50 Fairy Pokémon overall**, it showed only Fairy Pokémon that happened to exist on that raw API page.

---

## New Strategy

Now:

1. Fetch every Pokémon
2. Store everything once
3. Filter entire dataset
4. Paginate filtered data

Current order:

```
Fetch every Pokémon

        │

        ▼

Store full array

        │

        ▼

Filter by:

• Name
• Type

        │

        ▼

Calculate total pages

        │

        ▼

Slice current 50 Pokémon

        │

        ▼

Render cards
```

This gives correct filtering behavior.

---

# Filtering Logic

Filtering occurs in:

```
src/Pokeapi.jsx
```

(Line 28)

There are two filters:

1. Name Search
2. Type Filter

---

## Name Search

The search compares lowercase strings.

Example:

```jsx
pokemon.name
    .toLowerCase()
    .includes(search.toLowerCase())
```

So:

```
Char
char
CHAR
```

all match:

```
Charmander
```

---

## Type Filter

If:

```jsx
selectedType === "all"
```

then every Pokémon is included.

Otherwise:

```jsx
pokemon.types.some(...)
```

checks whether any Pokémon type matches the selected type.

---

# Dynamic Type List

The dropdown options are **not hardcoded**.

They are built dynamically from loaded Pokémon data.

Location:

```
src/Pokeapi.jsx
```

(Line 20)

It uses:

```jsx
flatMap()

Set

sort()
```

Flow:

```
Every Pokémon

       │

       ▼

Extract Types

       │

       ▼

Flatten Array

       │

       ▼

Remove Duplicates (Set)

       │

       ▼

Sort Alphabetically

       │

       ▼

Dropdown Options
```

---

# Pagination Logic

Pagination is controlled in:

```
src/Pokeapi.jsx
```

(Line 39)

The constant:

```jsx
POKEMON_PER_PAGE = 50
```

determines page size.

---

## Total Pages

```jsx
Math.max(
    1,
    Math.ceil(filteredPokemon.length / 50)
)
```

This guarantees there is always at least one page.

---

## Current Page Data

The visible Pokémon are selected using:

```jsx
filteredPokemon.slice(start, end)
```

Only 50 Pokémon are rendered.

---

# Navigation Handlers

### Previous Page

```
handlePreviousPage()

src/Pokeapi.jsx
```

(Line 66)

Moves back one page but never below page 1.

---

### Next Page

```
handleNextPage()

src/Pokeapi.jsx
```

(Line 76)

Moves forward but never beyond `totalPages`.

---

### Jump To Page

```
handlePageJump()

src/Pokeapi.jsx
```

(Line 86)

Reads user input and safely clamps it within valid page limits.

---

# Why Page Reset Happens

Whenever:

- Search text changes
- Selected type changes

the following effect runs:

```
src/Pokeapi.jsx
```

(Line 48)

```jsx
setCurrentPage(1)
```

Why?

Imagine:

```
Current Page = 12
```

Then the user filters to:

```
Fairy
```

Now only:

```
2 pages
```

exist.

Page 12 would become invalid.

Resetting to page 1 provides a stable user experience.

---

## Additional Guard

Another effect at:

```
src/Pokeapi.jsx
```

(Line 52)

checks:

```
currentPage <= totalPages
```

If not:

```
currentPage = totalPages
```

This prevents invalid page numbers.

---

# Loading and Error Handling

Loading and errors are handled separately inside:

```
src/ErrorHandling.jsx
```

(Line 2)

Behavior:

If:

```jsx
loading === true
```

Render:

```
Loader
```

If:

```jsx
error
```

Render:

```
error.message
```

Otherwise:

```jsx
return null
```

---

## Loader Component

The loader is located at:

```
src/components/Loader.jsx
```

(Line 3)

It is built using:

```
styled-components
```

It is purely an animated visual component.

---

# Data Display

Each Pokémon card is rendered by:

```
src/PokeCards.jsx
```

(Line 1)

Every card displays:

- Official artwork
- Pokémon name
- Types
- Height
- Weight
- Speed
- Base experience
- Attack
- First ability

---

# Type-Based Card Colors

Inside:

```
src/PokeCards.jsx
```

(Line 3)

A map called:

```jsx
typeColors
```

stores colors for every Pokémon type.

The primary type is obtained using:

```jsx
pokemonData.types[0].type.name
```

Then:

```jsx
style={{
    "--type-color": bgColor
}}
```

sets a CSS custom property.

This makes hover effects and card styling depend on Pokémon type.

---

# Scroll Behavior

A helper function:

```jsx
scrollToTop()
```

is defined in:

```
src/Pokeapi.jsx
```

(Line 16)

Implementation:

```jsx
window.scrollTo({
    top: 0,
    behavior: "smooth"
})
```

---

## Automatic Scroll

Whenever:

```jsx
currentPage
```

changes

(Location: **Line 62**)

the application automatically scrolls back to the top.

---

## Manual Scroll

A floating button

(Location: **Line 171**)

also calls:

```jsx
scrollToTop()
```

So users always have a quick way to return to the top.

---

# Styling Structure

Most styling is located inside:

```
src/index.css
```

It controls:

- Layout
- Typography
- Card Grid
- Filters
- Pagination
- Floating Button
- Hover Effects

---

## Styling Approaches

The project currently uses two styling systems:

### Global CSS

```
index.css
```

### Styled Components

Used only for:

```
Loader.jsx
```

---

# Overall Architecture

This project is a **client-side React Pokedex application built with Vite**.

Its architecture is:

```
React (Vite)

       │

       ▼

Custom Fetch Hook

       │

       ▼

Fetch Entire Pokémon Dataset

       │

       ▼

Store in React State

       │

       ▼

Filter in Memory

       │

       ▼

Paginate in Memory

       │

       ▼

Render Responsive Card Grid
```

---

# Features

The application currently supports:

- Fetching Pokémon directly from PokeAPI
- Displaying official artwork
- Name search
- Dynamic type filtering
- Client-side pagination
- Jump-to-page input
- Scroll-to-top button
- Loading indicator
- Error handling
- Type-colored cards
- Responsive layout

---

# Important Trade-Off

The current implementation prioritizes:

- Correct filtering
- Correct pagination
- Simpler frontend logic

Instead of:

- Minimal network usage

Reason:

At:

```
src/FetchApiData.jsx
```

(Line 25)

the application immediately requests details for **every Pokémon**.

This means:

### Advantages

- Very fast filtering
- Instant pagination
- No additional API requests after initial load
- Simple client-side logic

### Disadvantages

- Large initial download
- Hundreds of API requests
- Longer first loading time
- Higher network usage

---

# Final Architecture Summary

```
React App
      │
      ▼
main.jsx
      │
      ▼
Pokeapi.jsx
      │
      ├───────────────┐
      │               │
      ▼               ▼
Fetch Hook        UI State
      │               │
      ▼               │
PokeAPI             Search
      │             Type Filter
      ▼             Pagination
Detailed Data         │
      └───────────────┘
              │
              ▼
      Filter Entire Dataset
              │
              ▼
        Paginate (50/Page)
              │
              ▼
        Render Pokémon Cards
              │
              ▼
      Responsive User Interface
```