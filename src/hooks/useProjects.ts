"use client";

import { useQuery } from "@tanstack/react-query";

export type Project = { id: string; name: string };

async function fetchProjects(): Promise<Project[]> {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` }, });
  if (!res.ok) throw new Error("Ошибка загрузки проектов");
  return res.json();
}

export function useProjects() {
  const query = useQuery({ queryKey: ["projects"],  queryFn: fetchProjects, });
  return { projects: query.data ?? [], isLoading: query.isLoading, };
}