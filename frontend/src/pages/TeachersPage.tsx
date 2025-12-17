import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { teachers, Teacher, periodTimes, teacherClasses, EnrolledStudent, TeacherClass } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Clock, Calendar, Users, Edit, Save, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCurrentTime } from '@/hooks/useCurrentTime';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TeachersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentDay, getCurrentPeriod } = useCurrentTime();
  const periodTimeRanges = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:30', end: '11:30' },
    { start: '11:30', end: '12:30' },
    { start: '14:00', end: '15:00' },
  ];
  const currentPeriod = getCurrentPeriod(periodTimeRanges);
  const isTeacherRole = user?.role === 'teacher';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);
  
  // Teacher profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileEmail, setProfileEmail] = useState('teacher@campus.edu');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 123-4567');
  const [profileCabin, setProfileCabin] = useState('Tech Building, Room 301');
  const [officeHours, setOfficeHours] = useState<string[]>(['Monday 2-4', 'Wednesday 10-12', 'Friday 2-3']);
  const [newOfficeHour, setNewOfficeHour] = useState('');

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your contact details have been saved.',
    });
    setIsEditingProfile(false);
  };

  const handleAddOfficeHour = () => {
    if (newOfficeHour.trim()) {
      setOfficeHours(prev => [...prev, newOfficeHour.trim()]);
      setNewOfficeHour('');
    }
  };

  const handleRemoveOfficeHour = (index: number) => {
    setOfficeHours(prev => prev.filter((_, i) => i !== index));
  };

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

  const StudentCard = ({ student, classInfo }: { student: EnrolledStudent; classInfo: TeacherClass }) => (
    <Card 
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setSelectedStudent(student)}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{student.name}</h4>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>{classInfo.day}</p>
          <p>Period {classInfo.period}</p>
        </div>
      </CardContent>
    </Card>
  );

  // Teacher Dashboard View
  if (isTeacherRole) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile, office hours, and view enrolled students
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="students">My Students</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-border">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-display text-xl">{user?.name}</span>
                      <p className="text-sm font-normal text-primary">Computer Science</p>
                    </div>
                  </CardTitle>
                  <Button
                    variant={isEditingProfile ? 'default' : 'outline'}
                    onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                  >
                    {isEditingProfile ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Details */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditingProfile ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profileEmail}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditingProfile ? (
                        <Input
                          id="phone"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profilePhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cabin">Cabin</Label>
                      {isEditingProfile ? (
                        <Input
                          id="cabin"
                          value={profileCabin}
                          onChange={(e) => setProfileCabin(e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profileCabin}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-display font-semibold text-foreground">
                      <Clock className="h-5 w-5" />
                      Office Hours
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {officeHours.map((hour, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 rounded-full bg-status-free/10 px-3 py-1.5 text-sm font-medium text-status-free"
                        >
                          {hour}
                          {isEditingProfile && (
                            <button
                              onClick={() => handleRemoveOfficeHour(idx)}
                              className="ml-1 rounded-full p-0.5 hover:bg-status-free/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditingProfile && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="e.g., Monday 10-12"
                          value={newOfficeHour}
                          onChange={(e) => setNewOfficeHour(e.target.value)}
                          className="max-w-xs"
                        />
                        <Button size="sm" onClick={handleAddOfficeHour}>
                          <Plus className="mr-1 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <Accordion type="multiple" className="space-y-4">
                {teacherClasses.map((cls, idx) => (
                  <AccordionItem key={idx} value={`class-${idx}`} className="rounded-lg border border-border">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{cls.subject}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {cls.day}, Period {cls.period} • {cls.room}
                        </span>
                        <Badge variant="outline" className="ml-auto">
                          <Users className="mr-1 h-3 w-3" />
                          {cls.students.length} students
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {cls.students.map(student => (
                          <StudentCard key={student.id} student={student} classInfo={cls} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* Student Details Dialog */}
          <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-border">
                    <AvatarImage src={selectedStudent?.avatar} alt={selectedStudent?.name} />
                    <AvatarFallback>{selectedStudent?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-display text-xl">{selectedStudent?.name}</span>
                    <p className="text-sm font-normal text-muted-foreground">{selectedStudent?.email}</p>
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
                      <a href={`mailto:${selectedStudent?.email}`} className="text-sm font-medium text-primary hover:underline">
                        {selectedStudent?.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{selectedStudent?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Student Timetable */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-display font-semibold text-foreground">
                    <Calendar className="h-5 w-5" />
                    Student's Timetable
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="p-2 text-left font-medium text-muted-foreground">Period</th>
                          {days.map(day => (
                            <th 
                              key={day} 
                              className={`p-2 text-center font-medium ${
                                day === currentDay ? 'text-primary' : 'text-foreground'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map(period => (
                          <tr key={period} className="border-b border-border last:border-0">
                            <td className={`p-2 ${currentPeriod === period ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                              P{period}
                            </td>
                            {days.map(day => {
                              const slot = selectedStudent?.timetable.find(
                                s => s.day === day && s.period === period
                              );
                              const isNow = day === currentDay && period === currentPeriod;
                              return (
                                <td key={day} className="p-1 text-center">
                                  {slot?.subject ? (
                                    <span className={`inline-block rounded px-2 py-1 text-xs ${
                                      isNow 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-info/10 text-info'
                                    }`}>
                                      {slot.subject}
                                    </span>
                                  ) : (
                                    <span className={`inline-block h-6 w-6 rounded ${
                                      isNow ? 'bg-status-free/30' : 'bg-muted'
                                    }`} />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </DashboardLayout>
    );
  }

  // Student View (original functionality)
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
                          <th 
                            key={day} 
                            className={`p-2 text-center font-medium ${
                              day === currentDay ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map(period => (
                        <tr key={period} className="border-b border-border last:border-0">
                          <td className={`p-2 ${currentPeriod === period ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                            P{period}
                          </td>
                          {days.map(day => {
                            const hasClass = Math.random() > 0.5;
                            const isOfficeHour = !hasClass && Math.random() > 0.7;
                            const isNow = day === currentDay && period === currentPeriod;
                            return (
                              <td key={day} className="p-1 text-center">
                                <span className={`inline-block h-6 w-6 rounded ${
                                  isNow && isOfficeHour ? 'bg-status-free/40 ring-2 ring-status-free' :
                                  isNow && hasClass ? 'bg-info/40 ring-2 ring-info' :
                                  isNow ? 'bg-muted ring-2 ring-primary' :
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
