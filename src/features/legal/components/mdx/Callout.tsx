import React from "react";

interface CalloutProps {
  type?: "info" | "warning" | "danger" | "success";
  children: React.ReactNode;
}

export function Callout({ type = "info", children }: CalloutProps) {
  const styles = {
    info: "bg-black/[0.03] border-black/20 text-black/70",
    warning: "bg-black/[0.03] border-black/30 text-black/70",
    danger: "bg-black/[0.03] border-black/40 text-black/80",
    success: "bg-black/[0.03] border-black/20 text-black/70",
  };

  const styleClass = styles[type] || styles.info;

  return (
    <div className={`not-prose my-6 w-full max-w-[47rem] rounded-md border-l-4 p-4 text-sm ${styleClass}`}>
      <div className="prose-sm prose-p:my-1 prose-strong:font-semibold">
        {children}
      </div>
    </div>
  );
}
