import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, addMonths, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Plus, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  color: string;
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Standup",
      startTime: "9:00 AM",
      endTime: "9:30 AM",
      date: new Date(2025, 4, 23), // May 23, 2025
      color: "bg-blue-500"
    },
    {
      id: "2",
      title: "Client Call: Acme Corp",
      startTime: "11:00 AM",
      endTime: "11:45 AM",
      date: new Date(2025, 4, 23), // May 23, 2025
      color: "bg-green-500"
    }
  ]);

  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM

  const handlePrevious = () => {
    if (view === "day") {
      setDate(prev => addDays(prev, -1));
    } else if (view === "week") {
      setDate(prev => addDays(prev, -7));
    } else {
      setDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (view === "day") {
      setDate(prev => addDays(prev, 1));
    } else if (view === "week") {
      setDate(prev => addDays(prev, 7));
    } else {
      setDate(prev => addMonths(prev, 1));
    }
  };

  const getHeaderText = () => {
    if (view === "day") {
      return format(date, "EEEE, MMMM d");
    } else if (view === "week") {
      const weekStart = addDays(date, -date.getDay());
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, "MMMM d")} - ${format(weekEnd, "MMMM d, yyyy")}`;
    } else {
      return format(date, "MMMM yyyy");
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="bg-[#0A0A0A] text-white rounded-lg border border-gray-800 shadow-lg">
        <div className="grid grid-cols-7 gap-px bg-gray-800">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center py-2 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {Array(35)
            .fill(null)
            .map((_, i) => {
              const d = addDays(
                new Date(date.getFullYear(), date.getMonth(), 1 - new Date(date.getFullYear(), date.getMonth(), 1).getDay()),
                i
              );
              
              const isCurrentMonth = isSameMonth(d, date);
              const dayEvents = events.filter(event => isSameDay(event.date, d));
              
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[100px] p-2 relative hover:bg-[#0F0F0F] transition-colors",
                    isCurrentMonth ? "bg-[#0A0A0A]" : "bg-[#0A0A0A]/50 text-gray-500"
                  )}
                  onClick={() => {
                    setDate(d);
                    setView("day");
                  }}
                >
                  <div className={cn(
                    "text-sm mb-1 h-6 w-6 flex items-center justify-center rounded-full",
                    isSameDay(d, new Date()) && "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white"
                  )}>
                    {format(d, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs truncate rounded px-1 py-0.5 text-white",
                          event.color
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = addDays(date, -date.getDay());
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="bg-[#0A0A0A] text-white rounded-lg border border-gray-800 shadow-lg">
        <div className="grid grid-cols-8 gap-px bg-gray-800">
          <div className="py-2"></div>
          {days.map((day, i) => (
            <div 
              key={i} 
              className="text-center py-2 text-sm font-medium"
              onClick={() => {
                setDate(day);
                setView("day");
              }}
            >
              <div>{format(day, "EEE")}</div>
              <div 
                className={cn(
                  "h-6 w-6 flex items-center justify-center rounded-full mx-auto mt-1",
                  isSameDay(day, new Date()) && "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-px">
          {hours.map(hour => (
            <>
              <div key={hour} className="p-2 border-t border-gray-800 text-right text-xs text-gray-500">
                {hour % 12 === 0 ? "12" : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
              </div>
              {days.map((day, i) => {
                const currentEvents = events.filter(
                  event => 
                    isSameDay(event.date, day) && 
                    parseInt(event.startTime.split(':')[0]) === (hour % 12) + (event.startTime.includes('PM') && hour % 12 !== 0 ? 12 : 0)
                );
                
                return (
                  <div 
                    key={i}
                    className="border-t border-gray-800 p-1 relative min-h-[60px]"
                  >
                    {currentEvents.map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs p-1 rounded text-white absolute inset-x-1",
                          event.color
                        )}
                        style={{
                          height: `calc(60px * ${
                            (parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0]))
                          })`
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div>{event.startTime} - {event.endTime}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="bg-[#0A0A0A] text-white rounded-lg border border-gray-800 shadow-lg">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium">{format(date, "EEEE, MMMM d")}</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {hours.map(hour => {
            const hourEvents = events.filter(
              event => 
                isSameDay(event.date, date) && 
                parseInt(event.startTime.split(':')[0]) === (hour % 12) + (event.startTime.includes('PM') && hour % 12 !== 0 ? 12 : 0)
            );
            
            return (
              <div key={hour} className="flex">
                <div className="p-2 w-20 text-right text-xs text-gray-500">
                  {hour % 12 === 0 ? "12" : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
                </div>
                <div className="flex-1 min-h-[60px] p-1 relative">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-2 rounded text-white absolute inset-x-1",
                        event.color
                      )}
                      style={{
                        height: `calc(60px * ${
                          (parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0]))
                        })`
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm">{event.startTime} - {event.endTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] p-6">
      <div className="bg-[#121218] rounded-lg shadow-lg flex flex-col h-full border border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <Button 
              variant="outline" 
              className="bg-[#0A0A0A] border-gray-700 text-white hover:bg-[#1A1A1A]"
              onClick={() => setDate(new Date())}
            >
              Today
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrevious}
                className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNext}
                className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-lg font-medium">{getHeaderText()}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-10 bg-[#0A0A0A] border-gray-800 text-white placeholder:text-gray-400 w-64"
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View Selection */}
        <div className="border-b border-gray-800">
          <div className="flex p-2">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              onClick={() => setView("day")}
              className={cn(
                "rounded-md",
                view === "day" 
                  ? "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white" 
                  : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              )}
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              onClick={() => setView("week")}
              className={cn(
                "rounded-md",
                view === "week" 
                  ? "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white" 
                  : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              )}
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              onClick={() => setView("month")}
              className={cn(
                "rounded-md",
                view === "month" 
                  ? "bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white" 
                  : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
              )}
            >
              Month
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        <div className="flex-1 overflow-y-auto p-6">
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
