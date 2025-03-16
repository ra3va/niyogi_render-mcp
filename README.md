# Render MCP Server

Deploy to [Render.com](https://render.com) directly through AI assistants.

This MCP (Model Context Protocol) server allows AI assistants like Claude to interact with the Render API, enabling deployment and management of services on Render.com.

## Features

- List all services in your Render account
- Get details of a specific service
- Deploy services
- Create new services
- Delete services
- Get deployment history
- Manage environment variables
- Manage custom domains

## Installation

```bash
npm install -g @niyogi/render-mcp
```

## Configuration

1. Get your Render API key from [Render Dashboard](https://dashboard.render.com/account/api-keys)
2. Configure the MCP server with your key:

```bash
render-mcp configure --api-key=YOUR_API_KEY
```

Alternatively, you can run `render-mcp configure` without the `--api-key` flag to be prompted for your API key.

## Usage

### Starting the Server

```bash
render-mcp start
```

### Checking Configuration

```bash
render-mcp config
```

### Running Diagnostics

```bash
render-mcp doctor
```

## Using with Different AI Assistants

### Using with Cline

1. Add the following to your Cline MCP settings file:
   ```json
   {
     "mcpServers": {
       "render": {
         "command": "render-mcp",
         "args": ["start"],
         "env": {
           "RENDER_API_KEY": "your-render-api-key"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

2. Restart Cline for the changes to take effect
3. You can now interact with Render through Claude:
   ```
   Claude, please deploy my web service to Render
   ```

### Using with Windsurf/Cursor

1. Install the render-mcp package:
   ```bash
   npm install -g @niyogi/render-mcp
   ```

2. Configure your API key:
   ```bash
   render-mcp configure --api-key=YOUR_API_KEY
   ```

3. Start the MCP server in a separate terminal:
   ```bash
   render-mcp start
   ```

4. In Windsurf/Cursor settings, add the Render MCP server:
   - Server Name: render
   - Server Type: stdio
   - Command: render-mcp
   - Arguments: start

5. You can now use the Render commands in your AI assistant

### Using with Claude API Integrations

For custom applications using Claude's API directly:

1. Ensure the render-mcp server is running:
   ```bash
   render-mcp start
   ```

2. In your application, when sending messages to Claude via the API, include the MCP server connections in your request:

   ```json
   {
     "mcpConnections": [
       {
         "name": "render",
         "transport": {
           "type": "stdio",
           "command": "render-mcp",
           "args": ["start"]
         }
       }
     ]
   }
   ```

3. Claude will now be able to interact with your Render MCP server

## Example Prompts

Here are some example prompts you can use with Claude once the MCP server is connected:

- "List all my services on Render"
- "Deploy my web service with ID srv-123456"
- "Create a new static site on Render from my GitHub repo"
- "Show me the deployment history for my service"
- "Add an environment variable to my service"
- "Add a custom domain to my service"

## Development

### Building from Source

```bash
git clone https://github.com/niyogi/render-mcp.git
cd render-mcp
npm install
npm run build
```

### Running Tests

```bash
npm test
```

## License

MIT
