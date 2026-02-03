"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    children,
    className,
    showCloseButton = true,
}: ModalProps) {
    // Fecha com ESC
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl animate-in zoom-in-95 duration-200",
                    className
                )}
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 rounded-lg hover:bg-muted transition-colors z-20"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                )}
                <div className="clear-both">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ModalHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("p-6 pb-0", className)}>
            {children}
        </div>
    );
}

export function ModalBody({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
}

export function ModalFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("p-6 pt-0 flex gap-3 justify-end", className)}>
            {children}
        </div>
    );
}
