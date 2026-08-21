"use server";

export enum LoginFormStatus {
  pending,
  auth,
  success,
  error,
}

export async function login(data: FormData) {
  console.log(data, LoginFormStatus.auth);
}
