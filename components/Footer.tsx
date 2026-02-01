export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-text/70">
        <p className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Handism&apos;s Tech Blog. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text/80 hover:text-text transition"
          >
            Twitter
          </a>
          <a
            href="https://github.com/handism"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text/80 hover:text-text transition"
          >
            GitHub
          </a>
          <a href="/privacy" className="text-text/80 hover:text-text transition">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
