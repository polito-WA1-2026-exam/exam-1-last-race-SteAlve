# Exam #1: "Last Race"
## Student: s354116 ALVERINO STEFANO 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `station` - stores all metro stations (id, name)
- Table `line` - stores all metro lines (id, name)
- Table `line_station` - junction table linking stations to lines with their position order; used to define the network topology and derive all connections
- Table `event` - stores random events that can occur during a segment (id, description, effect from -4 to +4)
- Table `user` - stores registered users with hashed password and salt for authentication (id, email, name, hashed_password, salt)
- Table `game` - stores each game session with assigned start/end stations and final score (NULL while in planning phase) (id, user_id, start_station_id, end_station_id, score)

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
