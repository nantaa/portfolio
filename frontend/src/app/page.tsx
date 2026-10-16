import { fetchProjects, fetchSettings } from "@/lib/api";
import HomeClient from "@/components/HomeClient";

// Server component: fetches data, passes to client shell
export default async function Home() {
  const [projects, settings] = await Promise.all([
    fetchProjects(),
    fetchSettings(),
  ]);

  return <HomeClient projects={projects} settings={settings} />;
}
