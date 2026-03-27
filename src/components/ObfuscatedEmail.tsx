"use client";

import { useState, useEffect } from "react";

interface ObfuscatedEmailProps {
  user: string;
  domain: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ObfuscatedEmail({
  user,
  domain,
  className,
  style,
}: ObfuscatedEmailProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(`${user}@${domain}`);
  }, [user, domain]);

  if (!email) {
    return (
      <span className={className} style={style}>
        [Please enable JavaScript]
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${email}`;
      }}
    >
      {email}
    </a>
  );
}
