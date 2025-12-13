import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { studentTimetable, periodTimes, TimeSlot } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Save, Edit3, X } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const periods = [1, 2, 3, 4, 5];

const TimetablePage = () => {
  const [timetable, setTimetable] = useState<TimeSlot[]>(studentTimetable);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const { toast } = useToast();

  const getSlot = (day: typeof days[number], period: number) => {
    return timetable.find(slot => slot.day === day && slot.period === period);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot.id);
    setEditSubject(slot.subject || '');
  };

  const handleSaveSlot = (slotId: string) => {
    setTimetable(prev =>
      prev.map(slot =>
        slot.id === slotId
          ? { ...slot, subject: editSubject || null }
          : slot
      )
    );
    setEditingSlot(null);
    setEditSubject('');
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditSubject('');
  };

  const handleSaveTimetable = () => {
    setIsEditing(false);
    toast({
      title: 'Timetable saved!',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Timetable</h1>
            <p className="mt-1 text-muted-foreground">View and manage your weekly schedule</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveTimetable}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Timetable
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Timetable Grid */}
        <Card className="hidden overflow-hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-left font-medium text-muted-foreground">Time</th>
                    {days.map(day => (
                      <th key={day} className="p-4 text-left font-medium text-foreground">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map(period => (
                    <tr key={period} className="border-b border-border last:border-0">
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="font-medium">Period {period}</div>
                        <div className="text-xs">{periodTimes[period - 1]}</div>
                      </td>
                      {days.map(day => {
                        const slot = getSlot(day, period);
                        const isFree = !slot?.subject;
                        const isCurrentlyEditing = editingSlot === slot?.id;

                        return (
                          <td key={`${day}-${period}`} className="p-2">
                            {isCurrentlyEditing ? (
                              <div className="flex flex-col gap-2 rounded-lg border border-primary bg-card p-3">
                                <Input
                                  value={editSubject}
                                  onChange={(e) => setEditSubject(e.target.value)}
                                  placeholder="Subject name (empty = free)"
                                  className="h-8 text-sm"
                                />
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    className="h-7 flex-1 text-xs"
                                    onClick={() => handleSaveSlot(slot!.id)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 flex-1 text-xs"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  'rounded-lg p-3 transition-all',
                                  isFree
                                    ? 'bg-status-free/10 text-status-free'
                                    : 'bg-info/10 text-info',
                                  isEditing && 'cursor-pointer hover:ring-2 hover:ring-primary'
                                )}
                                onClick={() => isEditing && slot && handleEditSlot(slot)}
                              >
                                {isFree ? (
                                  <p className="text-sm font-medium">Free</p>
                                ) : (
                                  <>
                                    <p className="font-medium text-foreground">{slot?.subject}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{slot?.room}</p>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Timetable */}
        <div className="grid gap-4 md:hidden">
          {days.map(day => (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {periods.map(period => {
                  const slot = getSlot(day, period);
                  const isFree = !slot?.subject;

                  return (
                    <div
                      key={period}
                      className={cn(
                        'flex items-center justify-between rounded-lg p-3',
                        isFree ? 'bg-status-free/10' : 'bg-info/10'
                      )}
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">{periodTimes[period - 1]}</p>
                        <p className={cn('font-medium', isFree ? 'text-status-free' : 'text-foreground')}>
                          {isFree ? 'Free' : slot?.subject}
                        </p>
                        {slot?.room && <p className="text-xs text-muted-foreground">{slot.room}</p>}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-status-free/20" />
            <span className="text-sm text-muted-foreground">Free Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-info/20" />
            <span className="text-sm text-muted-foreground">Class</span>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default TimetablePage;
