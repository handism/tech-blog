# AWS 2026 draw.io shapeID一覧

draw.ioのmxGraph XMLで使用するAWS 2026公式アイコンのshapeID。
`style`属性の `shape=` に指定する値。

## 基本スタイル（全サービス共通テンプレート）

```
sketch=0;outlineConnect=0;fontColor=#232F3E;gradientColor=none;
fillColor=<SERVICE_COLOR>;strokeColor=none;dashed=0;
verticalLabelPosition=bottom;verticalAlign=top;
align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;
shape=<SHAPE_ID>;
```

---

## コンピューティング（fillColor=#ED7100）

| サービス | shape値 |
|---|---|
| Lambda | `mxgraph.aws4.lambda_function` |
| EC2 Instance | `mxgraph.aws4.ec2_instance` |
| EC2 Auto Scaling Group | `mxgraph.aws4.auto_scaling2` |
| ECS Service | `mxgraph.aws4.ecs` |
| ECS Task | `mxgraph.aws4.ecs` |
| Fargate | `mxgraph.aws4.fargate` |
| Batch | `mxgraph.aws4.batch` |
| EC2 Image Builder | `mxgraph.aws4.image_builder` |
| Elastic Beanstalk | `mxgraph.aws4.elastic_beanstalk` |

## ストレージ（fillColor=#7AA116）

| サービス | shape値 |
|---|---|
| S3 Bucket | `mxgraph.aws4.s3_bucket` |
| S3 Object | `mxgraph.aws4.s3_object` |
| EFS | `mxgraph.aws4.efs` |
| EBS Volume | `mxgraph.aws4.elastic_block_store` |
| Glacier | `mxgraph.aws4.s3_glacier` |
| Backup | `mxgraph.aws4.backup` |
| FSx | `mxgraph.aws4.fsx` |

## データベース（fillColor=#C925D1）

| サービス | shape値 |
|---|---|
| DynamoDB | `mxgraph.aws4.dynamodb` |
| RDS Instance | `mxgraph.aws4.rds` |
| Aurora Cluster | `mxgraph.aws4.aurora` |
| ElastiCache | `mxgraph.aws4.elasticache` |
| Redshift | `mxgraph.aws4.redshift` |
| Neptune | `mxgraph.aws4.neptune` |
| DocumentDB | `mxgraph.aws4.documentdb` |
| MemoryDB | `mxgraph.aws4.memorydb` |

## ネットワーキング（fillColor=#8C4FFF）

| サービス | shape値 |
|---|---|
| VPC | `mxgraph.aws4.vpc` |
| VPC Lattice | `mxgraph.aws4.vpc_lattice` |
| VPC Lattice Service Network | `mxgraph.aws4.vpc_lattice_service_network` |
| Transit Gateway | `mxgraph.aws4.transit_gateway` |
| PrivateLink | `mxgraph.aws4.privatelink` |
| Route 53 | `mxgraph.aws4.route_53` |
| CloudFront | `mxgraph.aws4.cloudfront` |
| ALB | `mxgraph.aws4.application_load_balancer` |
| NLB | `mxgraph.aws4.network_load_balancer` |
| API Gateway | `mxgraph.aws4.api_gateway` |
| Global Accelerator | `mxgraph.aws4.global_accelerator` |
| NAT Gateway | `mxgraph.aws4.nat_gateway` |
| Internet Gateway | `mxgraph.aws4.internet_gateway` |
| Direct Connect | `mxgraph.aws4.direct_connect` |
| VPN Gateway | `mxgraph.aws4.vpn_gateway` |

## セキュリティ（fillColor=#DD344C）

