import { auth } from "@/auth";
import { NavbarClient } from "./navbar-client";

export const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  return <NavbarClient user={user} />;
};