"use client";
import "./globals.css";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createContext, useEffect, useState } from "react";
import { fetchProducts, Product } from "@/data/products";
import { checkLogin, doLogout, getCredentials } from "@/utils/login";
import type { Credentials } from "@/data/credentials";

export const globalDatacontext = createContext<any>(null);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  console.log(pathname);
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<Credentials | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setPageLoading(true);
    const cred = getCredentials();
    setCurrentUser(cred);

    if (pathname === "/login") {
      setIsAuthorized(true);
      setPageLoading(false);
    } else {
      if (!cred) {
        setIsAuthorized(false);
        checkLogin(router, pathname);
      } else {
        setIsAuthorized(true);
        setPageLoading(false);
      }
    }
  }, [pathname, router]);

  return (
    <globalDatacontext.Provider
      value={{ products, setProducts, carts, setCarts }}
    >
      <html lang="en">
        <body className="min-h-screen flex flex-col">
          <Header />

          {/* User Profile Bar (ROLE, NAME, EMAIL) */}
          {currentUser && (
            <div className="flex justify-center items-center gap-3 sm:gap-4 mt-3 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 text-xs">
                  ROLE:
                </span>
                <span className="bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full text-xs">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 text-xs">
                  NAME:
                </span>
                <span className="bg-emerald-50 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full text-xs">
                  {currentUser.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 text-xs">
                  EMAIL:
                </span>
                <span className="bg-slate-100 text-slate-600 font-medium px-2.5 py-0.5 rounded-full text-xs">
                  {currentUser.email}
                </span>
              </div>
            </div>
          )}

          <nav className="flex justify-center items-center mt-4 gap-2 flex-wrap">
            <Link
              href="/"
              className={buttonStyles({
                appearance: pathname === "/" ? "fill" : "outline",
                variant: "primary",
                size: "sm",
              })}
            >
              Home
            </Link>
            <Link href="/animation">
              <Button
                appearance={pathname === "/animation" ? "fill" : "outline"}
                variant="primary"
                size={"sm"}
              >
                Animation
              </Button>
            </Link>
            <Link href="/calculator">
              <Button
                appearance={pathname === "/calculator" ? "fill" : "outline"}
                variant="primary"
                size={"sm"}
              >
                Calculator
              </Button>
            </Link>
            <Link href="/todos">
              <Button
                appearance={pathname === "/todos" ? "fill" : "outline"}
                variant="primary"
                size={"sm"}
              >
                Todos
              </Button>
            </Link>
            <Link
              href="/products"
              className={buttonStyles({
                appearance: pathname === "/products" ? "fill" : "outline",
                variant: "primary",
                size: "sm",
              })}
            >
              Products ({products.length})
            </Link>
            <div className="relative">
              <Link
                href="/carts"
                className={buttonStyles({
                  appearance: pathname === "/carts" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Carts
              </Link>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full text-[11px] font-bold shadow-xs pointer-events-none">
                {carts.length}
              </span>
            </div>
            {currentUser ? (
              <Button
                variant="danger"
                appearance="outline"
                size="sm"
                onClick={() => doLogout(router, "/login")}
              >
                Logout
              </Button>
            ) : (
              <Link
                href="/login"
                className={buttonStyles({
                  appearance: pathname === "/login" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Login
              </Link>
            )}
          </nav>
          <main className="flex-1">
            {pageLoading || (!isAuthorized && pathname !== "/login") ? (
              <div className="flex flex-col justify-center items-center py-28 gap-3 text-neutral-500">
                <Spinner size="lg" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            ) : (
              children
            )}
          </main>
          <Footer />
        </body>
      </html>
    </globalDatacontext.Provider>
  );
}
