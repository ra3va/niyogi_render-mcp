import { RenderClient } from '../src/renderClient';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RenderClient', () => {
  let client: RenderClient;
  let mockAxiosInstance: any;
  const mockApiKey = 'test-api-key';
  
  // Mock axios.create before creating the client
  beforeEach(() => {
    // Create a mock axios instance with all required methods and properties
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };
    
    // Mock the axios.create method to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Now create the client
    client = new RenderClient(mockApiKey);
    jest.clearAllMocks();
  });

  describe('listServices', () => {
    it('should fetch services successfully', async () => {
      const mockServices = {
        data: [
          {
            id: 'srv-123',
            name: 'Test Service',
            type: 'web_service',
          },
        ],
        cursor: 'next-page',
      };

      // Set up the mock response
      mockAxiosInstance.get.mockResolvedValue({ data: mockServices });

      const result = await client.listServices({ limit: 10 });
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/services', { params: { limit: 10 } });
      expect(result).toEqual(mockServices);
    });
  });

  describe('getService', () => {
    it('should fetch a service by ID', async () => {
      const mockService = {
        data: {
          id: 'srv-123',
          name: 'Test Service',
          type: 'web_service',
        },
      };

      // Set up the mock response
      mockAxiosInstance.get.mockResolvedValue({ data: mockService });

      const result = await client.getService('srv-123');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/services/srv-123');
      expect(result).toEqual(mockService.data);
    });
  });

  describe('deployService', () => {
    it('should deploy a service', async () => {
      const mockDeploy = {
        data: {
          id: 'dep-123',
          status: 'created',
        },
      };

      // Set up the mock response
      mockAxiosInstance.post.mockResolvedValue({ data: mockDeploy });

      const result = await client.deployService('srv-123', { clearCache: true });
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/services/srv-123/deploys', { clearCache: true });
      expect(result).toEqual(mockDeploy.data);
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      // Set up the mock response
      mockAxiosInstance.get.mockResolvedValue({ data: { data: [] } });

      const result = await client.testConnection();
      
      expect(mockAxiosInstance.get).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      // Set up the mock response
      mockAxiosInstance.get.mockRejectedValue(new Error('Connection failed'));

      const result = await client.testConnection();
      
      expect(mockAxiosInstance.get).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
