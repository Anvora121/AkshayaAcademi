import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText, CreditCard, AlertTriangle, Scale, Mail } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const sections = [
    {
        icon: FileText,
        title: "Acceptance of Terms",
        items: [
            "By accessing and using Akshaya Akademics' website and services, you accept and agree to be bound by these Terms of Service.",
            "If you do not agree with any part of these terms, you may not use our services.",
            "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
            "These terms apply to all visitors, users, and others who access or use the service.",
        ],
    },
    {
        icon: FileText,
        title: "Description of Services",
        items: [
            "Akshaya Akademics provides overseas education counseling, university application assistance, scholarship guidance, visa consultation, and language training services.",
            "Our free tier provides access to general information, university listings, and basic counseling resources.",
            "Our premium membership (₹8,499/year) provides access to exclusive offers, priority counseling, fast-tracked visa assistance, and dedicated success management.",
            "We act as an intermediary to help students connect with universities and relevant service providers. Final decisions and outcomes depend on the institutions and regulatory authorities involved.",
        ],
    },
    {
        icon: CreditCard,
        title: "Payments & Subscriptions",
        items: [
            "Premium plans are billed annually. Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes.",
            "Payments are processed through secure third-party payment gateways. We do not store your full card or payment details.",
            "Refunds may be requested within 7 days of purchase if no premium services have been availed, subject to verification.",
            "Subscription renewals are automatic unless cancelled at least 24 hours before the renewal date.",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Disclaimers & Limitations",
        items: [
            "We do not guarantee admission to any university, approval of any visa, or award of any scholarship. These decisions rest solely with the respective institutions and governments.",
            "Information on our website is provided in good faith and for general informational purposes only. While we strive for accuracy, we cannot guarantee that all information is complete, current, or error-free.",
            "Akshaya Akademics shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.",
            "Our total liability to you for any claims arising out of or related to the services shall not exceed the amount paid by you for the services in the 12 months preceding the claim.",
        ],
    },
    {
        icon: Scale,
        title: "Governing Law & Disputes",
        items: [
            "These Terms shall be governed by and construed in accordance with the laws of India.",
            "Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu, India.",
            "We encourage you to contact us first to resolve any issues before initiating formal legal proceedings.",
            "If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.",
        ],
    },
];

const TermsPage = () => {
    usePageMeta({
        title: "Terms of Service",
        description: "Read the Akshaya Akademics Terms of Service covering usage, payments, disclaimers, and your legal rights.",
        canonicalPath: "/terms",
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main>
                {/* Hero */}
                <section className="pt-20 hero-gradient relative overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-20" />
                    <div className="container mx-auto px-4 relative z-10 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-medium mb-6">
                                <Scale className="w-4 h-4" />
                                Legal
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Terms of Service
                            </h1>
                            <p className="text-lg text-white/60 max-w-xl mx-auto">
                                Please read these terms carefully before using our services. They constitute a legally binding agreement between you and Akshaya Akademics.
                            </p>
                            <p className="text-sm text-white/40 mt-4">
                                Last updated: March 2026
                            </p>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H0Z" fill="hsl(var(--background))" />
                        </svg>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {/* Notice */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="premium-card p-8 mb-8 border-l-4 border-accent"
                        >
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms of Service ("Terms") govern your access to and use of Akshaya Akademics' website and services. By using our services, you agree to these Terms in full. If you disagree with any part of these terms, please do not use our services.
                            </p>
                        </motion.div>

                        {/* Sections */}
                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={`${section.title}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="premium-card p-8"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                            <section.icon className="w-5 h-5 text-accent" />
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {section.items.map((item, i) => (
                                            <li key={`item-${i}`} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                                                <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                                                    {i + 1}
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="premium-card p-8 mt-6"
                        >
                            <h2 className="text-xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <a href="mailto:info@akshayaakademics.com" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                                <Mail className="w-4 h-4" />
                                info@akshayaakademics.com
                            </a>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
