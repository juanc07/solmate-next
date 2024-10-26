// components/Body.tsx
import { ReactNode } from "react";

interface BodyProps {
    children: ReactNode;
}

export default function Body({ children }: BodyProps) {
    return <main className="flex-grow p-4 bg-gray-100">{children}</main>;
}
