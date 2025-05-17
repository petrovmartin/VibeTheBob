import { User } from "@/types/user";
import { UserAuthNavClient } from "./user-auth-nav-client";

interface UserAuthNavProps {
  user: User;
}

export function UserAuthNav({ user }: UserAuthNavProps) {
  return <UserAuthNavClient user={user} />;
} 