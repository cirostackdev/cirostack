import { PortalSessionProvider } from "./PortalSessionProvider";

export default function PortalLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <PortalSessionProvider>
      <div className="portal-root">
        {children}
        {modal}
      </div>
    </PortalSessionProvider>
  );
}
