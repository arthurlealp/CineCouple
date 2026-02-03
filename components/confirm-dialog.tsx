"use client";

import { useState, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "default";
    onConfirm: () => void | Promise<void>;
    trigger: ReactNode;
}

export function ConfirmDialog({
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    onConfirm,
    trigger,
}: ConfirmDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const variantStyles = {
        danger: "bg-red-500 hover:bg-red-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        default: "bg-primary hover:bg-primary/90",
    };

    return (
        <>
            {/* Trigger */}
            <div onClick={() => setIsOpen(true)}>{trigger}</div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => !loading && setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => !loading && setIsOpen(false)}
                            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="p-6">
                            {/* Icon */}
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === "danger" ? "bg-red-500/10" :
                                    variant === "warning" ? "bg-yellow-500/10" : "bg-primary/10"
                                }`}>
                                <AlertTriangle className={`w-6 h-6 ${variant === "danger" ? "text-red-500" :
                                        variant === "warning" ? "text-yellow-500" : "text-primary"
                                    }`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-center mb-2">{title}</h3>

                            {/* Message */}
                            <p className="text-muted-foreground text-center mb-6">{message}</p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsOpen(false)}
                                    disabled={loading}
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    className={`flex-1 ${variantStyles[variant]}`}
                                    onClick={handleConfirm}
                                    disabled={loading}
                                >
                                    {loading ? "Aguarde..." : confirmText}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
