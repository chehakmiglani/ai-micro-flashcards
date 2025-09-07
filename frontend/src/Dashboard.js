import React from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import './App.css';

// Demo data – replace later with Firestore aggregates
const studyVolume = [
  { day: 'Mon', reviews: 24, minutes: 18 },
  { day: 'Tue', reviews: 35, minutes: 22 },
  { day: 'Wed', reviews: 18, minutes: 12 },
  { day: 'Thu', reviews: 42, minutes: 28 },
  { day: 'Fri', reviews: 30, minutes: 20 },
  { day: 'Sat', reviews: 55, minutes: 36 },
  { day: 'Sun', reviews: 40, minutes: 25 },
];

const recallAccuracy = [
  { deck: 'Python', easy: 62, good: 28, hard: 10 },
  { deck: 'JS', easy: 58, good: 30, hard: 12 },
  { deck: 'Math', easy: 70, good: 22, hard: 8 },
];

const srsHealth = [
  { day: 'Mon', interval: 1.2 },
  { day: 'Tue', interval: 1.4 },
  { day: 'Wed', interval: 1.35 },
  { day: 'Thu', interval: 1.6 },
  { day: 'Fri', interval: 1.55 },
  { day: 'Sat', interval: 1.7 },
  { day: 'Sun', interval: 1.65 },
];

const difficultyRadar = [
  { metric: 'Miss Rate', value: 65 },
  { metric: 'Time to Answer', value: 40 },
  { metric: 'Requeue Freq', value: 55 },
  { metric: 'Confusion', value: 45 },
  { metric: 'Hints Used', value: 30 },
];

const retentionCurve = [
  { days: 1, perf: 92 },
  { days: 2, perf: 88 },
  { days: 3, perf: 81 },
  { days: 5, perf: 72 },
  { days: 8, perf: 63 },
  { days: 13, perf: 51 },
  { days: 21, perf: 42 },
];

export default function Dashboard() {
  return (
    <div className="container">
      <h1 className="title">Analytics Dashboard</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center' }}>
        <Link className="btn" to="/">Back to Flashcards</Link>
      </div>

      {/* KPIs */}
      <div className="flashcards-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <div className="flashcard"><div><div className="question">Active Days</div><div className="answer">6 / 7</div></div></div>
        <div className="flashcard"><div><div className="question">Streak</div><div className="answer">4 days</div></div></div>
        <div className="flashcard"><div><div className="question">Reviews/Day</div><div className="answer">41 avg</div></div></div>
        <div className="flashcard"><div><div className="question">Accuracy</div><div className="answer">86%</div></div></div>
      </div>

      {/* Study Volume */}
      <div className="flashcards-list" style={{ marginTop: 20 }}>
        <div className="card-content" style={{ marginBottom: 12 }}>Study Volume (Reviews / Minutes)</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={studyVolume}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reviews" stroke="#f59e42" strokeWidth={2} />
            <Line type="monotone" dataKey="minutes" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recall Accuracy */}
      <div className="flashcards-list" style={{ marginTop: 20 }}>
        <div className="card-content" style={{ marginBottom: 12 }}>Recall Accuracy by Deck</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={recallAccuracy}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="deck" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="easy" stackId="a" fill="#10b981" />
            <Bar dataKey="good" stackId="a" fill="#60a5fa" />
            <Bar dataKey="hard" stackId="a" fill="#f43f5e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SRS Health */}
      <div className="flashcards-list" style={{ marginTop: 20 }}>
        <div className="card-content" style={{ marginBottom: 12 }}>SRS Health (Avg Interval Growth)</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={srsHealth}>
            <defs>
              <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e42" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e42" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="interval" stroke="#f59e42" fillOpacity={1} fill="url(#colorInt)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Deck Difficulty Index */}
      <div className="flashcards-list" style={{ marginTop: 20 }}>
        <div className="card-content" style={{ marginBottom: 12 }}>Deck Difficulty Index</div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={difficultyRadar}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis />
            <Radar name="Difficulty" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Retention Curve */}
      <div className="flashcards-list" style={{ marginTop: 20 }}>
        <div className="card-content" style={{ marginBottom: 12 }}>Retention Curve (Days Since Last Review)</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={retentionCurve}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="days" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="perf" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="flashcards-list" style={{ marginTop: 20 }}>
        <div className="card-content" style={{ marginBottom: 12 }}>Personal Bests & Alerts</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Longest streak: 4 days</li>
          <li>Fastest improvement: Python deck (+12% this week)</li>
          <li>Overdue risk: 18 cards due tomorrow</li>
        </ul>
      </div>
    </div>
  );
}
