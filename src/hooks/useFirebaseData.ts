import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { Component, BorrowRequest, Notification, LoginSession, SystemStats } from '../types';

export const useFirebaseComponents = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onComponentsChange((components) => {
      setComponents(components);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { components, loading };
};

export const useFirebaseRequests = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onRequestsChange((requests) => {
      setRequests(requests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { requests, loading };
};

export const useFirebaseUserNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const unsubscribe = firebaseService.onUserNotificationsChange(userId, (notifications) => {
      setNotifications(notifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { notifications, loading };
};

export const useFirebaseSystemStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLogins: 0,
    onlineUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalComponents: 0,
    overdueItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, requests, components, sessions] = await Promise.all([
          firebaseService.getAllUsers(),
          firebaseService.getRequests(),
          firebaseService.getComponents(),
          firebaseService.getLoginSessions()
        ]);

        const now = new Date();
        const overdueItems = requests.filter(r => 
          r.status === 'approved' && new Date(r.dueDate) < now
        );

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          totalLogins: users.reduce((sum, u) => sum + (u.loginCount || 0), 0),
          onlineUsers: sessions.filter(s => s.isActive).length,
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          totalComponents: components.length,
          overdueItems: overdueItems.length
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};