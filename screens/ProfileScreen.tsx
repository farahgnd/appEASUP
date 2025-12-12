
import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { Award, CheckCircle, Lock, Brush, Users, Swords, LogOut, HeartPulse } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS, MOCK_GROUP } from '../constants';
import type { Achievement, Condition } from '../types';
import Modal from '../components/Modal';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
        achievement.unlocked
        ? 'bg-gray-800/50 border border-green-500/30 shadow-lg shadow-green-900/50'
        : 'bg-gray-800/20 border border-gray-700/50'
    }`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            achievement.unlocked ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'
        }`}>
            {achievement.unlocked ? <CheckCircle size={28} /> : <Lock size={28} />}
        </div>
        <div>
            <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>{achievement.name}</h4>
            <p className="text-xs text-gray-400">{achievement.description}</p>
            {achievement.unlocked && achievement.date && (
                <p className="text-xs text-green-400 font-mono mt-1">Unlocked: {achievement.date}</p>
            )}
        </div>
    </div>
);

interface ProfileScreenProps {
    onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
    const { healthData, group, setGroup, condition, setCondition } = useHealthData();
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [showConditionModal, setShowConditionModal] = useState(false);

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
    
    const handleConditionUpdate = (newCondition: Condition) => {
        setCondition(newCondition);
        setShowConditionModal(false);
    };

    const conditionDisplay = {
        diabetes: 'Diabetes',
        hypertension: 'Hypertension',
        none: 'None Reported'
    };

    return (
         <div className="relative z-10">
            <header className="p-4 bg-gray-900/50 backdrop-blur-lg border-b border-green-400/20 sticky top-0 z-20">
                <h1 className="text-xl font-orbitron text-center text-green-300">EASUP Profile</h1>
            </header>
            <div className="p-4 space-y-8">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-2 border-green-400 p-1 mb-4">
                        <img src={`https://picsum.photos/seed/user/200`} alt="User avatar" className="w-full h-full rounded-full object-cover"/>
                    </div>
                    <h2 className="text-2xl font-bold text-white">User_01</h2>
                    <p className="text-sm text-green-400">Level 7 EASUP Athlete</p>
                    <button className="mt-4 flex items-center gap-2 text-sm bg-gray-700/50 text-green-300 px-4 py-2 rounded-full hover:bg-gray-700 transition">
                        <Brush size={16} /> Customize Avatar
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-800/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">EASUP Score</p>
                        <p className="text-2xl font-orbitron text-green-300">{healthData.auraScore}</p>
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">Quests Done</p>
                        <p className="text-2xl font-orbitron text-green-300">{achievements.filter(a => a.unlocked).length}</p>
                    </div>
                     <div className="bg-gray-800/30 p-3 rounded-lg">
                        <p className="text-xs text-gray-400">Streak</p>
                        <p className="text-2xl font-orbitron text-green-300">12 Days</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2"><HeartPulse /> Health Profile</h3>
                    <div className="bg-gray-800/30 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Managed Condition</p>
                            <p className="text-white font-semibold">{condition ? conditionDisplay[condition] : 'Not Set'}</p>
                        </div>
                        <button onClick={() => setShowConditionModal(true)} className="text-sm bg-gray-700/50 text-green-300 px-4 py-2 rounded-full hover:bg-gray-700 transition">
                            Edit
                        </button>
                    </div>
                </div>

                {!group && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2"><Users /> Squad Invitation</h3>
                        <div className="bg-gray-800/30 p-4 rounded-xl border border-dashed border-gray-600 text-center">
                            <p className="text-gray-400 text-sm mb-4">Have an invite code? Join your friends to compete and collaborate.</p>
                            <button onClick={() => setShowJoinModal(true)} className="flex items-center justify-center w-full max-w-xs mx-auto gap-2 bg-gray-700/50 text-green-300 px-4 py-3 rounded-full text-md font-bold hover:bg-gray-700 transition">
                                <Swords size={20}/> Enter Invite Code
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2"><Award /> Achievements</h3>
                    <div className="space-y-3">
                        {achievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
                    </div>
                </div>

                 <div className="pt-4 mt-4 border-t border-gray-700/50">
                    <button 
                        onClick={onLogout} 
                        className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-400 px-4 py-3 rounded-full text-md font-bold hover:bg-red-500/40 hover:text-red-300 transition"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

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

            {showConditionModal && (
                <Modal title="Update Health Profile" onClose={() => setShowConditionModal(false)}>
                    <div className="space-y-4">
                        <p className="text-center text-gray-400 mb-2 text-sm">Select any condition you manage for safer, more effective personalization.</p>
                        <button onClick={() => handleConditionUpdate('diabetes')} className="w-full p-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-left hover:border-green-400 transition font-semibold text-white">Diabetes</button>
                        <button onClick={() => handleConditionUpdate('hypertension')} className="w-full p-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-left hover:border-green-400 transition font-semibold text-white">Hypertension</button>
                        <button onClick={() => handleConditionUpdate('none')} className="w-full p-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-left hover:border-green-400 transition font-semibold text-white">None of these</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProfileScreen;