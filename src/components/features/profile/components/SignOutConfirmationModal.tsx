import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SignOutConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function SignOutConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}: SignOutConfirmationModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6 pt-8 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <LogOut className="h-6 w-6 text-destructive" />
                    </div>
                    <AlertDialogHeader className="space-y-2">
                        <AlertDialogTitle className="text-xl font-bold tracking-tight">
                            Sign Out?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed px-2">
                            Are you sure you want to sign out? You will need to sign in again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>
                <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-2 pointer-events-auto">
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 font-semibold tap-scale"
                    >
                        Sign Out
                    </AlertDialogAction>
                    <AlertDialogCancel
                        onClick={onClose}
                        className="w-full h-11 font-medium bg-background border-border/50 hover:bg-accent tap-scale outline-none ring-0 focus:ring-0"
                    >
                        Cancel
                    </AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
