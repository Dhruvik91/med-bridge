import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Send, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface ApplicationFormProps {
    form: UseFormReturn<any>;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    hasApplied: boolean;
    appliedDate?: string;
    profileResumeUrl?: string | null;
}

export const ApplicationForm = ({
    form,
    onSubmit,
    isSubmitting,
    hasApplied,
    appliedDate,
    profileResumeUrl,
}: ApplicationFormProps) => {
    if (hasApplied) {
        return (
            <Alert>
                <AlertDescription>
                    You submitted an application on{' '}
                    {appliedDate && new Date(appliedDate).toLocaleDateString()}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Resume Status */}
                <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3">
                        {profileResumeUrl ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">Resume from your profile</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Your resume will be automatically attached from your profile
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-orange-600">Resume required</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Please upload your resume in your profile before applying
                                    </p>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 mt-2 text-xs"
                                        asChild
                                    >
                                        <Link href={FRONTEND_ROUTES.PROFILE.BASE}>
                                            Go to Profile →
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Cover Letter Field */}
                <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Letter (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    placeholder="Tell the employer why you're a great fit for this position..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting || !profileResumeUrl}
                    className="w-full"
                >
                    {isSubmitting ? (
                        'Submitting...'
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                            Submit Application
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};
