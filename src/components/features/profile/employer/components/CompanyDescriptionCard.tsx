import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit } from 'lucide-react';

interface CompanyDescriptionCardProps {
    description?: string;
    onEditClick: () => void;
}

export function CompanyDescriptionCard({ description, onEditClick }: CompanyDescriptionCardProps) {
    return (
        <Card className="glass-enhanced transition-all duration-300 hover:shadow-xl">
            <CardHeader>
                <CardTitle>About the Company</CardTitle>
                <CardDescription>Organization overview and culture</CardDescription>
            </CardHeader>
            <CardContent>
                {description ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
                ) : (
                    <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            No company description yet. Add one to attract top healthcare talent!
                        </p>
                        <Button variant="outline" onClick={onEditClick}>
                            <Edit className="h-4 w-4 mr-2" />
                            Add Description
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
