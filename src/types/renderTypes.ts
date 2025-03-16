/**
 * Type definitions for Render API responses
 * Based on https://api-docs.render.com/reference/introduction
 */

export interface RenderService {
  id: string;
  name: string;
  type: ServiceType;
  ownerId: string;
  repo: string;
  branch: string;
  autoDeploy: boolean;
  suspended: boolean;
  suspenders: string[];
  serviceDetails: ServiceDetails;
  updatedAt: string;
  createdAt: string;
  slug: string;
  url: string;
}

export enum ServiceType {
  WEB_SERVICE = "web_service",
  STATIC_SITE = "static_site",
  PRIVATE_SERVICE = "private_service",
  BACKGROUND_WORKER = "background_worker",
  CRON_JOB = "cron_job"
}

export interface ServiceDetails {
  env: string;
  plan: string;
  region: string;
  buildCommand: string;
  startCommand?: string;
  publishPath?: string;
  pullRequestPreviewsEnabled?: boolean;
  autoDeploy?: boolean;
  numInstances?: number;
  disk?: {
    id: string;
    name: string;
    mountPath: string;
    sizeGB: number;
  };
}

export interface RenderDeploy {
  id: string;
  commit: {
    id: string;
    message: string;
    createdAt: string;
  };
  status: DeployStatus | string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum DeployStatus {
  CREATED = "created",
  BUILD_IN_PROGRESS = "build_in_progress",
  UPDATE_IN_PROGRESS = "update_in_progress",
  LIVE = "live",
  DEACTIVATED = "deactivated",
  BUILD_FAILED = "build_failed",
  UPDATE_FAILED = "update_failed",
  CANCELED = "canceled"
}

export interface EnvVar {
  key: string;
  value: string;
}

export interface CustomDomain {
  id: string;
  name: string;
  domainType: string;
  publicSuffix: string;
  redirectForName?: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  type: ServiceType;
  name: string;
  ownerId: string;
  repo: string;
  branch?: string;
  envVars?: EnvVar[];
  buildCommand?: string;
  startCommand?: string;
  publishPath?: string;
  plan?: string;
  region?: string;
  numInstances?: number;
  autoDeploy?: boolean;
  pullRequestPreviewsEnabled?: boolean;
}

export interface DeployRequest {
  clearCache?: boolean;
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
}
