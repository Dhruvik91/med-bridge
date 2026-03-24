'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Briefcase, DollarSign, Heart, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobSwipeCardProps {
  job: Job;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
  style?: React.CSSProperties;
}

export function JobSwipeCard({ job, onSwipeLeft, onSwipeRight, onTap, style }: JobSwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
  };

  const formatSalary = (min?: string | number, max?: string | number) => {
    if (!min && !max) return 'Competitive';
    const minVal = min ? `$${Number(min).toLocaleString()}` : '';
    const maxVal = max ? `$${Number(max).toLocaleString()}` : '';
    if (minVal && maxVal) return `${minVal} - ${maxVal}`;
    return minVal || maxVal;
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        cursor: 'grab',
        ...style,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute w-full"
    >
      <Card className="overflow-hidden shadow-2xl border-2 bg-card">
        <CardHeader className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 line-clamp-2">
                {job.title}
              </h3>
              {job.organization && (
                <p className="text-lg text-muted-foreground font-medium">
                  {job.organization.name}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {job.specialties?.slice(0, 3).map((specialty) => (
                <Badge key={specialty.id} variant="secondary" className="text-xs">
                  {specialty.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {job.location?.city || 'Location not specified'}
                {job.location?.state && `, ${job.location.state}`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="capitalize">{job.jobType.replace('_', ' ')}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {job.description}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onSwipeLeft();
              }}
            >
              <X className="h-5 w-5 mr-2" />
              Skip
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-4"
              onClick={(e) => {
                e.stopPropagation();
                onTap();
              }}
            >
              <Info className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                onSwipeRight();
              }}
            >
              <Heart className="h-5 w-5 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
