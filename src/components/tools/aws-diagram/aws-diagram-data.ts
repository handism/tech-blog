// 1. AWSアイコン & カラー プリセット定義
export interface ServicePreset {
  type: string;
  label: string;
  category: string;
  iconUrl: string;
  color: string;
}

export const SERVICE_PRESETS: Record<string, ServicePreset> = {
  EC2: {
    type: 'EC2',
    label: 'EC2 (仮想サーバー)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/EC2.png',
    color: '#FF9900',
  },
  Lambda: {
    type: 'Lambda',
    label: 'Lambda (サーバーレス関数)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/Lambda.png',
    color: '#FF9900',
  },
  ECS: {
    type: 'ECS',
    label: 'ECS (コンテナサービス)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/ElasticContainerService.png',
    color: '#FF9900',
  },
  EKS: {
    type: 'EKS',
    label: 'EKS (Kubernetesサービス)',
    category: 'Compute',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/ElasticKubernetesService.png',
    color: '#FF9900',
  },
  S3: {
    type: 'S3',
    label: 'S3 (オブジェクトストレージ)',
    category: 'Storage',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Storage/SimpleStorageService.png',
    color: '#3F8624',
  },
  EFS: {
    type: 'EFS',
    label: 'EFS (共有ファイルシステム)',
    category: 'Storage',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Storage/ElasticFileSystem.png',
    color: '#3F8624',
  },
  RDS: {
    type: 'RDS',
    label: 'RDS (リレーショナルDB)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/RDS.png',
    color: '#2E7D32',
  },
  DynamoDB: {
    type: 'DynamoDB',
    label: 'DynamoDB (NoSQL DB)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/DynamoDB.png',
    color: '#2E7D32',
  },
  ElastiCache: {
    type: 'ElastiCache',
    label: 'ElastiCache (Redis/Memcached)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/ElastiCache.png',
    color: '#2E7D32',
  },
  Aurora: {
    type: 'Aurora',
    label: 'Aurora (高性能DB)',
    category: 'Database',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Database/Aurora.png',
    color: '#2E7D32',
  },
  VPC: {
    type: 'VPC',
    label: 'VPC (仮想ネットワーク)',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/VPC.png',
    color: '#8C4FFF',
  },
  APIGateway: {
    type: 'APIGateway',
    label: 'API Gateway',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ApplicationIntegration/APIGateway.png',
    color: '#A166FF',
  },
  Route53: {
    type: 'Route53',
    label: 'Route 53 (DNSサービス)',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/Route53.png',
    color: '#8C4FFF',
  },
  CloudFront: {
    type: 'CloudFront',
    label: 'CloudFront (CDN)',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/CloudFront.png',
    color: '#8C4FFF',
  },
  ALB: {
    type: 'ALB',
    label: 'Application Load Balancer',
    category: 'Networking',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/NetworkingContentDelivery/ElasticLoadBalancing.png',
    color: '#8C4FFF',
  },
  SQS: {
    type: 'SQS',
    label: 'SQS (キューイング)',
    category: 'Integration',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ApplicationIntegration/SimpleQueueService.png',
    color: '#FF4F8B',
  },
  SNS: {
    type: 'SNS',
    label: 'SNS (通知サービス)',
    category: 'Integration',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ApplicationIntegration/SimpleNotificationService.png',
    color: '#FF4F8B',
  },
  IAM: {
    type: 'IAM',
    label: 'IAM (アクセス権管理)',
    category: 'Security',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/SecurityIdentityCompliance/IAM.png',
    color: '#D11D25',
  },
  Cognito: {
    type: 'Cognito',
    label: 'Cognito (ユーザー認証)',
    category: 'Security',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/SecurityIdentityCompliance/Cognito.png',
    color: '#D11D25',
  },
  CloudWatch: {
    type: 'CloudWatch',
    label: 'CloudWatch (監視)',
    category: 'Management',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/ManagementGovernance/CloudWatch.png',
    color: '#4B5E78',
  },
  SecretsManager: {
    type: 'SecretsManager',
    label: 'Secrets Manager',
    category: 'Security',
    iconUrl:
      'https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/SecurityIdentityCompliance/SecretsManager.png',
    color: '#D11D25',
  },
};

// 2. データ型定義
export interface AWSNode {
  id: string;
  name: string;
  type: string;
  subgraphId?: string;
}

export interface AWSSubgraph {
  id: string;
  name: string;
  type: 'VPC' | 'PublicSubnet' | 'PrivateSubnet' | 'ECSCluster' | 'General';
  parentId?: string;
}

export interface AWSEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  style: 'solid' | 'dashed' | 'bold';
}

