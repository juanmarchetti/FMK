import { DirectorLayoutClient } from "./DirectorLayoutClient";

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return <DirectorLayoutClient>{children}</DirectorLayoutClient>;
}