
import React, { useState } from 'react';
import EasupAvatar from '../components/AuraAvatar';
import MomentumRings from '../components/MomentumRings';
import { useHealthData } from '../context/HealthDataContext';
import { ArrowRight, Info, Droplets, Scale, Activity, CheckCircle, X } from 'lucide-react';
import Modal from '../components/Modal';

const HomeScreen: React.FC = () => {
    const { healthData, condition, logWater, logWeight, logGlucose, logMood, checkInProgram } = useHealthData();
    const [showTrackModal, setShowTrackModal] = useState<'water' | 'weight' | 'glucose' | 'mood' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [encouragement, setEncouragement] = useState<string | null>(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Morning, User";
        if (hour < 18) return "Afternoon, User";
        return "Evening, User";
    }

    const showEncouragement = (msg: string) => {
        setEncouragement(msg);
        setTimeout(() => setEncouragement(null), 3000);
    };

    const handleLog = () => {
        if (!inputValue && showTrackModal !== 'mood') return;
        
        switch (showTrackModal) {
            case 'water':
                logWater(parseInt(inputValue));
                showEncouragement("Hydration optimized! 💧");
                break;
            case 'weight':
                logWeight(parseFloat(inputValue));
                showEncouragement("Biometrics updated. Analysis running... 📊");
                break;
            case 'glucose':
                logGlucose(parseInt(inputValue), 'random');
                showEncouragement("Glucose logged. Stay balanced. 🩸");
                break;
        }
        setShowTrackModal(null);
        setInputValue('');
    };

    const handleMoodLog = (mood: string) => {
        logMood(mood);
        showEncouragement("Mood synced with EASUP core. 🧠");
        setShowTrackModal(null);
    };

    const getInsight = () => {
        switch(condition) {
            case 'diabetes':
                return {
                    title: "Condition Monitor",
                    tip: "Consistency in meal timing helps regulate blood sugar spikes. Great job tracking today.",
                    isPersonalized: true
                };
            case 'hypertension':
                return {
                    title: "Condition Monitor",
                    tip: "Your activity levels are helping lower vascular resistance. Keep the flow.",
                    isPersonalized: true
                };
            default:
                return {
                    title: "Coach's Insight",
                    tip: "Your energy levels look stable. A great day to push for a new personal best in your activity.",
                    isPersonalized: false
                };
        }
    };

    const insight = getInsight();

    return (
        <div className="p-4 space-y-6 relative z-10 animate-fade-in">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-orbitron tracking-wide text-gray-200">{getGreeting()}</h1>
                    <p className="text-green-400 text-xs">System Status: Online</p>
                </div>
                {encouragement && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
                        {encouragement}
                    </div>
                )}
            </header>
            
            <EasupAvatar score={healthData.auraScore} />

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => setShowTrackModal('water')} className="bg-gray-800/40 p-3 rounded-xl border border-gray-700 hover:border-blue-400 hover:bg-blue-900/20 transition flex flex-col items-center gap-1">
                    <Droplets size={20} className="text-blue-400"/>
                    <span className="text-[10px] text-gray-300">Water</span>
                </button>
                <button onClick={() => setShowTrackModal('mood')} className="bg-gray-800/40 p-3 rounded-xl border border-gray-700 hover:border-purple-400 hover:bg-purple-900/20 transition flex flex-col items-center gap-1">
                    <Activity size={20} className="text-purple-400"/>
                    <span className="text-[10px] text-gray-300">Mood</span>
                </button>
                <button onClick={() => setShowTrackModal('weight')} className="bg-gray-800/40 p-3 rounded-xl border border-gray-700 hover:border-yellow-400 hover:bg-yellow-900/20 transition flex flex-col items-center gap-1">
                    <Scale size={20} className="text-yellow-400"/>
                    <span className="text-[10px] text-gray-300">Weight</span>
                </button>
                {condition === 'diabetes' && (
                    <button onClick={() => setShowTrackModal('glucose')} className="bg-gray-800/40 p-3 rounded-xl border border-red-500/30 hover:border-red-400 hover:bg-red-900/20 transition flex flex-col items-center gap-1">
                        <Activity size={20} className="text-red-400"/>
                        <span className="text-[10px] text-gray-300">Glucose</span>
                    </button>
                )}
            </div>

            <MomentumRings summary={healthData.dailySummary} goals={healthData.goals} />

            {/* Active Mini Program Widget */}
            {healthData.activeProgram && (
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <CheckCircle size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-orbitron text-green-300 uppercase tracking-widest">Active Program</h3>
                            <span className="text-xs font-mono text-gray-400">Day {healthData.activeProgram.currentDay} / {healthData.activeProgram.totalDays}</span>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-1">{healthData.activeProgram.title}</h4>
                        <p className="text-xs text-gray-400 mb-3">{healthData.activeProgram.description}</p>
                        
                        {healthData.activeProgram.isCompletedToday ? (
                             <div className="w-full py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center text-sm font-bold flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> Completed Today
                             </div>
                        ) : (
                            <button 
                                onClick={() => { checkInProgram(); showEncouragement("Program progress saved! +5 Aura"); }}
                                className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-bold transition shadow-lg shadow-green-900/50"
                            >
                                Mark Complete
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className={`rounded-2xl p-4 ${insight.isPersonalized ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800/30'}`}>
                <h3 className="text-lg font-orbitron text-center mb-4 text-green-300 tracking-wider flex items-center justify-center gap-2">
                    {insight.isPersonalized && <Info size={20} />}
                    {insight.title}
                </h3>
                <div className={`text-center text-sm p-4 border border-dashed rounded-lg ${insight.isPersonalized ? 'border-green-600/50 text-green-200' : 'border-gray-600 text-gray-300'}`}>
                    <p>"{insight.tip}"</p>
                    <button className="mt-4 text-green-400 flex items-center gap-2 mx-auto text-sm hover:text-green-200 transition">
                        Chat with EASUP AI <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Log Modal */}
            {showTrackModal && (
                <Modal title={`Log ${showTrackModal.charAt(0).toUpperCase() + showTrackModal.slice(1)}`} onClose={() => setShowTrackModal(null)}>
                    <div className="space-y-4">
                        {showTrackModal === 'mood' ? (
                            <div className="grid grid-cols-2 gap-3">
                                {['Radiant', 'Charged', 'Balanced', 'Drained', 'Stressed'].map(m => (
                                    <button key={m} onClick={() => handleMoodLog(m)} className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 text-sm text-white">
                                        {m}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={showTrackModal === 'water' ? 'Amount in ml' : showTrackModal === 'weight' ? 'Weight in kg' : 'mg/dL'}
                                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                                        autoFocus
                                    />
                                    <span className="absolute right-4 top-3 text-gray-500 text-sm">
                                        {showTrackModal === 'water' ? 'ml' : showTrackModal === 'weight' ? 'kg' : 'mg/dL'}
                                    </span>
                                </div>
                                <button onClick={handleLog} className="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition">
                                    Update Log
                                </button>
                            </>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default HomeScreen;
