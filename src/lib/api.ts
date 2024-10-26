import { IUser } from "@/lib/interfaces";
import { supabase } from '@/supabaseClient'; // Updated import to use supabaseClient
import { AuthError, Session, User } from "@supabase/supabase-js"; // Import types from Supabase

// Fetch users from an external API
export const fetchUsers = async (): Promise<IUser[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 10 }, // Revalidate every 10 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

// Sign in using Supabase (use signInWithPassword for email/password auth)
export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("SignIn Error: ", error.message);
    throw error;
  }
  const { user, session } = data;
  return { user, session, error };
}

// Sign out using Supabase
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("SignOut Error: ", error.message);
    throw error;
  }
}
