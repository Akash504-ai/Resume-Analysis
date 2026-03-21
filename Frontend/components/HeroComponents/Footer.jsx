"use client";

import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#020010] mt-0">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Top */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <h3 className="text-white text-2xl font-bold mb-3">
              Nexus<span className="text-pink-500">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered platform helping developers improve resumes,
              identify skill gaps, and prepare smarter for interviews.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Features</li>
              <li>How It Works</li>
              <li>Community</li>
              <li>Roadmap</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Documentation</li>
              <li>FAQ</li>
              <li>Support</li>
              <li>Open Source</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>

            <div className="flex gap-4 text-gray-400">

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Github />
              </a>

              <a
                href="#"
                className="hover:text-white transition"
              >
                <Twitter />
              </a>

              <a
                href="#"
                className="hover:text-white transition"
              >
                <Linkedin />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-6 text-gray-500 text-sm">

          <span>© {new Date().getFullYear()} Nexus AI. All rights reserved.</span>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>

        </div>

      </div>
    </footer>
  );
}