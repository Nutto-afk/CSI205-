"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { Button } from "@/components/tailgrids/core/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/tailgrids/core/input-group";
import { EyeDisabled, Keyboard } from "@tailgrids/icons";
import { useRouter } from "next/navigation";
import { login } from "@/data/credentials";
import { getCredentials } from "@/utils/login";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect away from /login to returnPath or home
    const cred = getCredentials();
    if (cred) {
      const returnPath = localStorage.getItem("returnPath") || "/";
      localStorage.removeItem("returnPath");
      router.replace(returnPath);
    }
  }, [router]);

  const handleLogin = () => {
    const userDom = document.getElementById("user") as HTMLInputElement;
    const passDom = document.getElementById("pass") as HTMLInputElement;
    const user = userDom ? userDom.value.trim() : "";
    const pass = passDom ? passDom.value.trim() : "";

    /// Validate
    if (user == "") {
      userDom?.focus();
      alert("ERROR : User is required");
      return;
    }

    if (pass == "") {
      passDom?.focus();
      alert("ERROR: Password is required");
      return;
    }

    const email = user.includes("@") ? user : `${user}@company.com`;
    setLoading(true);

    login(email, pass)
      .then((credentials) => {
        localStorage.setItem("credentials", JSON.stringify(credentials));
        const returnPath = localStorage.getItem("returnPath") || "/";
        localStorage.removeItem("returnPath");
        router.replace(returnPath);
        router.refresh();
      })
      .catch((error) => {
        alert("Login failed: " + error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Backdrop isOpen={true}>
      <Dialog showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Who are you?</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4">
          <InputGroup>
            <InputGroupAddon>
              <Keyboard />
            </InputGroupAddon>
            <InputGroupInput
              id="user"
              placeholder="user | admin | manager"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
            <InputGroupAddon align="inline-end">@company.com</InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <EyeDisabled />
            </InputGroupAddon>
            <InputGroupInput
              id="pass"
              type="password"
              placeholder="pass"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </InputGroup>
        </DialogBody>

        <DialogFooter>
          <Button
            appearance="outline"
            disabled={loading}
            onClick={() => {
              const userDom = document.getElementById(
                "user",
              ) as HTMLInputElement;
              const passDom = document.getElementById(
                "pass",
              ) as HTMLInputElement;
              if (userDom) userDom.value = "";
              if (passDom) passDom.value = "";
              userDom?.focus();
            }}
          >
            Reset
          </Button>
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Backdrop>
  );
}
