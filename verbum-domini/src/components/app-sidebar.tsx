"use client";

import { Home, BookOpen, Library, Settings, ChevronRight, User, LogOut, LogIn, ChevronUp } from "lucide-react";
import { api } from "~/trpc/react";
import { useLastRead } from "~/hooks/use-last-read";
import { useSession, signOut, signIn } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "~/components/ui/sidebar";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function AppSidebar() {
  const { data: books } = api.bible.getBooks.useQuery();
  const { data: session } = useSession();
  const lastRead = useLastRead();

  const oldTestament = books?.filter((b) => b.testament === "OLD") ?? [];
  const newTestament = books?.filter((b) => b.testament === "NEW") ?? [];

  const mainItems = [
    {
      title: "Sanctuary",
      url: "/",
      icon: Home,
    },
    {
      title: "Bible",
      url: lastRead ? `/bible/${lastRead.book}/${lastRead.chapter}` : "/bible",
      icon: BookOpen,
    },
    {
      title: "My Library",
      url: "/library",
      icon: Library,
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-indigo-900 font-bold tracking-tighter uppercase text-[10px]">Verbum Domini</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Books of the Bible</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Old Testament */}
              <Collapsible className="group/collapsible" defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Old Testament">
                      <BookOpen className="opacity-50" />
                      <span>Old Testament</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {oldTestament.map((book: any) => (
                        <SidebarMenuSubItem key={book.id}>
                          <SidebarMenuSubButton asChild>
                            <Link href={`/bible/${book.abbreviation_case_insensitive}/1`}>
                              <span className={book.isDeuterocanonical ? "text-amber-700 font-medium" : ""}>
                                {book.name}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* New Testament */}
              <Collapsible className="group/collapsible" defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="New Testament">
                      <BookOpen className="opacity-50" />
                      <span>New Testament</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {newTestament.map((book: any) => (
                        <SidebarMenuSubItem key={book.id}>
                          <SidebarMenuSubButton asChild>
                            <Link href={`/bible/${book.abbreviation_case_insensitive}/1`}>
                              <span>{book.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  {session?.user ? (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                        <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                          {session.user.name?.charAt(0) ?? <User size={16} />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-semibold">{session.user.name}</span>
                        <span className="truncate text-xs text-slate-500">Lumen Christi</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <User className="h-8 w-8 p-1.5 bg-slate-100 rounded-lg text-slate-500" />
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-semibold">Guest</span>
                        <span className="truncate text-xs text-slate-500">Sign in to sync</span>
                      </div>
                    </>
                  )}
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                sideOffset={4}
              >
                {session?.user ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => signOut()}
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="cursor-pointer" onClick={() => signIn("google")}>
                    <LogIn size={16} className="mr-2" />
                    <span>Sign in with Google</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
