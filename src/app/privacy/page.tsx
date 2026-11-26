"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="flex flex-col gap-8 pb-10">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-quietide-card text-quietide-muted hover:text-quietide-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-quietide-soft">Privacy</h1>
          <p className="text-sm text-quietide-muted">Quietide · last updated November 2026</p>
        </div>
      </div>

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-quietide-primary/15 text-quietide-primary">
        <Shield className="h-7 w-7" />
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-quietide-muted">
        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Summary</h2>
          <p>
            Quietide is private by design. We do not run accounts, analytics, or a backend that
            stores your sessions. What you do in the app stays on your device unless you choose
            to export it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Data we do not collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>No name, email, or phone number</li>
            <li>No account or login</li>
            <li>No advertising identifiers or third-party trackers</li>
            <li>No cloud sync of sleep, focus, or mood data</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Data on your device</h2>
          <p>
            Preferences, session history, sound mixes, and mood check-ins are stored locally
            (for example in the browser or app storage on this phone). You can export sessions
            as JSON from Settings, clear history, or uninstall the app to remove local data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Network use</h2>
          <p>
            The web app may load updates and assets when you are online. After pages are opened
            once, Quietide is designed to work offline via a service worker. The optional native
            Android build does not send session content to our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Hosting</h2>
          <p>
            The public website may be hosted on platforms such as Vercel. Those providers may log
            standard technical requests (IP, user agent) as part of serving the site. That is not
            used by Quietide to identify you or build profiles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Children</h2>
          <p>
            Quietide is a general calm tool. We do not knowingly collect personal information from
            children. There is no registration flow.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-quietide-soft">Contact</h2>
          <p>
            Questions about this policy: open an issue on the project repository on GitHub
            (seyi-code/quietide) or contact the maintainer listed there.
          </p>
        </section>
      </div>

      <p className="text-center text-xs text-quietide-muted">
        <Link href="/about/" className="text-quietide-primary hover:underline">
          About Quietide
        </Link>
        {" · "}
        <Link href="/" className="text-quietide-primary hover:underline">
          Home
        </Link>
      </p>
    </main>
  );
}
