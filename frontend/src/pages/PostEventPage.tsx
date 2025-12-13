import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { CalendarIcon, Clock, MapPin, Eye, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const PostEventPage = () => {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

  const handlePublish = () => {
    if (!eventName || !description || !date || !time || !venue) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields before publishing.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Event published!',
      description: 'Your event has been posted successfully.',
    });

    // Reset form
    setEventName('');
    setDescription('');
    setDate(undefined);
    setTime('');
    setVenue('');
    setIsPreview(false);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl"
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Post Event</h1>
          <p className="mt-1 text-muted-foreground">
            Create a new event for your followers
          </p>
        </div>

        {isPreview ? (
          <div className="space-y-6">
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <p className="text-sm font-medium text-accent">Preview</p>
                <CardTitle className="font-display text-2xl">{eventName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{description}</p>

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{date ? format(date, 'EEE, MMM d, yyyy') : 'No date'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{time || 'No time'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{venue || 'No venue'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsPreview(false)} className="flex-1">
                Edit
              </Button>
              <Button onClick={handlePublish} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Publish Event
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  placeholder="e.g., Annual Hackathon 2024"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell people what this event is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  placeholder="e.g., Main Auditorium"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPreview(true)}
                  className="flex-1"
                  disabled={!eventName}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button onClick={handlePublish} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default PostEventPage;
