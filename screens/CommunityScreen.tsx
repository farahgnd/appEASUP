
import React, { useState } from 'react';
import { MOCK_GROUP, ICONS } from '../constants';
import type { Group, GroupMember, GroupChallenge, Post } from '../types';
import { Crown, Settings, Shield, Users, Swords, Copy, MessageSquare, Heart, Send } from 'lucide-react';
import Modal from '../components/Modal';
import { useHealthData } from '../context/HealthDataContext';


// --- Components for Group Hub View ---
const LeaderboardItem: React.FC<{ member: GroupMember, rank: number }> = ({ member, rank }) => {
  const rankIcon = () => {
    if (rank === 1) return <Crown className="text-yellow-400" size={20} />;
    if (rank === 2) return <Crown className="text-gray-300" size={20} />;
    if (rank === 3) return <Crown className="text-amber-500" size={20} />;
    return <span className="text-gray-400 font-mono w-5 text-center">{rank}</span>;
  };

  return (
    <div className={`p-3 rounded-lg flex items-center gap-4 transition-all duration-300 ${
        member.isCurrentUser
        ? 'bg-green-500/10 border border-green-500/30'
        : 'bg-gray-800/30'
    }`}>
      <div className="flex items-center justify-center w-8">{rankIcon()}</div>
      <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full border-2 border-gray-600" />
      <div className="flex-1">
        <h4 className="font-bold text-white">{member.name}</h4>
        <p className="text-xs text-gray-400">Level {member.level}</p>
      </div>
      <div className="text-right">
        <p className="font-orbitron text-lg text-green-300">{member.easupScore}</p>
        <p className="text-xs text-gray-500">Score</p>
      </div>
    </div>
  );
};

const ChallengeCard: React.FC<{ challenge: GroupChallenge }> = ({ challenge }) => {
    const progressPercentage = (challenge.progress / challenge.goal) * 100;
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 space-y-2">
            <h4 className="font-semibold text-green-300">{challenge.title}</h4>
            <p className="text-xs text-gray-400">{challenge.description}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-green-500 h-2.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)]" 
                    style={{ width: `${progressPercentage}%`, transition: 'width 1.5s ease-out' }}
                ></div>
            </div>
            <p className="text-right text-xs font-mono text-gray-300">{challenge.progress.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}</p>
        </div>
    );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full border border-gray-600"/>
                <div>
                    <h5 className="text-sm font-bold text-white">{post.authorName}</h5>
                    <p className="text-[10px] text-gray-400">
                        {Math.floor((new Date().getTime() - post.timestamp.getTime()) / 60000)}m ago
                    </p>
                </div>
                {post.type === 'auto_achievement' && (
                    <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full uppercase font-bold">Quest</span>
                )}
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 pt-2 border-t border-gray-700/50">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition">
                    <Heart size={14} /> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition">
                    <MessageSquare size={14} /> Reply
                </button>
            </div>
        </div>
    );
};

