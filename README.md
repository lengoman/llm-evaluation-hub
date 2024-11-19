# LLM Evaluation Hub

A modern web application for evaluating and interacting with multiple Language Learning Models (LLMs). Built with React, TypeScript, and Tailwind CSS.

## Features

- **Model Evaluation**: Test and compare different LLM models
- **MetaChat**: Chat with multiple models simultaneously
- **Development Mode**: Work on UI/UX with mock data without requiring an Ollama server
- **Responsive Design**: Beautiful, modern interface that works on all devices
- **Model Filtering**: Search and filter models by name and family
- **Real-time Chat**: Interactive chat interface with typing indicators and response times

## Prerequisites

- Docker
- Node.js 18+ (for local development)
- Ollama server (for production use)

## Quick Start with Docker

### Development Mode (with mock data)

```bash
docker build --build-arg DEVMODE=true -t llm-evaluation-hub .
docker run -p 80:80 llm-evaluation-hub
```

### Production Mode (requires Ollama)

```bash
docker build --build-arg DEVMODE=false -t llm-evaluation-hub .
docker run -p 80:80 llm-evaluation-hub
```

The application will be available at `http://localhost:80`

## Environment Variables

- `VITE_DEVMODE`: Toggle development mode (mock data) or production mode (Ollama)
- `VITE_API_URL`: External API endpoint (optional)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Docker Configuration

The project includes a multi-stage Dockerfile that:
1. Builds the application in a Node.js container
2. Serves the built files using Nginx
3. Includes proper caching and compression settings
4. Supports development/production mode toggle

### Custom Docker Build

You can customize the build using build arguments:

```bash
docker build \
  --build-arg DEVMODE=true \
  -t llm-evaluation-hub:custom .
```

### Running with Custom Configuration

```bash
docker run \
  -p 8080:80 \
  -e VITE_API_URL=http://your-api-url \
  llm-evaluation-hub
```

## Features

### Evaluation Tab
- Select and evaluate multiple LLM models
- Filter models by name and family
- View detailed model information
- Run evaluations with custom parameters

### MetaChat Tab
- Chat with multiple models simultaneously
- Reply to specific models
- View response times and typing indicators
- Collapsible participants sidebar
- Real-time chat interface

### Settings Tab
- Toggle development/production mode
- Configure Ollama server connection
- Set evaluation parameters
- Customize model behavior

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.