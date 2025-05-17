'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, FileText, Users, Building2, Bell } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  startDate: Date;
}

async function fetchUserProfile(): Promise<UserProfile> {
  // TODO: Replace with actual user ID from auth context
  const { data } = await axios.get<UserProfile>(`${API_URL}/employees/me`);
  return {
    ...data,
    startDate: new Date(data.startDate),
  };
}

export default function Dashboard() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const quickActions = [
    {
      title: 'View Schedule',
      description: 'Check your work schedule and shifts',
      icon: CalendarDays,
      href: '/schedule',
    },
    {
      title: 'Request Time Off',
      description: 'Submit vacation or leave requests',
      icon: Clock,
      href: '/time-off',
    },
    {
      title: 'View Documents',
      description: 'Access important documents and forms',
      icon: FileText,
      href: '/documents',
    },
    {
      title: 'Team Directory',
      description: 'Find and connect with your colleagues',
      icon: Users,
      href: '/employees',
    },
  ];

  const announcements = [
    {
      title: 'Office Closure Notice',
      date: 'Dec 24-26',
      description: 'Office will be closed for Christmas holidays',
    },
    {
      title: 'New Safety Guidelines',
      date: 'Today',
      description: 'Updated workplace safety protocols are now in effect',
    },
    {
      title: 'Team Building Event',
      date: 'Next Week',
      description: 'Join us for the annual team building activity',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.firstName}!
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.department}</div>
              <p className="text-xs text-muted-foreground">{profile?.position}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time with Us</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.startDate ? Math.floor((new Date().getTime() - profile.startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0} years
              </div>
              <p className="text-xs text-muted-foreground">
                Since {profile?.startDate?.toLocaleDateString()}
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
                    <action.icon className="h-6 w-6" />
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

      {/* Announcements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <Card key={announcement.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">{announcement.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{announcement.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 