import { PortalSessionProvider } from "./PortalSessionProvider";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalSessionProvider>
      {children}
    </PortalSessionProvider>
  );
}
