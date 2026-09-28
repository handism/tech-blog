import { describe, it, expect } from 'vitest';
import {
  generateMermaidCode,
  generateNodeId,
  isDiagramIdTaken,
  removeNode,
  removeSubgraph,
  sanitizeDiagramId,
} from '../src/components/tools/aws-diagram/aws-diagram-utils';
import {
  AWSNode,
  AWSSubgraph,
  AWSEdge,
} from '../src/components/tools/aws-diagram/aws-diagram-data';

describe('generateMermaidCode', () => {
  it('should generate flowchart header with direction', () => {
    const result = generateMermaidCode({
      nodes: [],
      subgraphs: [],
      edges: [],
      direction: 'TD',
    });
    expect(result).toContain('flowchart TD');
    expect(result).toContain('classDef vpc');
  });

  it('should render root level nodes with correct preset style', () => {
    const nodes: AWSNode[] = [{ id: 'ec2_1', name: 'Web Server', type: 'EC2' }];
    const result = generateMermaidCode({
      nodes,
      subgraphs: [],
      edges: [],
      direction: 'LR',
    });

    expect(result).toContain(
      "ec2_1[\"<img src='https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/main/dist/Compute/EC2.png'"
    );
    expect(result).toContain('style ec2_1 fill:#ffffff,stroke:#FF9900');
  });

  it('should render subgraphs and nested nodes', () => {
    const subgraphs: AWSSubgraph[] = [
      { id: 'vpc1', name: 'VPC-1', type: 'VPC' },
      { id: 'subnet1', name: 'Public-Subnet', type: 'PublicSubnet', parentId: 'vpc1' },
    ];
    const nodes: AWSNode[] = [
      { id: 'alb1', name: 'LoadBalancer', type: 'ALB', subgraphId: 'subnet1' },
    ];

    const result = generateMermaidCode({
      nodes,
      subgraphs,
      edges: [],
      direction: 'TD',
    });

    expect(result).toContain('subgraph vpc1 [" VPC-1 "]');
    expect(result).toContain('subgraph subnet1 [" Public-Subnet "]');
    expect(result).toContain('class vpc1 vpc');
    expect(result).toContain('class subnet1 pubSubnet');
    expect(result).toContain('alb1["<img');
  });

  it('should render connections with correct connector styles', () => {
    const nodes: AWSNode[] = [
      { id: 'n1', name: 'Node 1', type: 'EC2' },
      { id: 'n2', name: 'Node 2', type: 'RDS' },
    ];
    const edges: AWSEdge[] = [
      { id: 'e1', from: 'n1', to: 'n2', label: 'SQL', style: 'dashed' },
      { id: 'e2', from: 'n1', to: 'n2', style: 'bold' },
    ];

    const result = generateMermaidCode({
      nodes,
      subgraphs: [],
      edges,
      direction: 'TD',
    });

    expect(result).toContain('n1 -.->|SQL| n2');
    expect(result).toContain('n1 ==> n2');
  });
});

describe('diagram state helpers', () => {
  const nodes: AWSNode[] = [
    { id: 'ec2_1', name: 'Web', type: 'EC2', subgraphId: 'vpc1' },
    { id: 'rds_1', name: 'DB', type: 'RDS' },
  ];
  const subgraphs: AWSSubgraph[] = [
    { id: 'vpc1', name: 'VPC', type: 'VPC' },
    { id: 'sub1', name: 'Subnet', type: 'PublicSubnet', parentId: 'vpc1' },
  ];
  const edges: AWSEdge[] = [
    { id: 'e1', from: 'ec2_1', to: 'rds_1', style: 'solid' },
    { id: 'e2', from: 'rds_1', to: 'ec2_1', style: 'dashed' },
  ];

  it('sanitizeDiagramId strips characters invalid for Mermaid ids', () => {
    expect(sanitizeDiagramId('  my-node 1! ')).toBe('mynode1');
  });

  it('isDiagramIdTaken checks both nodes and subgraphs', () => {
    expect(isDiagramIdTaken('ec2_1', nodes, subgraphs)).toBe(true);
    expect(isDiagramIdTaken('vpc1', nodes, subgraphs)).toBe(true);
    expect(isDiagramIdTaken('free', nodes, subgraphs)).toBe(false);
  });

  it('generateNodeId numbers by type and avoids collisions', () => {
    expect(generateNodeId('RDS', nodes, subgraphs)).toBe('rds_2');
    const clashing: AWSNode[] = [...nodes, { id: 'ec2_2', name: 'x', type: 'Lambda' }];
    expect(generateNodeId('EC2', clashing, subgraphs)).toBe('ec2_2_1');
  });

  it('removeNode drops the node and its connected edges', () => {
    const result = removeNode('ec2_1', nodes, edges);
    expect(result.nodes.map((n) => n.id)).toEqual(['rds_1']);
    expect(result.edges).toEqual([]);
  });

  it('removeSubgraph moves members and child groups to the root', () => {
    const result = removeSubgraph('vpc1', nodes, subgraphs);
    expect(result.subgraphs).toEqual([{ id: 'sub1', name: 'Subnet', type: 'PublicSubnet' }]);
    expect(result.nodes.find((n) => n.id === 'ec2_1')?.subgraphId).toBeUndefined();
  });
});