// 3. テンプレート（プリセット）定義
export const TEMPLATES = {
  threeTier: {
    name: '3層Webシステム',
    description:
      'ALB、Webサーバー、RDSで構成されるAWSの最も典型的な3層システム。VPCとパブリック・プライベートサブネットで境界線を定義します。',
    subgraphs: [
      { id: 'vpc1', name: 'Production VPC (10.0.0.0/16)', type: 'VPC' as const },
      {
        id: 'pubsub1',
        name: 'Public Subnet (10.0.1.0/24)',
        type: 'PublicSubnet' as const,
        parentId: 'vpc1',
      },
      {
        id: 'privsub1',
        name: 'Private Subnet (10.0.2.0/24)',
        type: 'PrivateSubnet' as const,
        parentId: 'vpc1',
      },
    ],
    nodes: [
      { id: 'dns', name: 'Route 53 (DNS)', type: 'Route53' },
      { id: 'cdn', name: 'CloudFront (CDN)', type: 'CloudFront' },
      { id: 'alb', name: 'Application Load Balancer', type: 'ALB', subgraphId: 'pubsub1' },
      { id: 'web1', name: 'Web EC2 01', type: 'EC2', subgraphId: 'privsub1' },
      { id: 'web2', name: 'Web EC2 02', type: 'EC2', subgraphId: 'privsub1' },
      { id: 'db1', name: 'Aurora Master', type: 'RDS', subgraphId: 'privsub1' },
    ],
    edges: [
      { id: 'e1', from: 'dns', to: 'cdn', label: 'DNS Resolve', style: 'solid' as const },
      { id: 'e2', from: 'cdn', to: 'alb', label: 'HTTPS', style: 'solid' as const },
      { id: 'e3', from: 'alb', to: 'web1', label: 'HTTP / 80', style: 'solid' as const },
      { id: 'e4', from: 'alb', to: 'web2', label: 'HTTP / 80', style: 'solid' as const },
      { id: 'e5', from: 'web1', to: 'db1', label: 'SQL / 3306', style: 'dashed' as const },
      { id: 'e6', from: 'web2', to: 'db1', label: 'SQL / 3306', style: 'dashed' as const },
    ],
  },
  serverless: {
    name: 'サーバーレスAPI',
    description:
      'API Gateway、Lambda、DynamoDBで構築された、サーバー管理不要で高スケールなAPI構成。',
    subgraphs: [{ id: 'security_boundary', name: '認証バウンダリ', type: 'General' as const }],
    nodes: [
      { id: 'client', name: 'Client App', type: 'Route53' },
      { id: 'apigw', name: 'API Gateway', type: 'APIGateway' },
      { id: 'cognito', name: 'Cognito Auth', type: 'Cognito', subgraphId: 'security_boundary' },
      { id: 'auth_func', name: 'Authorizer Lambda', type: 'Lambda' },
      { id: 'data_func', name: 'Data Processor Lambda', type: 'Lambda' },
      { id: 'dynamodb', name: 'User DynamoDB', type: 'DynamoDB' },
      { id: 's3_bucket', name: 'Assets Bucket', type: 'S3' },
    ],
    edges: [
      { id: 'e1', from: 'client', to: 'apigw', label: 'HTTPS /api/*', style: 'solid' as const },
      { id: 'e2', from: 'apigw', to: 'cognito', label: 'Verify User', style: 'dashed' as const },
      {
        id: 'e3',
        from: 'apigw',
        to: 'auth_func',
        label: 'Custom Authorize',
        style: 'solid' as const,
      },
      { id: 'e4', from: 'apigw', to: 'data_func', label: 'Proxy Request', style: 'solid' as const },
      { id: 'e5', from: 'data_func', to: 'dynamodb', label: 'Read/Write', style: 'solid' as const },
      {
        id: 'e6',
        from: 'data_func',
        to: 's3_bucket',
        label: 'Upload File',
        style: 'dashed' as const,
      },
    ],
  },
  ecsContainers: {
    name: 'ECSコンテナ & キャッシュ',
    description:
      'Fargateコンテナで稼働するECSサービスと、データベースへのクエリ負荷を下げるためのRedisキャッシュ構成。',
    subgraphs: [
      { id: 'vpc', name: 'App VPC (172.16.0.0/16)', type: 'VPC' as const },
      { id: 'pub_sub', name: 'Public Subnet', type: 'PublicSubnet' as const, parentId: 'vpc' },
      {
        id: 'priv_sub',
        name: 'App Private Subnet',
        type: 'PrivateSubnet' as const,
        parentId: 'vpc',
      },
      {
        id: 'ecs_cluster',
        name: 'ECS Cluster (Fargate)',
        type: 'ECSCluster' as const,
        parentId: 'priv_sub',
      },
    ],
    nodes: [
      { id: 'alb', name: 'Public ALB', type: 'ALB', subgraphId: 'pub_sub' },
      { id: 'task1', name: 'Container Task 01', type: 'ECS', subgraphId: 'ecs_cluster' },
      { id: 'task2', name: 'Container Task 02', type: 'ECS', subgraphId: 'ecs_cluster' },
      { id: 'redis', name: 'Redis Cache', type: 'ElastiCache', subgraphId: 'priv_sub' },
      { id: 'db', name: 'Aurora Serverless', type: 'RDS', subgraphId: 'priv_sub' },
    ],
    edges: [
      { id: 'e1', from: 'alb', to: 'task1', label: 'Target Group', style: 'solid' as const },
      { id: 'e2', from: 'alb', to: 'task2', label: 'Target Group', style: 'solid' as const },
      { id: 'e3', from: 'task1', to: 'redis', label: 'Get Cache', style: 'solid' as const },
      { id: 'e4', from: 'task2', to: 'redis', label: 'Get Cache', style: 'solid' as const },
      { id: 'e5', from: 'task1', to: 'db', label: 'Read/Write', style: 'dashed' as const },
      { id: 'e6', from: 'task2', to: 'db', label: 'Read/Write', style: 'dashed' as const },
    ],
  },
};
