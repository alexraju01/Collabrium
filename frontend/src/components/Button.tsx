import { cn } from "@/lib/classCombine";
import React from "react";

interface buttonProps extends React.ComponentPropsWithoutRef<"button"> {
	children: React.ReactNode;
	className?: string;
}

export function Button({ children, className, ...props }: buttonProps) {
	return (
		<button
			{...props}
			className={cn(
				"rounded-md px-2 p-1 bg-primary hover:brightness-90 transition-all duration-150 cursor-pointer",
				className
			)}>
			{children}
		</button>
	);
}
