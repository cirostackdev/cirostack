import { PortalSessionProvider } from "./PortalSessionProvider";

export default function PortalLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <PortalSessionProvider>
      {children}
      {modal}
    </PortalSessionProvider>
  );
}
