// app/accessibility/page.tsx

export default function AccessibilityPage() {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Accessibility Statement</h1>

        <p>
          We are committed to ensuring that our website is accessible to all users,
          including people with disabilities. Our goal is to provide an inclusive
          and seamless experience for everyone.
        </p>

        <h2 className="text-xl font-semibold">What We’re Doing</h2>
        <ul className="list-disc pl-6">
          <li>Using semantic HTML and ARIA labels for better screen reader support.</li>
          <li>Ensuring color contrast and font readability.</li>
          <li>Maintaining keyboard navigability across the site.</li>
          <li>Responsive design for various screen sizes and assistive tech.</li>
        </ul>

        <h2 className="text-xl font-semibold">Feedback</h2>
        <p>
          If you encounter any accessibility barriers while using our website,
          please contact us. We appreciate your feedback and are committed to
          making improvements.
        </p>

        <p>Last updated: July 1, 2025</p>
      </main>
    );
  }
