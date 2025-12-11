import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Send, Upload, FileText } from 'lucide-react';

interface ApplicationFormProps {
    form: UseFormReturn<any>;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    hasApplied: boolean;
    appliedDate?: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: any) => void;
    onClearResume: (field: any) => void;
    selectedFile: File | null;
}

export const ApplicationForm = ({
    form,
    onSubmit,
    isSubmitting,
    hasApplied,
    appliedDate,
    onFileChange,
    onClearResume,
    selectedFile,
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

                {/* Resume Upload Field */}
                <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                            <FormLabel>
                                Resume <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="resume"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                            onChange={(e) => onFileChange(e, { onChange })}
                                            {...field}
                                        />
                                        {!selectedFile && <Upload className="h-4 w-4 text-muted-foreground" />}
                                    </div>

                                    {/* File info display */}
                                    {selectedFile && (
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                            <div className="flex items-center gap-2 text-sm">
                                                <FileText className="h-4 w-4 text-primary" />
                                                <div>
                                                    <p className="font-medium">{selectedFile.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onClearResume({ onChange })}
                                                className="h-8 px-2"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Required • Accepted formats: PDF, DOC, DOCX • Maximum size: 5MB
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
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
