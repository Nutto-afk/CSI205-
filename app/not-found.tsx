"use client";

import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/tailgrids/core/button";

export default function Notfound() {
  const router = useRouter();

  //   useEffect(() => {
  //     checkLogin(router, "/");
  //   }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <h1 className="text-4xl font-extrabold text-neutral-800">404</h1>
      <p className="text-neutral-500 mt-2">Page Not Found</p>
      <Link
        href="/"
        className={buttonStyles({
          variant: "primary",
          appearance: "fill",
          size: "sm",
          className: "mt-4",
        })}
      >
        Back to Home
      </Link>
    </div>
  );
}
