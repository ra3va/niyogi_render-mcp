/**
 * JSON Schema definitions for MCP tool inputs
 */

export const listServicesSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of services to return (default: 20, max: 100)"
        },
        cursor: {
          type: "string",
          description: "Pagination cursor for fetching next page"
        }
      },
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const getServiceSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The ID of the service to retrieve"
        }
      },
      required: ["serviceId"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const deployServiceSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The ID of the service to deploy"
        },
        clearCache: {
          type: "boolean",
          description: "Whether to clear cache before deploy (default: false)"
        }
      },
      required: ["serviceId"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const createServiceSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["web_service", "static_site", "private_service", "background_worker", "cron_job"],
          description: "Type of service to create"
        },
        name: {
          type: "string",
          description: "Name of the service"
        },
        ownerId: {
          type: "string",
          description: "ID of the owner (user or team)"
        },
        repo: {
          type: "string",
          description: "URL of the repo to deploy from"
        },
        branch: {
          type: "string",
          description: "Branch to deploy (default: main)"
        },
        envVars: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" }
            },
            required: ["key", "value"]
          },
          description: "Environment variables for the service"
        },
        buildCommand: {
          type: "string",
          description: "Command to build the service"
        },
        startCommand: {
          type: "string",
          description: "Command to start the service (web services only)"
        },
        publishPath: {
          type: "string",
          description: "Path to publish (static sites only)"
        },
        plan: {
          type: "string",
          enum: ["free", "starter", "starter_plus", "standard", "standard_plus", "pro", "pro_plus"],
          description: "Service plan (default: free)"
        },
        region: {
          type: "string",
          description: "Region to deploy to"
        },
        numInstances: {
          type: "number",
          description: "Number of instances (default: 1)"
        },
        autoDeploy: {
          type: "boolean",
          description: "Whether to auto-deploy on push (default: true)"
        }
      },
      required: ["type", "name", "ownerId", "repo"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const deleteServiceSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The ID of the service to delete"
        }
      },
      required: ["serviceId"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const getDeploysSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The ID of the service to get deploys for"
        },
        limit: {
          type: "number",
          description: "Number of deploys to return (default: 20, max: 100)"
        },
        cursor: {
          type: "string",
          description: "Pagination cursor for fetching next page"
        }
      },
      required: ["serviceId"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const manageEnvVarsSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The ID of the service to manage env vars for"
        },
        envVars: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" }
            },
            required: ["key", "value"]
          },
          description: "Environment variables to set"
        }
      },
      required: ["serviceId", "envVars"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};

export const manageDomainsSchema = {
  type: "object",
  properties: {
    params: {
      type: "object",
      properties: {
        serviceId: {
          type: "string",
          description: "The ID of the service to manage domains for"
        },
        action: {
          type: "string",
          enum: ["add", "remove", "list"],
          description: "Action to perform"
        },
        domain: {
          type: "string",
          description: "Domain name (required for add/remove)"
        }
      },
      required: ["serviceId", "action"],
      additionalProperties: false
    }
  },
  required: ["params"],
  additionalProperties: false
};
