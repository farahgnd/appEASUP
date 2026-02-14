import React, { useEffect, useState } from 'react';


interface Squad {
  id: number;
  name: string;
}

interface ChatScreenProps {
  userEmail: string;
  userId: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ userEmail, userId }) => {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [newSquadName, setNewSquadName] = useState('');

  // Récupérer les squads depuis le backend
  const fetchSquads = async () => {
    try {
      const res = await fetch('http://192.168.1.15/appEASUP/API/list_squad.php');
      const data = await res.json();
      setSquads(data);
    } catch (err) {
      console.error('Erreur fetch squads:', err);
    }
  };

  // Créer un nouveau squad
  const handleCreateSquad = async () => {
  if (!newSquadName.trim()) return;

  try {
    const res = await fetch('http://192.168.1.15/appEASUP/API/create_squad.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSquadName }),
    });

    const data = await res.json();
    console.log(data);

    if (data.success) {
      setNewSquadName('');
      await fetchSquads();
    } else {
      alert(data.message || 'Erreur création squad');
    }

  } catch (err) {
    console.error('Erreur création squad:', err);
  }
};


  // Rejoindre un squad existant
  const handleJoinSquad = async (squad_id: number) => {
    try {
      const res = await fetch('http://192.168.1.15:3000/appEASUP/API/join_squad.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ squad_id: String(squad_id), user_id: String(userId) }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        alert('Vous avez rejoint le squad !');
      } else {
        alert(data.message || 'Erreur rejoindre squad');
      }
    } catch (err) {
      console.error('Erreur rejoindre squad:', err);
    }
  };

  // fetch squads au chargement
  useEffect(() => {
    fetchSquads();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-2">Squads disponibles</h1>

      {/* Input pour créer un squad */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nom du nouveau squad"
          value={newSquadName}
          onChange={(e) => setNewSquadName(e.target.value)}
          className="flex-1 p-2 border rounded text-black"
        />
        <button
          type="button"
          onClick={handleCreateSquad}
          className="bg-green-400 text-white px-4 rounded"
        >
          Créer
        </button>
      </div>

      {/* Liste des squads */}
      <ul className="flex flex-col gap-2">
        {squads.map((squad) => (
          <li
            key={squad.id}
            className="flex justify-between items-center border p-2 rounded bg-gray-800 text-white"
          >
            <span>{squad.name}</span>
            <button
              type="button"
              className="bg-blue-500 px-2 py-1 rounded text-white"
              onClick={() => handleJoinSquad(squad.id)}
            >
              Rejoindre
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatScreen;
