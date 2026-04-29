import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AnalyticsPanel = ({ tournaments, matches }) => {
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const pendingMatches = matches.length - completedMatches;

  const matchStatusData = [
    { name: 'Completed', value: completedMatches },
    { name: 'Pending', value: pendingMatches },
  ];
  
  const COLORS = ['#0f7d5f', '#f59e0b'];

  const teamScores = {};
  matches.forEach(m => {
    if (m.status === 'completed') {
       if (m.teamA?.name) teamScores[m.teamA.name] = (teamScores[m.teamA.name] || 0) + m.scoreA;
       if (m.teamB?.name) teamScores[m.teamB.name] = (teamScores[m.teamB.name] || 0) + m.scoreB;
    }
  });
  
  const barData = Object.keys(teamScores).map(name => ({
    name,
    points: teamScores[name]
  })).sort((a,b) => b.points - a.points).slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mt-6 col-span-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Advanced Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Match Completion Status</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={matchStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {matchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Top Scoring Teams</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false}/>
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="points" fill="#0f7d5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
