import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { studentTimetable, TimeSlot, teachers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Save, Edit3, X, Settings, Plus, Minus, Clock, User } from 'lucide-react';
import { useCurrentTime } from '@/hooks/useCurrentTime';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

interface PeriodTime {
  start: string;
  end: string;
}

const defaultPeriodTimes: PeriodTime[] = [
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:30', end: '11:30' },
  { start: '11:30', end: '12:30' },
  { start: '14:00', end: '15:00' },
];

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const TimetablePage = () => {
  const [periodCount, setPeriodCount] = useState(5);
  const [periodTimes, setPeriodTimes] = useState<PeriodTime[]>(defaultPeriodTimes);
  const [timetable, setTimetable] = useState<TimeSlot[]>(studentTimetable);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const { currentDay, isTimeInRange } = useCurrentTime();

  // Generate timetable slots when period count changes
  useEffect(() => {
    const existingSlots = new Map(timetable.map(slot => [`${slot.day}-${slot.period}`, slot]));
    const newTimetable: TimeSlot[] = [];
    let idCounter = 100;

    days.forEach(day => {
      for (let period = 1; period <= periodCount; period++) {
        const key = `${day}-${period}`;
        const existing = existingSlots.get(key);
        if (existing) {
          newTimetable.push(existing);
        } else {
          newTimetable.push({
            id: `new-${idCounter++}`,
            day,
            period,
            subject: null,
          });
        }
      }
    });

    setTimetable(newTimetable);
  }, [periodCount]);

  // Ensure periodTimes array matches periodCount
  useEffect(() => {
    if (periodTimes.length < periodCount) {
      const newTimes = [...periodTimes];
      for (let i = periodTimes.length; i < periodCount; i++) {
        const lastEnd = newTimes[i - 1]?.end || '08:00';
        const [hours, mins] = lastEnd.split(':').map(Number);
        const newStart = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        const endHour = hours + 1;
        const newEnd = `${String(endHour).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        newTimes.push({ start: newStart, end: newEnd });
      }
      setPeriodTimes(newTimes);
    } else if (periodTimes.length > periodCount) {
      setPeriodTimes(periodTimes.slice(0, periodCount));
    }
  }, [periodCount, periodTimes.length]);

  const getSlot = (day: typeof days[number], period: number) => {
    return timetable.find(slot => slot.day === day && slot.period === period);
  };

  const isCurrentPeriod = (day: string, periodIndex: number) => {
    if (day !== currentDay) return false;
    const time = periodTimes[periodIndex];
    if (!time) return false;
    return isTimeInRange(time.start, time.end);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot.id);
    setEditSubject(slot.subject || '');
    setEditVenue(slot.room || '');
    setEditTeacher(slot.teacher || '');
  };

  const handleSaveSlot = (slotId: string) => {
    setTimetable(prev =>
      prev.map(slot =>
        slot.id === slotId
          ? { 
              ...slot, 
              subject: editSubject || null, 
              room: editVenue || undefined,
              teacher: editTeacher || undefined
            }
          : slot
      )
    );
    setEditingSlot(null);
    setEditSubject('');
    setEditVenue('');
    setEditTeacher('');
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditSubject('');
    setEditVenue('');
    setEditTeacher('');
  };

  const handleSaveTimetable = () => {
    setIsEditing(false);
    toast({
      title: 'Timetable saved!',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handlePeriodTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    setPeriodTimes(prev => {
      const newTimes = [...prev];
      newTimes[index] = { ...newTimes[index], [field]: value };
      return newTimes;
    });
  };

  const handleAddPeriod = () => {
    if (periodCount < 10) {
      setPeriodCount(prev => prev + 1);
    }
  };

  const handleRemovePeriod = () => {
    if (periodCount > 1) {
      setPeriodCount(prev => prev - 1);
    }
  };

  const periods = Array.from({ length: periodCount }, (_, i) => i + 1);

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
            {/* Settings Button */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Timetable Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Period Count */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Number of Periods</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRemovePeriod}
                        disabled={periodCount <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-2xl font-bold">{periodCount}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleAddPeriod}
                        disabled={periodCount >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Min: 1, Max: 10 periods per day</p>
                  </div>

                  {/* Period Timings */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Period Timings</Label>
                    <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
                      {periods.map((period, index) => (
                        <div key={period} className="flex items-center gap-2 rounded-lg border border-border p-3">
                          <span className="w-16 text-sm font-medium text-muted-foreground">Period {period}</span>
                          <div className="flex flex-1 items-center gap-2">
                            <Input
                              type="time"
                              value={periodTimes[index]?.start || '08:00'}
                              onChange={(e) => handlePeriodTimeChange(index, 'start', e.target.value)}
                              className="h-9"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={periodTimes[index]?.end || '09:00'}
                              onChange={(e) => handlePeriodTimeChange(index, 'end', e.target.value)}
                              className="h-9"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setIsSettingsOpen(false)}>
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
                        <div className="text-xs">
                          {periodTimes[period - 1] 
                            ? `${formatTime(periodTimes[period - 1].start)} - ${formatTime(periodTimes[period - 1].end)}`
                            : '-'
                          }
                        </div>
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
                                  placeholder="Subject (empty = free)"
                                  className="h-8 text-sm"
                                />
                                <Input
                                  value={editVenue}
                                  onChange={(e) => setEditVenue(e.target.value)}
                                  placeholder="Venue / Room"
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
                                    {slot?.teacher && <p className="mt-0.5 text-xs flex items-center gap-1"><User className="h-3 w-3" />{slot.teacher}</p>}
                                    {slot?.room && <p className="text-xs text-muted-foreground">{slot.room}</p>}
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
                  const isCurrentlyEditing = editingSlot === slot?.id;

                  return (
                    <div key={period}>
                      {isCurrentlyEditing ? (
                        <div className="flex flex-col gap-2 rounded-lg border border-primary bg-card p-3">
                          <Input
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            placeholder="Subject (empty = free)"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={editVenue}
                            onChange={(e) => setEditVenue(e.target.value)}
                            placeholder="Venue / Room"
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
                            'flex items-center justify-between rounded-lg p-3',
                            isFree ? 'bg-status-free/10' : 'bg-info/10',
                            isEditing && 'cursor-pointer hover:ring-2 hover:ring-primary'
                          )}
                          onClick={() => isEditing && slot && handleEditSlot(slot)}
                        >
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {periodTimes[period - 1]
                                ? `${formatTime(periodTimes[period - 1].start)} - ${formatTime(periodTimes[period - 1].end)}`
                                : `Period ${period}`
                              }
                            </p>
                            <p className={cn('font-medium', isFree ? 'text-status-free' : 'text-foreground')}>
                              {isFree ? 'Free' : slot?.subject}
                            </p>
                            {slot?.room && <p className="text-xs text-muted-foreground">{slot.room}</p>}
                          </div>
                        </div>
                      )}
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