// --- Main Screen Component ---
const CommunityScreen: React.FC = () => {
    const { group, setGroup, addPost } = useHealthData();
    const [view, setView] = useState<'stats' | 'feed'>('stats');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    const handleJoinGroup = () => {
        if (joinCode.toUpperCase() === 'ALPHA-X7B9') {
            setGroup(MOCK_GROUP);
            setShowJoinModal(false);
            setJoinError('');
            setJoinCode('');
        } else {
            setJoinError('Invalid code. Please try again.');
        }
    };
    
    const handleCreateGroup = () => {
        if (newGroupName.trim() === '') return;
        
        const username = localStorage.getItem('easup_username') || 'User_01';
        const photoUrl = localStorage.getItem('easup_photo_url') || 'https://picsum.photos/seed/user/200';
        
        const newUserAsMember: GroupMember = {
             id: 'u1', name: username, avatarUrl: photoUrl, easupScore: 78, level: 7, isCurrentUser: true
        };
        const newGroup: Group = {
            id: `g${Date.now()}`,
            name: newGroupName,
            description: 'A newly forged squad, ready for adventure!',
            members: [newUserAsMember],
            challenges: MOCK_GROUP.challenges, // Start with some default challenges
            feed: []
        };
        setGroup(newGroup);
        setShowCreateModal(false);
        setNewGroupName('');
    };

    const handlePostSubmit = () => {
        if (newPostContent.trim()) {
            addPost(newPostContent);
            setNewPostContent('');
            setShowPostModal(false);
        }
    };
    
    const handleCopyInviteCode = () => {
        navigator.clipboard.writeText('ALPHA-X7B9');
    };

    if (!group) {
        return (
            <div className="relative z-10 h-full flex flex-col">
                <header className="p-4 bg-gray-900/50 backdrop-blur-lg border-b border-green-400/20 sticky top-0 z-20">
                    <h1 className="text-xl font-orbitron text-center text-green-300">Community Hub</h1>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8">
                    <Users size={64} className="text-green-400/50" />
                    <h2 className="text-2xl font-orbitron text-white">Join a Squad</h2>
                    <p className="text-gray-400 max-w-xs">Team up with friends to take on challenges, compete on leaderboards, and stay motivated together.</p>
                    <div className="w-full max-w-xs space-y-4">
                        <button onClick={() => setShowCreateModal(true)} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full text-md font-bold hover:bg-green-400 transition transform active:scale-95">
                           <Shield size={20}/> Create New Squad
                        </button>
                        <button onClick={() => setShowJoinModal(true)} className="w-full flex items-center justify-center gap-2 bg-gray-700/50 text-gray-300 px-4 py-3 rounded-full text-md font-bold hover:bg-gray-700 transition">
                            <Swords size={20}/> Join a Squad
                        </button>
                    </div>
                </div>

                {showCreateModal && (
                    <Modal title="Create Your Squad" onClose={() => setShowCreateModal(false)}>
                         <div className="space-y-6">
                            <div className="relative">
                                <label htmlFor="groupName" className="absolute -top-2 left-3 px-1 bg-gray-900 text-green-400 text-xs font-semibold">Squad Name</label>
                                <input id="groupName" type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g., The Titans" className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"/>
                            </div>
                            <button onClick={handleCreateGroup} className="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition transform active:scale-95 disabled:bg-gray-600" disabled={!newGroupName.trim()}>Forge Squad</button>
                        </div>
                    </Modal>
                )}

                {showJoinModal && (
                    <Modal title="Join a Squad" onClose={() => setShowJoinModal(false)}>
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="joinCode" className="absolute -top-2 left-3 px-1 bg-gray-900 text-green-400 text-xs font-semibold">Invite Code</label>
                                <input id="joinCode" type="text" value={joinCode} onChange={(e) => { setJoinCode(e.target.value); setJoinError(''); }} placeholder="e.g., ALPHA-X7B9" className={`w-full bg-gray-800 border-2 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none transition ${joinError ? 'border-red-500' : 'border-gray-700 focus:border-green-500'}`}/>
                            </div>
                            {joinError && <p className="text-red-400 text-xs text-center">{joinError}</p>}
                            <button onClick={handleJoinGroup} className="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition transform active:scale-95">Enter Squad</button>
                        </div>
                    </Modal>
                )}
            </div>
        );
    }

    return (
        <div className="relative z-10">
            <header className="p-4 bg-gray-900/50 backdrop-blur-lg border-b border-green-400/20 sticky top-0 z-20">
                <h1 className="text-xl font-orbitron text-center text-green-300">Community Hub</h1>
            </header>

            <div className="p-4 space-y-6">
                <div className="p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50 text-center">
                    <div className="flex justify-center items-center gap-2">
                         <Shield size={20} className="text-green-400" />
                         <h2 className="text-2xl font-orbitron text-white">{group.name}</h2>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">{group.description}</p>
                </div>

                {/* View Toggles */}
                <div className="flex bg-gray-800 rounded-lg p-1">
                    <button 
                        onClick={() => setView('stats')}
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${view === 'stats' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Squad Stats
                    </button>
                    <button 
                         onClick={() => setView('feed')}
                         className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${view === 'feed' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Social Feed
                    </button>
                </div>

                {view === 'stats' ? (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-4">Team Leaderboard</h3>
                            <div className="space-y-3">
                                {group.members.map((member, index) => (
                                    <LeaderboardItem key={member.id} member={member} rank={index + 1} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-4">Active Quests</h3>
                            <div className="space-y-4">
                                {group.challenges.map(challenge => (
                                    <ChallengeCard key={challenge.id} challenge={challenge} />
                                ))}
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setShowInviteModal(true)} className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full text-sm font-bold hover:bg-green-400 transition transform active:scale-95">
                                {ICONS.Invite} Invite Members
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-gray-700/50 text-gray-300 px-4 py-3 rounded-full text-sm hover:bg-gray-700 transition">
                                <Settings size={18}/> Settings
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in pb-16">
                        <div className="flex items-center justify-between mb-2">
                             <h3 className="text-lg font-semibold text-gray-200">Squad Feed</h3>
                             <button onClick={() => setShowPostModal(true)} className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/50 hover:bg-green-500/40 transition">
                                + Update Status
                             </button>
                        </div>
                        {group.feed && group.feed.length > 0 ? (
                            group.feed.map(post => <PostCard key={post.id} post={post} />)
                        ) : (
                             <p className="text-center text-gray-500 py-8">No updates yet. Be the first to post!</p>
                        )}
                    </div>
                )}
            </div>
            
            {showInviteModal && (
                <Modal title="Invite Your Squad" onClose={() => setShowInviteModal(false)}>
                    <p className="text-center text-gray-400 mb-4 text-sm">Share this code with friends to have them join your squad.</p>
                    <div className="bg-gray-800 border-2 border-dashed border-green-500/50 rounded-lg p-4 flex items-center justify-between gap-4">
                        <span className="font-mono text-2xl text-white tracking-widest">ALPHA-X7B9</span>
                        <button onClick={handleCopyInviteCode} className="p-2 bg-green-500/20 rounded-lg text-green-300 hover:text-white hover:bg-green-500/40 transition">
                            <Copy size={20} />
                        </button>
                    </div>
                </Modal>
            )}

            {showPostModal && (
                <Modal title="Share Update" onClose={() => setShowPostModal(false)}>
                    <div className="space-y-4">
                        <textarea 
                            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 h-32 resize-none"
                            placeholder="Share your latest victory or thoughts..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <button onClick={handlePostSubmit} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition">
                             <Send size={18} /> Post to Squad
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CommunityScreen;
