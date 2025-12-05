import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit } from 'lucide-react';

interface ProfessionalBioCardProps {
    summary?: string;
    onEditClick: () => void;
}

export function ProfessionalBioCard({ summary, onEditClick }: ProfessionalBioCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Professional Bio</CardTitle>
                <CardDescription>About your experience and expertise</CardDescription>
            </CardHeader>
            <CardContent>
                {summary ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
                ) : (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            No professional bio yet. Add one to showcase your expertise!
                        </p>
                        <Button variant="outline" onClick={onEditClick}>
                            <Edit className="h-4 w-4 mr-2" />
                            Add Bio
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
