# Pastebin-Lite

A minimal Pastebin-like backend service built as part of a take-home assignment.

The application allows users to create text pastes with optional expiration time (TTL) and view limits, and to retrieve them via a unique ID.

---

## Features

- Create a paste with text content
- Optional time-to-live (TTL)
- Optional maximum view count
- Paste expires automatically when:
  - TTL is exceeded, or
  - view limit is reached
- Deterministic time handling for automated testing
- JSON-based REST API
- No manual database migrations or shell access required

---

## Tech Stack

- **Backend:** Node.js, Express
- **Storage:** Upstash Redis (serverless-compatible key-value store)
- **Frontend:** React (deployed separately)

---

## API Endpoints

### Health Check
