export default function Footer() {
  return (
    <footer className="bg-card py-4">
      <div className="max-w-6xl mx-auto px-4 text-sm text-text/70">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Handism&apos;s Tech Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
