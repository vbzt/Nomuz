import { apiFetch } from "./client";

export async function readOne(info:string) {
  return apiFetch(`/users/${info}`, { method: "GET"})
}