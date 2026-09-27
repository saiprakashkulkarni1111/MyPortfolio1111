import React from 'react';
import { 
  GraduationCap, 
  Award, 
  Users2, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Sparkles,
  Trophy,
  BadgeCheck
} from 'lucide-react';
import { EDUCATION_DATA, QUALIFICATIONS_DATA } from '../data/portfolioData';

export const TimelineEducation: React.FC = () => {
  return (
    <section id="timeline" className="py-16 md:py-24 border-t border-cyan-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>ACADEMIC FOUNDATION & ACCREDITATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-100 tracking-tight">
            Education & Certifications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-sans-modern mt-1 max-w-2xl">
            Formal engineering degree in Artificial Intelligence & Machine Learning paired with distinguished enterprise cloud and generative AI certifications.
          </p>
        </div>

        {/* Two-Column Grid: Education (Left) & Certifications/Leadership (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Academic Degrees */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>FORMAL ACADEMIC DEGREES</span>
            </div>

            <div className="space-y-4">
              {EDUCATION_DATA.map((edu, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-cyan-900/40 bg-[#090d18] hover:border-cyan-500/40 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-cyan-950 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-100">{edu.institution}</h3>
                      <div className="text-sm font-sans-modern text-cyan-300 font-medium">
                        {edu.degree} — {edu.field}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs font-bold">
                      {edu.score}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {edu.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {edu.location}
                    </span>
                  </div>

                  {edu.highlights && (
                    <div className="space-y-1.5 pt-1">
                      {edu.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans-modern">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Certifications & Leadership */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>CERTIFICATIONS & CAMPUS LEADERSHIP</span>
            </div>

            <div className="space-y-3.5">
              {QUALIFICATIONS_DATA.map((cert, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-cyan-950 bg-[#090d18] hover:border-cyan-500/30 transition-all flex items-start gap-4"
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                    cert.type === 'award'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                      : cert.type === 'leadership'
                      ? 'bg-purple-950/40 border-purple-500/40 text-purple-400'
                      : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400'
                  }`}>
                    {cert.type === 'award' ? (
                      <Trophy className="w-5 h-5" />
                    ) : cert.type === 'leadership' ? (
                      <Users2 className="w-5 h-5" />
                    ) : (
                      <BadgeCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className="font-display font-semibold text-slate-100 text-sm">
                        {cert.title}
                      </h4>
                      <span className="text-[11px] font-mono-code text-slate-400">
                        {cert.year}
                      </span>
                    </div>

                    <div className="text-xs font-mono-code text-cyan-400 mt-0.5">
                      Issuer: {cert.issuer} {cert.badge && `• [${cert.badge}]`}
                    </div>

                    <p className="text-xs text-slate-300 mt-2 font-sans-modern leading-relaxed">
                      {cert.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
