## Shared Bookmarks
A simple multi-user bookmark sharing application built with HTML and JavaScript.

The goal of this project is to create a web application that allows different users to save and share useful links. Users are able to select a profile, view their saved bookmarks, and add new ones.

## Features
- Dropdown to select between five users
- Display bookmarks for the selected user
- Show bookmarks in reverse chronological order
- Each bookmark displays:
    - Title (as a clickable link)
    - Description
    - Creation timestamp
- Copy-to-clipboard functionality for each bookmark
- Like button with persistent counter
- Accessible form to add new bookmarks
- Automatic UI update after submission
- 100% Lighthouse accessibility score
- Unit tests for core logic functions

## Data Handling

Bookmark data is stored using the provided storage.js utility.
Each bookmark includes:
- id
- url
- title
- description
- createdAt
- likes

No authentication is implemented. Users are selected via dropdown only.

## Tech Stack
- HTML5
- JavaScript (ES modules)
- Provided storage abstraction
- Testing framework (Jest)

## Development Notes
The focus of this project is on:
- Correct state management
- Dynamic DOM rendering
- Data persistence
- Accessibility
- Logic over visual styling