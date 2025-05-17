'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, FileText, Users, Building2, Bell, Calendar, Briefcase, Coffee, Trophy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Sample data that would come from the backend
const SAMPLE_USER = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  position: 'Senior Software Engineer',
  department: 'Engineering',
  startDate: new Date('2020-03-15'),
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  manager: {
    name: 'Jane Smith',
    position: 'Engineering Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  stats: {
    daysWorked: 942,
    projectsCompleted: 15,
    upcomingTimeOff: 12,
    teamSize: 8
  },
  schedule: {
    todayHours: '9:00 AM - 5:00 PM',
    nextMeeting: {
      title: 'Weekly Team Sync',
      time: '2:00 PM',
      attendees: 5
    }
  },
  tasks: {
    total: 12,
    completed: 8,
    urgent: 2,
    dueToday: 3
  }
};

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: 'Office Closure Notice',
    date: 'Dec 24-26',
    description: 'Office will be closed for Christmas holidays. Please plan your work accordingly.',
    priority: 'high'
  },
  {
    title: 'New Safety Guidelines',
    date: 'Today',
    description: 'Updated workplace safety protocols are now in effect. All employees must complete safety training by next week.',
    priority: 'medium'
  },
  {
    title: 'Team Building Event',
    date: 'Next Week',
    description: 'Join us for the annual team building activity at Mountain View Resort. RSVP required.',
    priority: 'low'
  }
];

const SAMPLE_UPCOMING_EVENTS = [
  {
    title: 'Performance Review',
    date: 'Dec 15, 2023',
    type: 'meeting',
    time: '10:00 AM'
  },
  {
    title: 'Project Deadline: Q4 Release',
    date: 'Dec 20, 2023',
    type: 'deadline',
    time: '6:00 PM'
  },
  {
    title: 'Holiday Party',
    date: 'Dec 22, 2023',
    type: 'event',
    time: '7:00 PM'
  }
];

export default function Dashboard() {
  const quickActions = [
    {
      title: 'Request Time Off',
      description: 'Submit vacation or leave requests',
      icon: Calendar,
      href: '/time-off',
      color: 'text-blue-500'
    },
    {
      title: 'View Schedule',
      description: 'Check your work schedule and shifts',
      icon: Clock,
      href: '/schedule',
      color: 'text-green-500'
    },
    {
      title: 'Submit Expenses',
      description: 'Submit and track expense reports',
      icon: Briefcase,
      href: '/expenses',
      color: 'text-purple-500'
    },
    {
      title: 'Book Meeting Room',
      description: 'Reserve meeting spaces',
      icon: Coffee,
      href: '/rooms',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Stats */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {SAMPLE_USER.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Your Manager</p>
              <p className="text-sm text-muted-foreground">{SAMPLE_USER.manager.name}</p>
            </div>
            <Image
              src={SAMPLE_USER.manager.avatar}
              alt="Manager avatar"
              className="h-10 w-10 rounded-full bg-muted"
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days at Company</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SAMPLE_USER.stats.daysWorked}</div>
              <p className="text-xs text-muted-foreground">
                {Math.floor(SAMPLE_USER.stats.daysWorked / 365)} years, {SAMPLE_USER.stats.daysWorked % 365} days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SAMPLE_USER.schedule.todayHours}</div>
              <p className="text-xs text-muted-foreground">
                Next: {SAMPLE_USER.schedule.nextMeeting.title} at {SAMPLE_USER.schedule.nextMeeting.time}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Due</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SAMPLE_USER.tasks.dueToday}</div>
              <p className="text-xs text-muted-foreground">
                {SAMPLE_USER.tasks.urgent} urgent, {SAMPLE_USER.tasks.completed} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Off Balance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SAMPLE_USER.stats.upcomingTimeOff} days</div>
              <p className="text-xs text-muted-foreground">
                Available to use this year
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:bg-accent/50 transition-colors">
              <Link href={action.href}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events and Announcements Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm">View Calendar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SAMPLE_UPCOMING_EVENTS.map((event) => (
                <div key={event.title} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{event.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Announcements</CardTitle>
              <Button variant="ghost" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SAMPLE_ANNOUNCEMENTS.map((announcement) => (
                <div key={announcement.title} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{announcement.title}</p>
                    <span className="text-sm text-muted-foreground">{announcement.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{announcement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 