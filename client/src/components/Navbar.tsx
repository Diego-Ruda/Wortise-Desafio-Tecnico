import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSession } from "../lib/auth";
import { authClient } from "../api/client";

// Iconos vectoriales
const SunIcon = () => (
  <svg className="w-5 h-5 text-(--accent-100)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5 text-(--text-200)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
  </svg>
);

export function Navbar() {
  // 1. Leer localStorage o preferencia del sistema al iniciar
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  // 2. Aplicar la clase 'dark' al HTML y sincronizar con localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/" });
        },
      },
    });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-(--bg-300) dark:border-(--bg-300) bg-(--bg-100) dark:bg-(--bg-100) transition-colors sticky top-0 z-50">
      <Link
        to="/"
        className="text-xl font-black text-(--primary-200) dark:text-(--primary-100)"
      >
        BlogApp
      </Link>

      <div className="flex items-center gap-4">
        {/* Botón Sol / Luna */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-(--bg-200) dark:bg-(--bg-200) border border-transparent hover:border-(--primary-200) transition-all cursor-pointer"
          title="Cambiar tema"
          type="button"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Lógica de Autenticación */}
        {isPending ? (
          <span className="text-xs text-(--text-200)">...</span>
        ) : session?.user ? (
          <UserDropdown
            userName={session.user.name}
            onSignOut={handleSignOut}
            navigate={navigate}
          />
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-white bg-(--primary-200) rounded-full hover:bg-(--primary-300) transition-colors"
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}

function UserDropdown({
  userName,
  onSignOut,
  navigate,
}: {
  userName: string;
  onSignOut: () => void;
  navigate: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="p-2 rounded-full border border-(--bg-300) dark:border-(--bg-300) hover:border-(--primary-200) dark:hover:border-(--primary-200) text-(--text-100) dark:text-(--text-100) bg-(--bg-200) dark:bg-(--bg-200) transition-all hover:scale-105 flex items-center justify-center cursor-pointer w-10 h-10"
        title="Menú de usuario"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-1 bg-(--bg-100) dark:bg-(--bg-200) text-(--text-100) dark:text-(--text-100) border border-(--bg-300) dark:border-(--bg-300) rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-(--bg-300) dark:border-(--bg-300) mb-1">
            <p className="font-semibold text-xs text-(--text-200)">
              Conectado como
            </p>
            <p className="font-bold text-sm text-(--primary-200) dark:text-(--primary-100) truncate">
              {userName}
            </p>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate({ to: "/dashboard" });
            }}
            className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-(--bg-200) dark:hover:bg-(--bg-300) rounded-lg cursor-pointer transition-colors"
          >
            Panel de control
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg mt-1 border-t border-(--bg-300) dark:border-(--bg-300) cursor-pointer transition-colors"
          >
            Desconectarse
          </button>
        </div>
      )}
    </div>
  );
}