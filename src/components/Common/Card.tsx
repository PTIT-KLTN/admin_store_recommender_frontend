import React, { PropsWithChildren } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>;
}
export function CardHeader({ children }: PropsWithChildren<{}>) {
  return <div className="border-b pb-2 mb-2">{children}</div>;
}
export function CardTitle({ children }: PropsWithChildren<{}>) {
  return <h3 className="text-lg font-medium">{children}</h3>;
}
export function CardContent({ children }: PropsWithChildren<{}>) {
  return <div>{children}</div>;
}