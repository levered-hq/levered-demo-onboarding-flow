"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import LoginModal from "./LoginModal";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="bg-background border-b border-border">
        <div className="container mx-auto flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-foreground">Hay</div>
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <p className="text-sm text-foreground">{session.user?.email}</p>
                <Button variant="outline" onClick={() => signOut()}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsLoginModalOpen(true)}>Login</Button>
            )}
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