| サービス | shape値 |
|---|---|
| IAM Role | `mxgraph.aws4.role` |
| IAM Policy | `mxgraph.aws4.permissions` |
| Cognito User Pool | `mxgraph.aws4.cognito` |
| KMS | `mxgraph.aws4.key_management_service` |
| Secrets Manager | `mxgraph.aws4.secrets_manager` |
| ACM | `mxgraph.aws4.certificate_manager` |
| WAF | `mxgraph.aws4.waf` |
| Shield | `mxgraph.aws4.shield` |
| GuardDuty | `mxgraph.aws4.guardduty` |
| Security Hub | `mxgraph.aws4.security_hub` |
| Config | `mxgraph.aws4.config` |
| CloudTrail | `mxgraph.aws4.cloudtrail` |

## メッセージング/統合（fillColor=#E7157B）

| サービス | shape値 |
|---|---|
| SQS | `mxgraph.aws4.sqs` |
| SNS | `mxgraph.aws4.sns` |
| EventBridge | `mxgraph.aws4.eventbridge` |
| Kinesis Data Streams | `mxgraph.aws4.kinesis_data_streams` |
| Kinesis Firehose | `mxgraph.aws4.kinesis_data_firehose` |
| Step Functions | `mxgraph.aws4.step_functions` |
| AppSync | `mxgraph.aws4.appsync` |
| MQ | `mxgraph.aws4.mq` |

## モニタリング（fillColor=#759C3E）

| サービス | shape値 |
|---|---|
| CloudWatch | `mxgraph.aws4.cloudwatch_2` |
| CloudWatch Logs | `mxgraph.aws4.cloudwatch_2` |
| CloudWatch Alarms | `mxgraph.aws4.cloudwatch_alarm` |
| X-Ray | `mxgraph.aws4.x_ray` |
| Systems Manager | `mxgraph.aws4.systems_manager` |

## AI/ML（fillColor=#01A88D）

| サービス | shape値 |
|---|---|
| Bedrock | `mxgraph.aws4.bedrock` |
| SageMaker | `mxgraph.aws4.sagemaker` |
| Rekognition | `mxgraph.aws4.rekognition` |
| Textract | `mxgraph.aws4.textract` |

## 管理（fillColor=#E7157B）

| サービス | shape値 |
|---|---|
| CloudFormation | `mxgraph.aws4.cloudformation` |
| Control Tower | `mxgraph.aws4.control_tower` |
| Organizations | `mxgraph.aws4.organizations` |
| CodePipeline | `mxgraph.aws4.codepipeline` |
| CodeBuild | `mxgraph.aws4.codebuild` |
| CodeDeploy | `mxgraph.aws4.codedeploy` |

---

## グループ境界 style一覧

`container=1;collapsible=0;recursiveResize=0;pointerEvents=0;` を共通で追記する。

| 境界 | shape / grIcon | strokeColor |
|---|---|---|
| AWS Cloud | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud` | `#AAB7B8` |
| Region | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_region` | `#00A4A6` |
| VPC | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc` | `#8C4FFF` |
| Availability Zone | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone` | `#00A4A6` |
| Public Subnet | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_public_subnet` | `#7AA116` |
| Private Subnet | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_private_subnet` | `#147EBA` |
| Security Group | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_security_group` | `#DD344C` |
| Auto Scaling Group | `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_auto_scaling_group` | `#ED7100` |

---

## ユーザーアクター

```
shape=mxgraph.aws4.user;fillColor=#232F3D;strokeColor=none;
fontColor=#232F3E;verticalLabelPosition=bottom;verticalAlign=top;align=center;
```

---

## エッジ（矢印）スタイル

```
# 通常（同期）
edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#545B64;fontSize=11;

# 非同期/イベント（破線）
edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1;strokeColor=#545B64;dashed=1;fontSize=11;

# データフロー（赤系）
edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#C925D1;fontSize=11;
```

---

## 注釈ボックス

```
# 情報ノート（青）
rounded=1;whiteSpace=wrap;html=1;fillColor=#E6F2FF;strokeColor=#0066CC;
align=left;verticalAlign=top;fontSize=11;fontStyle=1;

# 警告ノート（黄）
rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF4E6;strokeColor=#D79B00;
align=left;verticalAlign=top;fontSize=11;fontStyle=1;
```
