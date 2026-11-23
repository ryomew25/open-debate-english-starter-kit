import { Link } from "react-router";
import { ArrowLeft, MessageSquare } from "lucide-react";

const SECTIONS = [
  {
    title: "Section 1. Purpose",
    body: `These Terms of Service (the “Terms”) set out the conditions for using Open Debate (the “Service”). By accessing or using the Service, you agree to these Terms.`,
  },
  {
    title: "Section 2. Registration",
    body: `The demo sign-in asks for a nickname (2–20 characters) and does not provide password-based or verified account authentication. The nickname and activity are stored in the current browser's localStorage by this front-end template. They are not shared with other users through this template. Do not enter sensitive personal information.`,
  },
  {
    title: "Section 3. Prohibited Conduct",
    items: [
      "Harassment, defamation, threats, or discriminatory statements toward others",
      "Posting sexual, violent, or otherwise harmful content",
      "Publishing personal information such as names, addresses, or phone numbers",
      "Spam, repeated unsolicited posts, or actions that overload the Service",
      "Infringing copyrights, trademarks, or other intellectual property rights",
      "Violating applicable laws or public order and accepted standards of conduct",
      "Any other conduct that the Service operator considers inappropriate",
    ],
  },
  {
    title: "Section 4. User Content",
    body: `Users retain the copyright to content they post to the Service. However, users grant the Service operator permission to use and display that content to the extent necessary to operate the Service.`,
  },
  {
    title: "Section 5. Suspension or Changes to the Service",
    body: `The Service operator may suspend or modify the Service without prior notice when maintenance, inspections, or emergency response are necessary; when natural disasters, power outages, or technical failures make operation difficult; or when other unavoidable operational circumstances arise. The Service operator is not liable for damages caused by suspension or modification of the Service.`,
  },
  {
    title: "Section 6. Disclaimer",
    body: `This Service is an experimental project that uses mock data. The Service operator does not guarantee that the Service is complete, accurate, or useful. Disputes between users must be resolved by the parties involved. The Service operator is not responsible for intervening, mediating, or paying damages in such disputes.`,
  },
  {
    title: "Section 7. Reports and Moderation",
    body: `The demo includes a report form and a local moderation dashboard. Report submissions are stored in the current browser only; this template does not include a server-side review workflow, user suspension system, or production moderation service. Add and test those systems before operating a public service.`,
  },
  {
    title: "Section 8. Privacy",
    body: `This starter template stores demo nicknames and app activity in the current browser's localStorage. It does not include a backend, server-side account system, or cross-device synchronization. Before deploying a customized version, review your hosting provider, analytics, integrations, and applicable privacy requirements, then replace this sample notice with an accurate privacy policy.`,
  },
  {
    title: "Section 9. Changes to These Terms",
    body: `The Service operator may update these Terms without prior notice when considered necessary. Updated Terms take effect when published within the Service. Continued use of the Service after publication constitutes acceptance of the updated Terms.`,
  },
  {
    title: "Section 10. Governing Law and Jurisdiction",
    body: `These Terms are governed by the laws of Japan. The Tokyo District Court will have exclusive jurisdiction as the court of first instance over disputes relating to the Service. This is sample wording and must be reviewed for the jurisdiction in which your own service operates.`,
  },
];

export function Terms() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <span className="text-[17px] font-semibold">Terms of Service</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Hero */}
        <div className="flex flex-col items-center text-center pt-4 pb-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-[14px] mb-4 shadow-sm">
            <MessageSquare className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight mb-2">
            Open Debate Terms of Service
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Last updated: November 22, 2026
          </p>
        </div>

        {/* Intro card */}
        <div className="bg-primary/8 rounded-[16px] px-5 py-4">
          <p className="text-[15px] leading-relaxed text-foreground/80">
            Please read these Terms of Service carefully before using the Service. By accessing or using the Service, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="premium-panel px-5 py-5"
            >
              <h2 className="text-[17px] font-semibold mb-3 text-foreground">
                {section.title}
              </h2>
              {section.body && (
                <p className="text-[15px] leading-relaxed text-foreground/75">
                  {section.body}
                </p>
              )}
              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-foreground/75 leading-relaxed">
                      <span className="mt-[3px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center pt-4">
          <p className="text-[13px] text-muted-foreground">
            For questions, use the report feature or contact the service administrator.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-[15px] font-medium text-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
