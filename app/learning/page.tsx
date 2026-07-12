import { getAllCourses } from '@/src/lib/learning-server';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import LearningDashboard from '@/src/components/LearningDashboard';

export const metadata: Metadata = {
  title: `学習ガイド | ${siteConfig.name}`,
  description:
    'DockerやGitHubなど、エンジニアリングに必要な様々な仕組みを体系的かつ図解で分かりやすく学ぶ学習コンテンツ一覧。',
  alternates: {
    canonical: '/learning',
  },
};

export default async function LearningPage() {
  const courses = await getAllCourses();

  return <LearningDashboard courses={courses} />;
}
