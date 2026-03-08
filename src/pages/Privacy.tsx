import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Mail, Phone } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const sections = [
    {
        icon: Database,
        title: "Information We Collect",
        content: [
            "**Personal Information**: When you submit an enquiry, we collect your name, email address, phone number, and details about the educational services you're interested in.",
            "**Usage Data**: We automatically collect information about how you interact with our website, including pages visited, time spent, and referring URLs.",
            "**Cookies**: We use cookies to improve your browsing experience, remember preferences, and analyze site traffic.",
        ],
    },
    {
        icon: Eye,
        title: "How We Use Your Information",
        content: [
            "**Service Delivery**: To respond to your enquiries and provide counseling, visa assistance, scholarship guidance, and other education services.",
            "**Communication**: To send you important updates about your application, visa status, or other services you've engaged with.",
            "**Improvement**: To improve our website, services, and user experience based on aggregated usage patterns.",
            "**Legal Compliance**: To comply with applicable laws and regulations in the countries we operate in.",
        ],
    },
    {
        icon: Shield,
        title: "How We Protect Your Data",
        content: [
            "**Encryption**: All data transmitted between your browser and our servers is encrypted using industry-standard TLS/HTTPS.",
            "**Access Control**: Access to personal data is restricted to authorized staff who need it to perform their job functions.",
            "**Retention**: We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by law.",
            "**Third Parties**: We do not sell, trade, or rent your personal information to third parties without your explicit consent.",
        ],
    },
    {
        icon: Lock,
        title: "Your Rights",
        content: [
            "**Access**: You have the right to request a copy of the personal information we hold about you.",
            "**Correction**: You may request that we correct any inaccurate or incomplete information.",
            "**Deletion**: You may request that we delete your personal data, subject to any legal obligations we may have.",
            "**Opt-Out**: You may opt out of marketing communications at any time by clicking 'unsubscribe' in any email we send you.",
        ],
    },
];

const PrivacyPage = () => {
    usePageMeta({
        title: "Privacy Policy",
        description: "Learn how Akshaya Akademics collects, uses, and protects your personal information.",
        canonicalPath: "/privacy",
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
                                <Shield className="w-4 h-4" />
                                Legal
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Privacy Policy
                            </h1>
                            <p className="text-lg text-white/60 max-w-xl mx-auto">
                                We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
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
                        {/* Intro */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="premium-card p-8 mb-8"
                        >
                            <p className="text-muted-foreground leading-relaxed">
                                Akshaya Akademics ("we", "our", or "us") operates <strong>akshayaakademics.com</strong>. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our services and the choices you have associated with that data.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                By using our website and services, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </motion.div>

                        {/* Sections */}
                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={section.title}
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
                                        {section.content.map((item, i) => {
                                            const [bold, ...rest] = item.split(':');
                                            return (
                                                <li key={i} className="text-muted-foreground leading-relaxed">
                                                    <strong className="text-foreground">{bold}:</strong>
                                                    {rest.join(':')}
                                                </li>
                                            );
                                        })}
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
                            <h2 className="text-xl font-bold text-foreground mb-4">Contact Us About Privacy</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about this Privacy Policy or want to exercise any of your rights, please contact us:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="mailto:info@akshayaakademics.com" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                                    <Mail className="w-4 h-4" />
                                    info@akshayaakademics.com
                                </a>
                                <a href="tel:+919999999999" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
                                    <Phone className="w-4 h-4" />
                                    +91 XXXXX XXXXX
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPage;
