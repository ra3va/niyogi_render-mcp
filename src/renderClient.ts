import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  CreateServiceRequest,
  CustomDomain,
  DeployRequest,
  EnvVar,
  PaginatedResponse,
  PaginationParams,
  RenderDeploy,
  RenderService
} from './types/renderTypes.js';

/**
 * Client for interacting with the Render API
 */
export class RenderClient {
  private client: AxiosInstance;
  private apiKey: string;

  /**
   * Create a new Render API client
   * @param apiKey Render API key
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.render.com/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const { status, data } = error.response;
          const message = data?.message || 'Unknown error';
          
          throw new Error(`Render API error (${status}): ${message}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from Render API');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(`Error setting up request: ${error.message}`);
        }
      }
    );
  }

  /**
   * List all services
   * @param params Pagination parameters
   * @returns List of services
   */
  async listServices(params?: PaginationParams): Promise<PaginatedResponse<RenderService>> {
    const config: AxiosRequestConfig = {};
    if (params) {
      config.params = params;
    }
    
    const response = await this.client.get<PaginatedResponse<RenderService>>('/services', config);
    return response.data;
  }

  /**
   * Get a service by ID
   * @param serviceId Service ID
   * @returns Service details
   */
  async getService(serviceId: string): Promise<RenderService> {
    const response = await this.client.get<ApiResponse<RenderService>>(`/services/${serviceId}`);
    return response.data.data;
  }

  /**
   * Create a new service
   * @param service Service creation request
   * @returns Created service
   */
  async createService(service: CreateServiceRequest): Promise<RenderService> {
    const response = await this.client.post<ApiResponse<RenderService>>('/services', service);
    return response.data.data;
  }

  /**
   * Delete a service
   * @param serviceId Service ID
   * @returns Success status
   */
  async deleteService(serviceId: string): Promise<boolean> {
    await this.client.delete(`/services/${serviceId}`);
    return true;
  }

  /**
   * Deploy a service
   * @param serviceId Service ID
   * @param options Deploy options
   * @returns Deploy details
   */
  async deployService(serviceId: string, options?: DeployRequest): Promise<RenderDeploy> {
    const response = await this.client.post<ApiResponse<RenderDeploy>>(
      `/services/${serviceId}/deploys`,
      options || {}
    );
    return response.data.data;
  }

  /**
   * Get deploys for a service
   * @param serviceId Service ID
   * @param params Pagination parameters
   * @returns List of deploys
   */
  async getDeploys(serviceId: string, params?: PaginationParams): Promise<PaginatedResponse<RenderDeploy>> {
    const config: AxiosRequestConfig = {};
    if (params) {
      config.params = params;
    }
    
    const response = await this.client.get<PaginatedResponse<RenderDeploy>>(
      `/services/${serviceId}/deploys`,
      config
    );
    return response.data;
  }

  /**
   * Update environment variables for a service
   * @param serviceId Service ID
   * @param envVars Environment variables
   * @returns Updated service
   */
  async updateEnvVars(serviceId: string, envVars: EnvVar[]): Promise<RenderService> {
    const response = await this.client.put<ApiResponse<RenderService>>(
      `/services/${serviceId}/env-vars`,
      { envVars }
    );
    return response.data.data;
  }

  /**
   * List custom domains for a service
   * @param serviceId Service ID
   * @returns List of custom domains
   */
  async listCustomDomains(serviceId: string): Promise<CustomDomain[]> {
    const response = await this.client.get<ApiResponse<CustomDomain[]>>(
      `/services/${serviceId}/custom-domains`
    );
    return response.data.data;
  }

  /**
   * Add a custom domain to a service
   * @param serviceId Service ID
   * @param domain Domain name
   * @returns Added custom domain
   */
  async addCustomDomain(serviceId: string, domain: string): Promise<CustomDomain> {
    const response = await this.client.post<ApiResponse<CustomDomain>>(
      `/services/${serviceId}/custom-domains`,
      { name: domain }
    );
    return response.data.data;
  }

  /**
   * Remove a custom domain from a service
   * @param serviceId Service ID
   * @param domainId Domain ID
   * @returns Success status
   */
  async removeCustomDomain(serviceId: string, domainId: string): Promise<boolean> {
    await this.client.delete(`/services/${serviceId}/custom-domains/${domainId}`);
    return true;
  }

  /**
   * Test the API connection
   * @returns True if connection is successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listServices({ limit: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
