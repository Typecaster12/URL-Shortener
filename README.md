# URL Shortener

A simple URL shortener application built with Node.js. This application allows users to create shortened URLs with custom aliases and redirects users to the original URLs when accessed.

## Features

- Create shortened URLs with custom aliases
- Validate URL format and alias characters
- Prevent duplicate aliases
- Track click counts for each shortened URL
- Store data persistently in a JSON file
- Serve a web interface for URL shortening

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone or download the project files to your local machine.
2. Navigate to the project directory.
3. Install dependencies (if any) by running:
   ```
   npm install
   ```
   Note: This project uses only built-in Node.js modules, so no external dependencies are required.

## Usage

1. Start the server by running:
   ```
   node ShortnerServer.js
   ```

2. Open your web browser and navigate to `http://localhost:3500`.

3. Fill in the form with:
   - **URL**: The original URL you want to shorten
   - **Alias**: A custom short name for the URL (alphanumeric characters, underscores, and hyphens only)

4. Click "Submit" to create the shortened URL.

5. The application will display a clickable link to the shortened URL.

6. When you click the shortened link, you will be redirected to the original URL.

## API Endpoints

### GET /
Serves the HTML form for creating shortened URLs.

### POST /submit
Creates a new shortened URL.

**Request Body** (application/x-www-form-urlencoded):
- `mainUrl`: The original URL to shorten
- `alias`: The custom alias for the shortened URL

**Response**:
- Success (201): Returns the shortened URL path (e.g., `/myalias`)
- Error (400): Invalid input or validation error
- Error (409): Alias already exists

### GET /{alias}
Redirects to the original URL associated with the alias.

**Response**:
- Success (302): Redirects to the original URL
- Error (400): Alias not found

## Data Storage

The application stores URL data in `storage.json` in the following format:

```json
{
  "alias": {
    "url": "https://example.com",
    "timeStamp": "2026-01-13T12:00:00.000Z",
    "clicks": 0
  }
}
```

- `url`: The original URL
- `timeStamp`: ISO string of when the URL was created
- `clicks`: Number of times the shortened URL has been accessed

## Validation Rules

- **URL**: Must be a valid URL format
- **Alias**: Must contain only alphanumeric characters, underscores, and hyphens (no spaces or special characters)
- **Uniqueness**: Each alias must be unique

## Error Handling

The application includes error handling for:
- Invalid URL formats
- Invalid alias characters
- Duplicate aliases
- Missing required fields
- File I/O errors

## Development

To modify the application:
- `ShortnerServer.js`: Main server logic
- `Form.html`: Web interface
- `storage.json`: Data storage (created automatically)

## License

This project is open source. Feel free to use and modify as needed.
