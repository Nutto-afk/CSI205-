import { useRouter } from "next/navigation";
import { logout, type Credentials } from "@/data/credentials";

type Router = ReturnType<typeof useRouter>;

export const checkLogin = (router: Router, returnPath: string) => {
  if (typeof window === "undefined") return;

  const credentialString = localStorage.getItem("credentials");
  if (credentialString != null) {
    try {
      const { token, email, name, role }: Credentials =
        JSON.parse(credentialString);
      if (
        token == undefined ||
        email == undefined ||
        name == undefined ||
        role == undefined
      ) {
        //fail
        localStorage.setItem("returnPath", returnPath);
        router.replace("/login");
        router.refresh();
      } else {
        //sucecess
        if (window.location.pathname !== returnPath) {
          router.replace(returnPath);
          router.refresh();
        }
      }
    } catch {
      //fail
      localStorage.setItem("returnPath", returnPath);
      router.replace("/login");
      router.refresh();
    }
  } else {
    /// fail
    localStorage.setItem("returnPath", returnPath);
    router.replace("/login");
    router.refresh();
  }
};

export const doLogout = (router: Router, returnPath: string = "/login") => {
  if (typeof window === "undefined") return;

  const credentialString = localStorage.getItem("credentials");
  if (credentialString != null) {
    try {
      const { token } = JSON.parse(credentialString);
      if (token != undefined) {
        /// success
        logout(token)
          .then(() => {
            localStorage.removeItem("credentials");
            router.replace(returnPath);
            router.refresh();
          })
          .catch((error) => {
            alert(`Error: ${error}`);
            localStorage.removeItem("credentials");
            router.replace(returnPath);
            router.refresh();
          });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  localStorage.removeItem("credentials");
  router.replace(returnPath);
  router.refresh();
};

export const getCredentials = (): Credentials | null => {
  if (typeof window === "undefined") return null;
  const credentialString = localStorage.getItem("credentials");
  if (!credentialString) return null;
  try {
    const cred: Credentials = JSON.parse(credentialString);
    if (cred.token && cred.email && cred.name && cred.role) {
      return cred;
    }
  } catch {
    return null;
  }
  return null;
};
