# Unofficial Church Tools

> This is an unofficial UI for the Church of Jesus Christ of Latter-Day Saints tools applications. It is not affiliated with the Church of Jesus Christ of Latter-Day Saints, and is not endorsed by the Church.

This project is an attempt to build a more purpose-built UI for Church tools, normal use cases for day to day church services are often difficult through layers of navigation and routing hierarchies.

This project aims to provide a quicker route to effective tools for church members and leaders.

## Project Structure

- `server/` - The server is built with FastAPI and is responsible for handling API requests and authentication.
- `web/` - The web client is built with React and is responsible for the UI.

Under the hood, the server is using an unofficial API for the Church of Jesus Christ of Latter-Day Saints: [church-of-jesus-christ-api](https://github.com/mackliet/church_of_jesus_christ_api).

This handles a stateful session using a provided username and password, and hits the same endpoints used on the Church's website.

The web client is a React application that uses the `ChurchAPI` class to interact with the server.

## Development

To run the API server, you can use the following command from the `server` directory (after installing dependencies with `uv pip install -r pyproject.toml`):

```bash
fastapi dev main.py
```

Then you can run the web client with the following command from the `web` directory (after installing dependencies with `npm install`):

```bash
npm run dev
```

Then you can open up the Vite app.
