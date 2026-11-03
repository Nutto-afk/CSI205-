'use client';
import Link from "next/link";
import { Badge } from "./tailgrids/core/badge";
import { Facebook, Instagram1 } from "@tailgrids/icons";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-6">
      {/* student */}
      <div className="text-center">
        <Badge className="text-base text-gray-800 rounded-lg px-4 py-1.5 shadow-xs">
          68028322 นาย ธนัตถ์ เผื่อนคง
        </Badge>
      </div>

      {/* contact */}
      <div>
        <div className="mt-4 flex items-center justify-center gap-6 text-gray-600">
          <Link
            href="https://www.facebook.com/tanut.phunkong.2024/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-blue-600"
            aria-label="Facebook"
          >
            <Facebook size={20} />
            <span className="text-sm font-medium">Facebook</span>
          </Link>

          <div className="h-4 border-l border-gray-300" />

          <Link
            href="https://www.instagram.com/pk__nutto?rpxt=MWJkeTV2ZGJxbzNzMA=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-sky-500"
            aria-label="Instagram"
          >
            <Instagram1 size={20} />
            <span className="text-sm font-medium">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
