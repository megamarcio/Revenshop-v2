export interface ExternalAPI {
  id: string;
  name: string;
  description?: string;
  base_url: string;
  auth_type: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';
  api_key?: string;
  headers?: Array<{ name: string; value: string }>;
  is_active: boolean;
  is_mcp_server: boolean;
  mcp_tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  created_at: string;
  updated_at: string;
  observations?: string;
  documentation?: string;
  error_logs?: Array<{
    timestamp: string;
    error: string;
    details: string;
  }>;
  ai_analysis_enabled?: boolean;
  ai_key_id?: string;
}

export interface ExternalAPIEndpoint {
  id: string;
  api_id: string;
  name: string;
  description?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Array<{ name: string; value: string }>;
  parameters?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required: boolean;
    default?: any;
    description?: string;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExternalAPITestHistory {
  id: string;
  api_id: string;
  endpoint_id?: string;
  request_url: string;
  request_method: string;
  request_headers: Record<string, any>;
  request_body?: string;
  response_status: number;
  response_headers: Record<string, any>;
  response_body: string;
  response_time_ms: number;
  is_success: boolean;
  error_message?: string;
  created_at: string;
  error_log?: string;
  ai_analysis?: string;
  ai_suggestions?: string;
  curl_command?: string;
}

export interface MCPServerConfig {
  server_name: string;
  server_description?: string;
  server_version: string;
  capabilities: string[];
  tools: MCPTool[];
  resources: MCPResource[];
  custom_config?: Record<string, any>;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema?: Record<string, any>;
}

export interface MCPResource {
  name: string;
  description: string;
  uri: string;
  mimeType: string;
}

export interface CreateExternalAPIRequest {
  name: string;
  description?: string;
  base_url: string;
  auth_type: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';
  api_key?: string;
  headers?: Array<{ name: string; value: string }>;
  is_active?: boolean;
  is_mcp_server?: boolean;
  mcp_tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  observations?: string;
  documentation?: string;
  ai_analysis_enabled?: boolean;
  ai_key_id?: string;
}

export interface UpdateExternalAPIRequest {
  name?: string;
  description?: string;
  base_url?: string;
  auth_type?: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';
  api_key?: string;
  headers?: Array<{ name: string; value: string }>;
  is_active?: boolean;
  is_mcp_server?: boolean;
  mcp_tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  observations?: string;
  documentation?: string;
  ai_analysis_enabled?: boolean;
  ai_key_id?: string;
}

export interface CreateEndpointRequest {
  api_id: string;
  name: string;
  description?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Array<{ name: string; value: string }>;
  parameters?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required: boolean;
    default?: any;
    description?: string;
  }>;
  is_active?: boolean;
}

export interface UpdateEndpointRequest {
  name?: string;
  description?: string;
  path?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Array<{ name: string; value: string }>;
  parameters?: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required: boolean;
    default?: any;
    description?: string;
  }>;
  is_active?: boolean;
}

export interface TestAPIRequest {
  api_id: string;
  endpoint_id?: string;
  custom_url?: string;
  custom_method?: string;
  custom_headers?: Record<string, any>;
  custom_body?: string;
}

export interface TestAPIResponse {
  success: boolean;
  url: string;
  method: string;
  headers: Record<string, any>;
  response_time_ms: number;
  status: number;
  body: string;
  error?: string;
}

export interface APIFormData {
  name: string;
  description: string;
  base_url: string;
  api_key: string;
  auth_type: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth2';
  headers: { name: string; value: string }[];
  query_params: { name: string; value: string }[];
  is_mcp_server: boolean;
  mcp_config: MCPServerConfig;
}

export interface EndpointFormData {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  headers: { name: string; value: string }[];
  query_params: { name: string; value: string }[];
  body_schema: string;
}

export interface CurlImportData {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface JsonImportData {
  name: string;
  description?: string;
  base_url: string;
  endpoints: Array<{
    name: string;
    path: string;
    method: string;
    headers?: Record<string, string>;
  }>;
}

export interface AIAnalysisResult {
  analysis: string;
  suggestions: string[];
  severity: 'low' | 'medium' | 'high';
  curl_command?: string;
} 