import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  TrendingUp,
  Users,
  Volume2,
  FileText,
  ListCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTradeSync } from '../../context/TradeSyncContext.tsx';
import { AcademyLesson, GamifiedBadge } from '../../types/index.ts';

export const AcademyView: React.FC = () => {
  const {
    lessons,
    completeLesson,
    checklists,
    toggleChecklistItem,
    badges,
  } = useTradeSync();

  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35); // simulated percent
  const [showTranscript, setShowTranscript] = useState(false);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const handleTogglePlay = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const getBadgeIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Award':
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-purple-500/20 dark:text-purple-400 text-[11px] font-bold border border-blue-200 dark:border-purple-500/30">
              Pillar 4: Operational Mastery
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">TradeSync Academy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B192C] dark:text-white tracking-tight">
            2-Minute Micro-Lessons &amp; Daily Checklists
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Bite-sized audio lessons in South African township context that boost your creditworthiness and Business Health Score.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Lessons Finished</span>
            <span className="text-sm font-extrabold text-blue-700 dark:text-purple-400">
              {lessons.filter((l) => l.completed).length} / {lessons.length} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Player on Left, Lessons list on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active 2-Minute Lesson Media Player */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          {activeLesson ? (
            <>
              {/* Category tag & duration */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-purple-500/20 dark:text-purple-300 font-bold text-xs border border-blue-200 dark:border-purple-500/30">
                  {activeLesson.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeLesson.duration}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0B192C] dark:text-white leading-snug">
                  {activeLesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Simulated Audio Player Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleTogglePlay}
                    aria-label={isPlayingAudio ? 'Pause Lesson Audio' : 'Play Lesson Audio'}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                    }`}
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>{isPlayingAudio ? '0:42' : '0:00'}</span>
                      <span className="flex items-center gap-1 text-blue-700 dark:text-purple-400 font-semibold">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Kasi Voice Audio</span>
                      </span>
                      <span>2:04</span>
                    </div>

                    {/* Scrub bar */}
                    <div className="relative w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 cursor-pointer overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 rounded-full"
                        style={{ width: `${isPlayingAudio ? 35 : audioProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Animated Waveform Simulation */}
                {isPlayingAudio && (
                  <div className="flex items-center justify-center gap-1 pt-2">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1 bg-blue-600 dark:bg-purple-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(6, (Math.sin(i * 0.7) * 14 + 16))}%`,
                          animationDelay: `${i * 45}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Checklist for the lesson */}
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ListCheck className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
                  <span>Immediate Actionable Takeaways:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeLesson.actionChecklist.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transcript Drawer Toggle */}
              <div>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showTranscript ? 'Hide Audio Transcript' : 'Read Full Audio Transcript'}</span>
                  {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showTranscript && (
                  <div className="mt-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {activeLesson.audioTranscript}
                  </div>
                )}
              </div>

              {/* Completion CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Reward: +{activeLesson.healthScorePointsReward} pts to Health Score</span>
                </div>

                {activeLesson.completed ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold text-xs border border-blue-200 dark:border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lesson Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => completeLesson(activeLesson.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Finished &amp; Claim Points</span>
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Lessons List on Right */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            2-Minute Micro-Curriculum
          </h3>

          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isSelected = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLessonId(lesson.id);
                    setIsPlayingAudio(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-purple-950/30 border-blue-300 dark:border-purple-500/50 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-purple-400 uppercase">
                      {lesson.category}
                    </span>
                    {lesson.completed && (
                      <span className="text-[10px] text-blue-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Done</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#0B192C] dark:text-white line-clamp-2 leading-snug">
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{lesson.duration}</span>
                    <span>•</span>
                    <span className="text-blue-700 dark:text-emerald-400 font-semibold">+{lesson.healthScorePointsReward} pts</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operational Checklists Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {checklists.map((chk) => {
          const completedCount = chk.items.filter((it) => it.completed).length;
          const pct = Math.round((completedCount / chk.items.length) * 100);

          return (
            <div
              key={chk.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] dark:text-white">{chk.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{chk.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-blue-700 dark:text-emerald-400">
                    {completedCount} / {chk.items.length} Done
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {chk.items.map((it) => (
                  <label
                    key={it.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 transition cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={it.completed}
                      onChange={() => toggleChecklistItem(chk.id, it.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${
                        it.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {it.label}
                    </span>
                    {it.importance === 'CRITICAL' && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                        Critical
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gamified Badges Showcase */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B192C] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Gamified Achievement Badges</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete operational milestones to unlock badges and prove business discipline
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                badge.unlocked
                  ? 'bg-slate-50 dark:bg-slate-950 border-amber-300 dark:border-amber-500/40 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {getBadgeIcon(badge.iconName)}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0B192C] dark:text-white leading-tight">{badge.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 w-full text-[10px] font-semibold">
                {badge.unlocked ? (
                  <span className="text-blue-700 dark:text-emerald-400">+{badge.points} pts (Earned)</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">+{badge.points} pts (Locked)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
