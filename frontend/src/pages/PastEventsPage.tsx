import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { events } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, History } from 'lucide-react';
import { format } from 'date-fns';

const PastEventsPage = () => {
  // Mock past events
  const pastEvents = [
    {
      id: 'past1',
      title: 'Coding Workshop 2023',
      description: 'Intensive Python bootcamp for beginners',
      date: new Date('2023-11-15'),
      time: '10:00 AM',
      venue: 'Lab 301',
      attendees: 45,
    },
    {
      id: 'past2',
      title: 'Annual Tech Fest',
      description: 'Three-day technology festival with competitions and talks',
      date: new Date('2023-10-20'),
      time: '9:00 AM',
      venue: 'Main Campus',
      attendees: 230,
    },
    {
      id: 'past3',
      title: 'AI/ML Seminar',
      description: 'Industry experts sharing insights on AI trends',
      date: new Date('2023-09-05'),
      time: '2:00 PM',
      venue: 'Auditorium',
      attendees: 120,
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Past Events</h1>
          <p className="mt-1 text-muted-foreground">
            View your event history and engagement
          </p>
        </div>

        <div className="space-y-4">
          {pastEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">{event.title}</h3>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(event.date, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-2xl font-bold text-foreground">{event.attendees}</p>
                        <p className="text-xs text-muted-foreground">Attendees</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {pastEvents.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <History className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No past events yet.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default PastEventsPage;
