import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { InstagramIcon, FlickrIcon } from "@/components/icons/social-icons";

export function SiteFooter() {
  return (
    <footer className="bg-dark text-dark-muted">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="inline-block rounded-lg bg-white px-3 py-2">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            We build fast, clean, conversion-focused websites and Shopify
            stores for founders and businesses worldwide.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-dark-muted hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.socials.flickr}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Flickr"
              className="text-dark-muted hover:text-white"
            >
              <FlickrIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.footerLinks.explore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Tools</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.footerLinks.tools.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {siteConfig.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-page text-center text-xs text-dark-muted">
          © {new Date().getFullYear()} {siteConfig.name}. Built to convert.
        </p>
      </div>
    </footer>
  );
}
