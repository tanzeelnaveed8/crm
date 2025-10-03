"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, Users, UserPlus, Briefcase, 
  SquareCheck as CheckSquare, Settings, LogOut, Menu, ChartColumnBig,
  ChevronDown, ChevronUp, PlusCircle,
  Aperture,
  Airplay
} from 'lucide-react';
import { 
  FaWhatsapp, FaDiscord, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, 
  FaGoogleDrive, FaSlack, FaTrello 
} from "react-icons/fa";
import { SiGooglesheets, SiGooglegemini, SiNotion, SiAsana } from "react-icons/si";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Leads', href: '/dashboard/leads', icon: UserPlus },
  { name: 'Deals', href: '/dashboard/deals', icon: Briefcase },
  { name: 'Activities', href: '/dashboard/activities', icon: CheckSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const apps = [
  { name: "WhatsApp", icon: FaWhatsapp, color: "text-green-500", url: "https://web.whatsapp.com", iframe: false },
  { name: "Discord", icon: FaDiscord, color: "text-indigo-500", url: "https://discord.com", iframe: false },
  { name: "Instagram", icon: FaInstagram, color: "text-pink-500", url: "https://www.instagram.com", iframe: false },
  { name: "Facebook", icon: FaFacebook, color: "text-blue-600", url: "https://www.facebook.com", iframe: false },
  { name: "X (Twitter)", icon: FaTwitter, color: "text-black", url: "https://twitter.com", iframe: true },
  { name: "LinkedIn", icon: FaLinkedin, color: "text-sky-600", url: "https://www.linkedin.com", iframe: true },
  { name: "Google Sheets", icon: SiGooglesheets, color: "text-green-600", url: "https://docs.google.com/spreadsheets", iframe: false },
  { name: "Google Drive", icon: FaGoogleDrive, color: "text-blue-500", url: "https://drive.google.com", iframe: false },
  { name: "Gemini AI", icon: SiGooglegemini, color: "text-purple-600", url: "https://gemini.com", iframe: true },
  { name: "Slack", icon: FaSlack, color: "text-pink-600", url: "https://slack.com", iframe: false },
  { name: "Trello", icon: FaTrello, color: "text-blue-500", url: "https://trello.com", iframe: true },
  { name: "Notion", icon: SiNotion, color: "text-black", url: "https://www.notion.so", iframe: false },
  { name: "Asana", icon: SiAsana, color: "text-orange-500", url: "https://asana.com", iframe: true },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);

  // appsNav stores array of app names (serializable)
  const [appsNav, setAppsNav] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const s = localStorage.getItem("appsNav");
        return s ? JSON.parse(s) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // store active app by name (only used for iframe-capable apps)
  const [activeAppName, setActiveAppName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeAppName") || null;
    }
    return null;
  });

  // sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("appsNav", JSON.stringify(appsNav));
    } catch {}
  }, [appsNav]);

  useEffect(() => {
    try {
      if (activeAppName) localStorage.setItem("activeAppName", activeAppName);
      else localStorage.removeItem("activeAppName");
    } catch {}
  }, [activeAppName]);

  // helper: get full app object from name
  const getAppByName = (name?: string | null) => {
    if (!name) return null;
    return apps.find((a) => a.name === name) || null;
  };

  const addAppToSidebar = (app: { name: string }) => {
    if (!appsNav.includes(app.name)) {
      setAppsNav((prev) => [...prev, app.name]);
    }
  };

  const removeAppFromSidebar = (name: string) => {
    setAppsNav((prev) => prev.filter((n) => n !== name));
    if (activeAppName === name) setActiveAppName(null);
  };

  const NavLinks = () => (
    <>
      {/* Apps Dropdown sabse pehle */}
      <div>
        <button
          className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200"
          onClick={() => setAppsOpen((s) => !s)}
        >
          <div className="flex items-center gap-3">
            <Airplay  className="h-5 w-5 text-red-600" />
            <span className="font-medium">Apps</span>
          </div>
          {appsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {appsOpen && (
          <div className="ml-6 mt-2 grid grid-cols-1 gap-2">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.name}
                  className="flex items-center justify-between rounded-lg px-3 py-2 bg-white shadow-sm hover:shadow-md hover:bg-red-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Icon className={`h-5 w-5 ${app.color}`} />
                    {app.name}
                  </div>
                  <button
                    onClick={() => addAppToSidebar(app)}
                    className="text-slate-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Jo apps sidebar me add ho chuki hain */}
      {appsNav.map((name) => {
        const app = getAppByName(name);
        if (!app) return null; // safety
        const Icon = app.icon;
        return (
          <div key={name} className="flex items-center justify-between gap-2">
            <button
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition-all duration-200",
                activeAppName === app.name
                  ? "bg-gradient-to-r from-red-100 to-white text-red-600 shadow-md"
                  : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white"
              )}
              onClick={() => {
                if (app.iframe) {
                  setActiveAppName(app.name);
                } else {
                  // non-iframe apps open in new tab
                  window.open(app.url, "_blank");
                }
              }}
            >
              <Icon className={`h-5 w-5 ${app.color}`} />
              <span className="font-medium">{app.name}</span>
            </button>

            {/* remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeAppFromSidebar(app.name);
              }}
              className="text-sm px-2 py-1 text-slate-400 hover:text-red-600"
              title="Remove"
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* Base navigation ab last me */}
      {baseNavigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-white",
              isActive
                ? "bg-gradient-to-r from-red-100 to-white text-red-600 shadow-md"
                : "text-slate-700"
            )}
            // do not reset activeAppName here — keep iframe open across route changes
            onClick={() => setMobileMenuOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  const activeApp = getAppByName(activeAppName);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-slate-200 lg:bg-white shadow-lg">
          <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
            <ChartColumnBig className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-slate-900 ">Granule CRM</span>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto">
            <NavLinks />
          </nav>

          <div className="border-t border-slate-200 p-4 bg-gradient-to-t from-white to-red-50 rounded-t-xl">
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-900">{profile?.full_name}</p>
              <p className="text-xs text-slate-500">{profile?.email}</p>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 mt-1">
                {profile?.role}
              </span>
            </div>
            <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-600 transition-all" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6 shadow-sm">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
                  <ChartColumnBig className="h-8 w-8 text-red-600" />
                  <span className="text-xl font-bold text-slate-900">Granule CRM</span>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6 transition-all duration-300">
            {activeApp && activeApp.iframe ? (
              <iframe
                src={activeApp.url}
                className="w-full h-full min-h-[600px] rounded-xl shadow-lg border border-slate-200 transition-all duration-300"
                frameBorder={0}
                title={activeApp.name}
              />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
