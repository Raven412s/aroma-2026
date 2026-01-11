// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p>
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy outlines how we collect, use, and
          safeguard your data when you visit our website.
        </p>

        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address,
          phone number, and any other data you submit via our contact or inquiry
          forms.
        </p>

        <h2 className="text-xl font-semibold">How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To respond to inquiries and provide customer service.</li>
          <li>To send reservation confirmations or event details.</li>
          <li>To improve the quality of our services and website.</li>
        </ul>

        <h2 className="text-xl font-semibold">Third-Party Services</h2>
        <p>
          We may use third-party services (such as Formspree) to manage form
          submissions. These services may collect and store data based on their
          privacy policies.
        </p>

        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p>
          You can request to access, modify, or delete your data at any time by
          contacting us via our contact form.
        </p>

        <p>Last updated: July 1, 2025</p>
      </main>
    );
  }
