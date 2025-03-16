import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { RenderClient } from './renderClient.js';
import { getApiKey } from './config.js';
import {
  createServiceSchema,
  deleteServiceSchema,
  deployServiceSchema,
  getDeploysSchema,
  getServiceSchema,
  listServicesSchema,
  manageDomainsSchema,
  manageEnvVarsSchema
} from './types/toolSchemas.js';

/**
 * Start the MCP server
 */
export async function startServer(): Promise<void> {
  console.error('Starting Render MCP server...');
  
  try {
    // Get API key
    const apiKey = await getApiKey();
    
    // Create Render client
    const renderClient = new RenderClient(apiKey);
    
    // Create MCP server
    const server = new Server(
      {
        name: 'render-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    // Set up tool handlers
    setupToolHandlers(server, renderClient);
    
    // Set up error handler
    server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };
    
    // Handle process signals
    process.on('SIGINT', async () => {
      await server.close();
      process.exit(0);
    });
    
    // Connect to transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('Render MCP server running on stdio');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

/**
 * Set up tool handlers for the MCP server
 * @param server MCP server
 * @param renderClient Render API client
 */
function setupToolHandlers(server: Server, renderClient: RenderClient): void {
  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'list_services',
        description: 'List all services in your Render account',
        inputSchema: listServicesSchema,
      },
      {
        name: 'get_service',
        description: 'Get details of a specific service',
        inputSchema: getServiceSchema,
      },
      {
        name: 'deploy_service',
        description: 'Deploy a service',
        inputSchema: deployServiceSchema,
      },
      {
        name: 'create_service',
        description: 'Create a new service',
        inputSchema: createServiceSchema,
      },
      {
        name: 'delete_service',
        description: 'Delete a service',
        inputSchema: deleteServiceSchema,
      },
      {
        name: 'get_deploys',
        description: 'Get deployment history for a service',
        inputSchema: getDeploysSchema,
      },
      {
        name: 'manage_env_vars',
        description: 'Manage environment variables for a service',
        inputSchema: manageEnvVarsSchema,
      },
      {
        name: 'manage_domains',
        description: 'Manage custom domains for a service',
        inputSchema: manageDomainsSchema,
      },
    ],
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      if (!request.params.arguments) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Tool arguments are required'
        );
      }

      switch (request.params.name) {
        case 'list_services':
          return await handleListServices(renderClient, request.params.arguments.params);
        
        case 'get_service':
          return await handleGetService(renderClient, request.params.arguments.params);
        
        case 'deploy_service':
          return await handleDeployService(renderClient, request.params.arguments.params);
        
        case 'create_service':
          return await handleCreateService(renderClient, request.params.arguments.params);
        
        case 'delete_service':
          return await handleDeleteService(renderClient, request.params.arguments.params);
        
        case 'get_deploys':
          return await handleGetDeploys(renderClient, request.params.arguments.params);
        
        case 'manage_env_vars':
          return await handleManageEnvVars(renderClient, request.params.arguments.params);
        
        case 'manage_domains':
          return await handleManageDomains(renderClient, request.params.arguments.params);
        
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    } catch (error) {
      console.error(`Error handling tool call ${request.params.name}:`, error);
      
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });
}

/**
 * Handle list_services tool
 */
async function handleListServices(renderClient: RenderClient, params: any) {
  const { limit, cursor } = params || {};
  const services = await renderClient.listServices({ limit, cursor });
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(services, null, 2),
      },
    ],
  };
}

/**
 * Handle get_service tool
 */
async function handleGetService(renderClient: RenderClient, params: any) {
  try {
    const { serviceId } = params;
    console.error(`Getting service details for ${serviceId}`);
    
    // Get the service details
    const service = await renderClient.getService(serviceId);
    
    // Log the response for debugging
    console.error(`Service response: ${JSON.stringify(service)}`);
    
    // Check if service object is defined
    if (!service) {
      throw new Error('Service response is undefined');
    }
    
    // Format the response
    const responseText = JSON.stringify(service, null, 2);
    
    // Return a properly formatted response
    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  } catch (error) {
    console.error('Get service error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error getting service details: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle deploy_service tool
 */
async function handleDeployService(renderClient: RenderClient, params: any) {
  try {
    const { serviceId, clearCache } = params;
    console.error(`Deploying service ${serviceId} with clearCache=${clearCache}`);
    
    // Deploy the service
    const deploy = await renderClient.deployService(serviceId, clearCache ? { clearCache } : {});
    
    // Log the response for debugging
    console.error(`Deploy response: ${JSON.stringify(deploy)}`);
    
    // Check if deploy object is defined
    if (!deploy) {
      throw new Error('Deployment response is undefined');
    }
    
    // Create a simple success message
    let successMessage = `Successfully deployed service ${serviceId}.`;
    
    // Add deployment details if available
    if (deploy.id) {
      successMessage += ` Deployment ID: ${deploy.id}`;
    }
    
    if (deploy.status) {
      successMessage += `, Status: ${deploy.status}`;
    }
    
    // Return a properly formatted response
    return {
      content: [
        {
          type: 'text',
          text: successMessage,
        },
      ],
    };
  } catch (error) {
    console.error('Deploy service error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error deploying service: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle create_service tool
 */
async function handleCreateService(renderClient: RenderClient, params: any) {
  const service = await renderClient.createService(params);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(service, null, 2),
      },
    ],
  };
}

/**
 * Handle delete_service tool
 */
async function handleDeleteService(renderClient: RenderClient, params: any) {
  const { serviceId } = params;
  await renderClient.deleteService(serviceId);
  
  return {
    content: [
      {
        type: 'text',
        text: `Service ${serviceId} deleted successfully`,
      },
    ],
  };
}

/**
 * Handle get_deploys tool
 */
async function handleGetDeploys(renderClient: RenderClient, params: any) {
  const { serviceId, limit, cursor } = params;
  const deploys = await renderClient.getDeploys(serviceId, { limit, cursor });
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(deploys, null, 2),
      },
    ],
  };
}

/**
 * Handle manage_env_vars tool
 */
async function handleManageEnvVars(renderClient: RenderClient, params: any) {
  const { serviceId, envVars } = params;
  const service = await renderClient.updateEnvVars(serviceId, envVars);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(service, null, 2),
      },
    ],
  };
}

/**
 * Handle manage_domains tool
 */
async function handleManageDomains(renderClient: RenderClient, params: any) {
  const { serviceId, action, domain } = params;
  
  switch (action) {
    case 'list': {
      const domains = await renderClient.listCustomDomains(serviceId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(domains, null, 2),
          },
        ],
      };
    }
    
    case 'add': {
      if (!domain) {
        throw new Error('Domain name is required for add action');
      }
      
      const result = await renderClient.addCustomDomain(serviceId, domain);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
    
    case 'remove': {
      if (!domain) {
        throw new Error('Domain ID is required for remove action');
      }
      
      await renderClient.removeCustomDomain(serviceId, domain);
      return {
        content: [
          {
            type: 'text',
            text: `Domain ${domain} removed successfully from service ${serviceId}`,
          },
        ],
      };
    }
    
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
