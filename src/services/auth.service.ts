import { uuid } from "drizzle-orm/gel-core";
import supabase from "../lib/supabaseClient";

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  userType?: string;
  companyName?: string;
  redirectUrl?: string;
}

export const signUp = async (data: SignUpInput) => {
  const { email, password, fullName, phone, userType, companyName, redirectUrl } = data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        company_name: companyName,
        user_type: userType,
        phone: phone,
      },
    },
  });

  if (authError) throw authError;

  const userId = authData.user?.id;

  // Insert into your custom user table
  const { error: insertError } = await supabase
    .from('profiles') // change this to your actual table name
    .insert({
      email: email,
      user_id: userId,
      full_name: fullName,
      phone,
      user_type: userType,
      company_name: companyName,
    });

  if (insertError) throw insertError;

  return { message: "Signup successful", userId };
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};
