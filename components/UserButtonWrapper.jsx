// components/UserButtonWrapper.jsx
'use client';
import { UserButton } from "@clerk/nextjs";

export default function UserButtonWrapper() {
  return (
    <UserButton
      appearance={{
        elements: { avatarBox: "w-10 h-10" }
      }}
    />
  );
}
