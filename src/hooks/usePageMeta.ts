import { useEffect } from 'react';

interface PageMetaOptions {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalPath?: string;
}

const SITE_NAME = 'Akshaya Akademics';
const DEFAULT_OG_IMAGE = '/akshaya-logo.png';
const BASE_URL = 'https://akshayaakademics.com';

const setMeta = (property: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, property);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

const setLink = (rel: string, href: string) => {
    let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
};

export const usePageMeta = ({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage = DEFAULT_OG_IMAGE,
    canonicalPath,
}: PageMetaOptions) => {
    useEffect(() => {
        const fullTitle = `${title} | ${SITE_NAME}`;

        // Document title
        document.title = fullTitle;

        // Standard meta
        setMeta('description', description);

        // Open Graph
        setMeta('og:title', ogTitle ?? fullTitle, true);
        setMeta('og:description', ogDescription ?? description, true);
        setMeta('og:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`, true);
        setMeta('og:type', 'website', true);
        if (canonicalPath) {
            setMeta('og:url', `${BASE_URL}${canonicalPath}`, true);
        }

        // Twitter Card
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', ogTitle ?? fullTitle);
        setMeta('twitter:description', ogDescription ?? description);
        setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

        // Canonical link
        if (canonicalPath) {
            setLink('canonical', `${BASE_URL}${canonicalPath}`);
        }

        return () => {
            // Restore site default on unmount
            document.title = SITE_NAME;
        };
    }, [title, description, ogTitle, ogDescription, ogImage, canonicalPath]);
};
