"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";
import { ConversationsClient } from "./ConversationsClient";
import { MessageSquare, Menu } from "lucide-react";
import { AdminMobileMenuContext } from "@/components/admin/AdminShell";

interface Props {
  initialConversations: any[];
  unreadMap: Record<string, number>;
  children: React.ReactNode;
}

export function ConversationsSplitLayout({ initialConversations, unreadMap, children }: Props) {
  const pathname = usePathname();
  const hasDetail = pathname !== "/admin/conversations";
  const openMobileMenu = useContext(AdminMobileMenuContext);

  return (
    <div className="flex h-full">
      {/* Left: conversation list */}
      <div
        className={`${
          hasDetail ? "hidden lg:flex" : "flex"
        } w-full lg:w-[320px] shrink-0 flex-col border-r border-border overflow-hidden`}
      >
        {/* Mobile header — same style as AdminShell, hidden when detail is open */}
        {!hasDetail && (
          <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 border-b border-border shrink-0">
            <button
              onClick={openMobileMenu}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold">Conversations</h1>
          </div>
        )}
        <ConversationsClient
          initialConversations={initialConversations}
          unreadMap={unreadMap}
        />
      </div>

      {/* Right: conversation detail or empty state */}
      <div className={`${hasDetail ? "flex" : "hidden lg:flex"} flex-1 flex-col min-w-0`}>
        {hasDetail ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
