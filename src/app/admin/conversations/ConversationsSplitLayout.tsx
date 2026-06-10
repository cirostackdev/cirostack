"use client";

import { usePathname } from "next/navigation";
import { ConversationsClient } from "./ConversationsClient";
import { MessageSquare } from "lucide-react";

interface Props {
  initialConversations: any[];
  unreadMap: Record<string, number>;
  children: React.ReactNode;
}

export function ConversationsSplitLayout({ initialConversations, unreadMap, children }: Props) {
  const pathname = usePathname();
  const hasDetail = pathname !== "/admin/conversations";

  return (
    <div className="flex h-full">
      {/* Left: conversation list */}
      <div
        className={`${
          hasDetail ? "hidden lg:flex" : "flex"
        } w-full lg:w-[320px] shrink-0 flex-col border-r border-border overflow-hidden`}
      >
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
