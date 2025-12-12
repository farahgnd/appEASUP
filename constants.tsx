import React from 'react';
import { Home, MessageSquare, Apple, BarChart2, User, Settings, Users, UserPlus } from 'lucide-react';
import type { Achievement, Group } from './types';

export const ICONS = {
  Home: <Home size={26} />,
  Coach: <MessageSquare size={26} />,
  Nutrition: <Apple size={26} />,
  Profile: <User size={26} />,
  Community: <Users size={26} />,
  Settings: <Settings size={26} />,
  Stats: <BarChart2 size={26}/>,
  Invite: <UserPlus size={18} />
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { id: '1', name: 'First Fuel', description: 'Logged your first meal.', unlocked: true, date: 'May 1, 2024' },
    { id: '2', name: 'Genesis Move', description: 'Completed your first activity.', unlocked: true, date: 'May 2, 2024' },
    { id: '3', name: 'Hydration Ritual', description: 'Logged 2L of water for 3 consecutive days.', unlocked: false },
    { id: '4', name: 'Protein Prodigy', description: 'Hit your protein goal for a full week.', unlocked: false },
    { id: '5', name: 'Mindful Moment', description: 'Logged your mood every day for a week.', unlocked: true, date: 'May 8, 2024' },
    { id: '6', name: 'Perfect Week', description: 'Closed all three Momentum Rings for 7 days straight.', unlocked: false },
];

export const MOCK_GROUP: Group = {
    id: 'g1',
    name: 'Team Alpha',
    description: 'Pushing limits and supporting each other to reach peak performance. Consistency is key.',
    members: [
        { id: 'u2', name: 'CyberRunner', avatarUrl: 'https://picsum.photos/seed/runner/200', easupScore: 92, level: 9 },
        { id: 'u3', name: 'VitaGlow', avatarUrl: 'https://picsum.photos/seed/glow/200', easupScore: 85, level: 8 },
        { id: 'u1', name: 'User_01', avatarUrl: 'https://picsum.photos/seed/user/200', easupScore: 78, level: 7, isCurrentUser: true },
        { id: 'u4', name: 'Zenith', avatarUrl: 'https://picsum.photos/seed/zenith/200', easupScore: 75, level: 7 },
    ].sort((a, b) => b.easupScore - a.easupScore),
    challenges: [
        { id: 'c1', title: 'Weekly Steps Quest', description: 'Collectively walk 250,000 steps as a team.', progress: 185000, goal: 250000, unit: 'steps' },
        { id: 'c2', title: 'Hydration Wave', description: 'Ensure everyone logs at least 2L of water daily.', progress: 5, goal: 7, unit: 'days' },
    ],
    feed: [
        {
            id: 'p1',
            authorId: 'u2',
            authorName: 'CyberRunner',
            authorAvatar: 'https://picsum.photos/seed/runner/200',
            content: 'Just crushed a 10k run! The energy levels are peaking. 🏃‍♂️💨',
            timestamp: new Date(Date.now() - 3600000),
            likes: 5,
            type: 'manual'
        },
        {
            id: 'p2',
            authorId: 'u3',
            authorName: 'VitaGlow',
            authorAvatar: 'https://picsum.photos/seed/glow/200',
            content: 'Completed Day 4 of the "Mindful Week" program.',
            timestamp: new Date(Date.now() - 7200000),
            likes: 8,
            type: 'auto_achievement'
        }
    ]
};