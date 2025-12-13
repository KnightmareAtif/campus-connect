import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { teachers, Teacher, periodTimes } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Clock, Calendar } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => setSelectedTeacher(teacher)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-border">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground">{teacher.name}</h3>
              <p className="text-sm font-medium text-primary">{teacher.subject}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{teacher.cabin}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm">
            <a
              href={`mailto:${teacher.email}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {teacher.officeHours.length} office hours
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Mock timetable for selected teacher
  const getTeacherSchedule = () => {
    return days.map(day => ({
      day,
      periods: [1, 2, 3, 4, 5].map(period => ({
        period,
        hasClass: Math.random() > 0.5,
        isOfficeHour: Math.random() > 0.8,
      })),
    }));
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Teachers</h1>
          <p className="mt-1 text-muted-foreground">
            Find faculty contact information and office hours
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Teachers Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No teachers found matching your search.</p>
          </div>
        )}

        {/* Teacher Details Dialog */}
        <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-border">
                  <AvatarImage src={selectedTeacher?.avatar} alt={selectedTeacher?.name} />
                  <AvatarFallback>{selectedTeacher?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-display text-xl">{selectedTeacher?.name}</span>
                  <p className="text-sm font-normal text-primary">{selectedTeacher?.subject}</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Contact Info */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedTeacher?.email}`} className="text-sm font-medium text-primary hover:underline">
                      {selectedTeacher?.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{selectedTeacher?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3 sm:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cabin</p>
                    <p className="text-sm font-medium">{selectedTeacher?.cabin}</p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-display font-semibold text-foreground">
                  <Clock className="h-5 w-5" />
                  Office Hours
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher?.officeHours.map((hour, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-status-free/10 px-3 py-1.5 text-sm font-medium text-status-free"
                    >
                      {hour}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-display font-semibold text-foreground">
                  <Calendar className="h-5 w-5" />
                  Weekly Schedule
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="p-2 text-left font-medium text-muted-foreground">Period</th>
                        {days.map(day => (
                          <th key={day} className="p-2 text-center font-medium text-foreground">{day.slice(0, 3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map(period => (
                        <tr key={period} className="border-b border-border last:border-0">
                          <td className="p-2 text-muted-foreground">P{period}</td>
                          {days.map(day => {
                            const hasClass = Math.random() > 0.5;
                            const isOfficeHour = !hasClass && Math.random() > 0.7;
                            return (
                              <td key={day} className="p-1 text-center">
                                <span className={`inline-block h-6 w-6 rounded ${
                                  isOfficeHour ? 'bg-status-free/20' :
                                  hasClass ? 'bg-info/20' : 'bg-muted'
                                }`} />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded bg-info/20" /> Teaching
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded bg-status-free/20" /> Office Hours
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded bg-muted" /> Free
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default TeachersPage;
