import { siteConfig } from '@/src/config/site';

export default function Footer() {
  return (
    <footer className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-text/70">
        <div className="grid justify-items-center gap-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
