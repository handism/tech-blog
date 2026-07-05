import { describe, expect, it } from 'vitest';
import { extractAwsResources } from '@/src/lib/aws-gallery-server';

describe('extractAwsResources', () => {
  it('extracts a basic AWS resource type', () => {
    const yaml = `
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-12345
`;
    const result = extractAwsResources(yaml);
    expect(result).toEqual([{ type: 'AWS::EC2::Instance', count: 1 }]);
  });

  it('aggregates multiple resources and sorts by count descending', () => {
    const yaml = `
Resources:
  VPC:
    Type: AWS::EC2::VPC
  Subnet1:
    Type: AWS::EC2::Subnet
  Subnet2:
    Type: AWS::EC2::Subnet
  Instance1:
    Type: AWS::EC2::Instance
  Instance2:
    Type: AWS::EC2::Instance
  Instance3:
    Type: AWS::EC2::Instance
`;
    const result = extractAwsResources(yaml);
    expect(result).toEqual([
      { type: 'AWS::EC2::Instance', count: 3 },
      { type: 'AWS::EC2::Subnet', count: 2 },
      { type: 'AWS::EC2::VPC', count: 1 },
    ]);
  });

  it('handles different whitespace variations', () => {
    const yaml = `
Resources:
  Resource1:
    Type:    AWS::S3::Bucket
  Resource2:
\t\tType:\tAWS::DynamoDB::Table
  Resource3:
    Type:AWS::IAM::Role
`;
    const result = extractAwsResources(yaml);

    // Sort array in memory so it's immune to potential alphabetical sorting of the counts
    // Oh wait, count is 1 for all of them so they might be sorted arbitrarily by the runtime.
    // The implementation uses JS sort which is stable, but let's check what it does.
    // Object.entries(resourceMap).map...sort((a, b) => b.count - a.count);
    // If counts are equal, it might retain insertion order (Bucket, Table, Role).
    // Let's sort alphabetically to be safe in the test.
    const sortedResult = result.sort((a, b) => a.type.localeCompare(b.type));

    expect(sortedResult).toEqual([
      { type: 'AWS::DynamoDB::Table', count: 1 },
      { type: 'AWS::IAM::Role', count: 1 },
      { type: 'AWS::S3::Bucket', count: 1 },
    ]);
  });

  it('handles single, double, and no quotes', () => {
    const yaml = `
Resources:
  NoQuotes:
    Type: AWS::ECS::Cluster
  SingleQuotes:
    Type: 'AWS::ECS::Service'
  DoubleQuotes:
    Type: "AWS::ECS::TaskDefinition"
`;
    const result = extractAwsResources(yaml);
    const sortedResult = result.sort((a, b) => a.type.localeCompare(b.type));

    expect(sortedResult).toEqual([
      { type: 'AWS::ECS::Cluster', count: 1 },
      { type: 'AWS::ECS::Service', count: 1 },
      { type: 'AWS::ECS::TaskDefinition', count: 1 },
    ]);
  });

  it('ignores invalid patterns and non-AWS resources', () => {
    const yaml = `
Parameters:
  InstanceType:
    Type: String
    Default: t2.micro
Resources:
  CustomResource:
    Type: Custom::MyResource
  MyInstance:
    Type: AWS::EC2::Instance
`;
    const result = extractAwsResources(yaml);
    expect(result).toEqual([{ type: 'AWS::EC2::Instance', count: 1 }]);
  });

  it('returns empty array for empty string', () => {
    expect(extractAwsResources('')).toEqual([]);
  });

  it('returns empty array when there are no AWS resources', () => {
    const yaml = `
AWSTemplateFormatVersion: '2010-09-09'
Description: Empty template
Resources: {}
`;
    expect(extractAwsResources(yaml)).toEqual([]);
  });
});
