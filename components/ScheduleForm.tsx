"use client";

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Square, Play, Trash2, Check, ArrowRight, Loader2, Pause, Clock, AlertCircle } from 'lucide-react';
import { submitMeetingRequest, MeetingRequestPayload, checkAvailability } from '@/lib/api';

export default function ScheduleForm() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    problem: '',
    urgency: '',
  });
  const [improvementAreas, setImprovementAreas] = useState<string[]>([]);
  
  // Availability State
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [confirmedTime, setConfirmedTime] = useState<{ date: string; time: string } | null>(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Submission State
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [successData, setSuccessData] = useState<any>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus effect for form sections
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        const sections = gsap.utils.toArray<HTMLElement>('.form-section');
        
        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }, containerRef);
      
      return () => ctx.revert();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'preferredDate' || name === 'preferredTime' || name === 'timezone') {
      setAvailabilityStatus('idle');
      setConfirmedTime(null);
    }
  };

  const toggleImprovementArea = (area: string) => {
    setImprovementAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  // Availability Check
  const isTimeValid = formData.preferredDate && formData.preferredTime && formData.timezone;
  
  const handleCheckAvailability = async () => {
    if (!isTimeValid) return;
    setAvailabilityStatus('checking');
    try {
      const response = await checkAvailability({
        date: formData.preferredDate,
        time: formData.preferredTime,
        timezone: formData.timezone
      });
      if (response.available) {
        setAvailabilityStatus('available');
        setConfirmedTime({ date: formData.preferredDate, time: formData.preferredTime });
      } else {
        setAvailabilityStatus('unavailable');
        setAlternatives(response.alternatives || []);
        setConfirmedTime(null);
      }
    } catch (e) {
      setAvailabilityStatus('idle');
    }
  };

  const selectAlternative = (time: string) => {
    setFormData(prev => ({ ...prev, preferredTime: time }));
    setAvailabilityStatus('idle');
  };

  // Recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access was blocked. You can still describe your problem by typing below.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Submit Handler
  const isSubmitValid = !!(
    formData.name && 
    formData.email && 
    confirmedTime && 
    formData.preferredDate === confirmedTime.date && 
    formData.preferredTime === confirmedTime.time &&
    (formData.problem.trim() !== '' || audioBlob !== null)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitValid) return;
    setStatus('submitting');
    setErrorMsg(null);
    
    try {
      const payload: MeetingRequestPayload = {
        ...formData,
        improvementAreas,
        voiceRecording: audioBlob
      };
      
      const response = await submitMeetingRequest(payload);
      
      if (response.success) {
        setSuccessData(response);
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (response.message && response.message.includes("unavailable")) {
            setAvailabilityStatus('unavailable');
            setAlternatives(response.details?.alternatives ? JSON.parse(response.details.alternatives) : []);
            setConfirmedTime(null);
            setStatus('idle');
            setErrorMsg("That time was just taken.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setStatus('error');
            setErrorMsg(response.message || "Network / Server Error. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg("Network / Server Error. Please try again.");
    }
  };

  if (status === 'success' && successData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6" ref={containerRef}>
        <div className="w-16 h-16 rounded-full bg-flownex-pink/20 flex items-center justify-center mb-8 border border-flownex-pink shadow-[0_0_20px_rgba(255,42,109,0.3)]">
          <Check className="w-8 h-8 text-flownex-pink" />
        </div>
        <h2 className="font-headline text-4xl md:text-6xl font-bold uppercase tracking-wider text-flownex-white mb-4">
          REQUEST RECEIVED.
        </h2>
        <p className="font-body text-flownex-white/70 text-lg mb-2">
          We&apos;ve got it. The calendar invitation has been sent.
        </p>
        {successData.leadId && (
            <div className="inline-block px-4 py-1 border border-flownex-white/20 rounded-full font-mono text-sm text-flownex-pink font-bold mb-8 shadow-[0_0_10px_rgba(255,42,109,0.1)]">
            Reference ID: {successData.leadId}
            </div>
        )}
        
        <div className="w-full max-w-md mx-auto bg-flownex-white/5 border border-flownex-white/10 rounded-2xl p-6 text-left mb-16">
            <h3 className="font-body text-sm font-bold uppercase tracking-wider text-flownex-white/50 mb-4 border-b border-flownex-white/10 pb-2">Meeting Details</h3>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="font-body text-flownex-white/70 text-sm">Date</span>
                    <span className="font-body text-flownex-white font-bold text-sm">{formData.preferredDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-body text-flownex-white/70 text-sm">Time</span>
                    <span className="font-body text-flownex-white font-bold text-sm">{formData.preferredTime}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-body text-flownex-white/70 text-sm">Timezone</span>
                    <span className="font-body text-flownex-white font-bold text-sm">{formData.timezone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-body text-flownex-white/70 text-sm">Status</span>
                    <span className="font-body text-flownex-pink font-bold text-sm uppercase">{successData.meetingStatus || 'Confirmed'}</span>
                </div>
                {successData.meetingLink && (
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-flownex-white/10">
                        <span className="font-body text-flownex-white/70 text-sm">Meeting Link</span>
                        <a href={successData.meetingLink} target="_blank" rel="noopener noreferrer" className="font-body text-flownex-pink hover:text-flownex-pink-light font-bold text-sm underline truncate max-w-[200px]">Join Meeting</a>
                    </div>
                )}
            </div>
        </div>

      </div>
    );
  }

  return (
    <div className="w-full" ref={containerRef}>
      <form onSubmit={handleSubmit} className="space-y-24">
        {/* Section 01 */}
        <section className="form-section space-y-8">
          <h2 className="font-headline text-flownex-pink text-lg font-bold tracking-widest uppercase border-b border-flownex-white/10 pb-4">
            WHEN SHOULD WE TALK?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold uppercase tracking-wider text-flownex-white/60">Preferred Date</label>
              <input 
                required
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                type="date" 
                className="bg-transparent border-b border-flownex-white/20 pb-3 font-body text-lg text-flownex-white focus:outline-none focus:border-flownex-pink transition-colors rounded-none [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold uppercase tracking-wider text-flownex-white/60">Preferred Time</label>
              <input 
                required
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                type="time" 
                className="bg-transparent border-b border-flownex-white/20 pb-3 font-body text-lg text-flownex-white focus:outline-none focus:border-flownex-pink transition-colors rounded-none [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold uppercase tracking-wider text-flownex-white/60">Timezone</label>
              <input 
                readOnly
                name="timezone"
                value={formData.timezone}
                type="text" 
                className="bg-transparent border-b border-flownex-white/20 pb-3 font-body text-lg text-flownex-white/50 focus:outline-none rounded-none cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-start gap-4 mt-6">
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={!isTimeValid || availabilityStatus === 'checking' || availabilityStatus === 'available'}
              className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-body text-xs font-bold tracking-wider uppercase border ${
                  !isTimeValid ? 'border-flownex-white/10 text-flownex-white/30 cursor-not-allowed bg-transparent' : 
                  availabilityStatus === 'available' ? 'border-green-500/50 bg-green-500/10 text-green-400' :
                  'border-flownex-pink text-flownex-pink hover:bg-flownex-pink hover:text-white shadow-[0_0_15px_rgba(255,42,109,0.2)] hover:shadow-[0_0_25px_rgba(255,42,109,0.5)]'
              }`}
            >
              {availabilityStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin" />}
              {availabilityStatus === 'available' && <Check className="w-4 h-4" />}
              {availabilityStatus === 'idle' && <Clock className="w-4 h-4" />}
              {availabilityStatus === 'unavailable' && <Clock className="w-4 h-4" />}
              <span>
                  {availabilityStatus === 'checking' ? 'CHECKING...' : 
                   availabilityStatus === 'available' ? 'TIME CONFIRMED' : 'CHECK AVAILABILITY'}
              </span>
            </button>
            
            {/* Availability Messaging */}
            {availabilityStatus === 'available' && (
                <div className="flex items-center gap-2 text-green-400 font-body text-sm mt-2">
                    <Check className="w-4 h-4" />
                    <span>Your time works for us</span>
                </div>
            )}
            
            {availabilityStatus === 'unavailable' && (
                <div className="flex flex-col gap-4 mt-2 w-full">
                    <div className="flex items-start gap-2 text-red-400 font-body text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <span>Oops — that time isn't available.</span>
                    </div>
                    {alternatives.length > 0 && (
                        <div className="bg-flownex-white/5 border border-flownex-white/10 rounded-xl p-5">
                            <p className="font-body text-sm text-flownex-white/70 mb-4">
                                Our team is available at:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {alternatives.map((altTime, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => selectAlternative(altTime)}
                                        className="px-4 py-2 rounded-full border border-flownex-white/20 text-flownex-white text-sm font-body hover:bg-flownex-white/10 hover:border-flownex-white transition-all"
                                    >
                                        {altTime}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
             {errorMsg === "That time was just taken." && availabilityStatus === 'idle' && (
                 <div className="flex flex-col gap-4 mt-2 w-full">
                    <div className="flex items-start gap-2 text-red-400 font-body text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <span>{errorMsg}</span>
                    </div>
                 </div>
             )}
          </div>
        </section>

        {/* Section 02 */}
        <section className={`form-section space-y-8 transition-opacity duration-500 ${availabilityStatus === 'available' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <h2 className="font-headline text-flownex-pink text-lg font-bold tracking-widest uppercase border-b border-flownex-white/10 pb-4">
            YOUR DETAILS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold uppercase tracking-wider text-flownex-white/60">Full Name</label>
              <input 
                required={availabilityStatus === 'available'}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text" 
                className="bg-transparent border-b border-flownex-white/20 pb-3 font-body text-lg text-flownex-white focus:outline-none focus:border-flownex-pink transition-colors rounded-none"
                placeholder="Jane Doe"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold uppercase tracking-wider text-flownex-white/60">Email Address</label>
              <input 
                required={availabilityStatus === 'available'}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email" 
                className="bg-transparent border-b border-flownex-white/20 pb-3 font-body text-lg text-flownex-white focus:outline-none focus:border-flownex-pink transition-colors rounded-none"
                placeholder="jane@company.com"
              />
            </div>
          </div>
        </section>

        {/* Section 03 */}
        <section className={`form-section space-y-8 transition-opacity duration-500 ${availabilityStatus === 'available' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <h2 className="font-headline text-flownex-pink text-lg font-bold tracking-widest uppercase border-b border-flownex-white/10 pb-4">
            TELL US WHAT&apos;S GOING ON
          </h2>
          
          {/* Voice Interface */}
          <div className="bg-flownex-white/5 border border-flownex-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-flownex-pink to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
            
            {!isRecording && !audioUrl && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-flownex-white/10 hover:bg-flownex-pink hover:text-white transition-all duration-300 flex items-center justify-center mb-6 group/btn shadow-[0_0_0_rgba(255,42,109,0)] hover:shadow-[0_0_30px_rgba(255,42,109,0.5)]"
                >
                  <Mic className="w-6 h-6 transition-transform group-hover/btn:scale-110" />
                </button>
                <h3 className="font-body font-bold text-sm uppercase tracking-wider mb-2">SPEAK YOUR PROBLEM ↗</h3>
                <p className="font-body text-xs text-flownex-white/50 max-w-xs">
                  Save time typing. Just record what you&apos;re struggling with.
                </p>
              </div>
            )}

            {isRecording && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex items-center gap-1 mb-8 h-12">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-flownex-pink rounded-full animate-pulse"
                      style={{ 
                        height: `${Math.max(20, Math.random() * 100)}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s'
                      }}
                    />
                  ))}
                </div>
                
                <div className="font-mono text-3xl font-bold tracking-widest text-flownex-pink mb-6">
                  {formatTime(recordingTime)}
                </div>
                
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-flownex-white/10 hover:bg-white hover:text-black transition-all duration-300 font-body text-xs font-bold uppercase tracking-wider"
                >
                  <Square className="w-4 h-4" />
                  <span>STOP RECORDING</span>
                </button>
              </div>
            )}

            {audioUrl && !isRecording && (
              <div className="flex flex-col py-4">
                <div className="flex items-center justify-between bg-flownex-black/50 rounded-full p-2 border border-flownex-white/10 mb-6">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-10 h-10 rounded-full bg-flownex-pink flex items-center justify-center hover:bg-flownex-pink-light transition-colors shrink-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                  </button>
                  
                  <div className="flex-1 px-4 font-mono text-sm text-flownex-white/70 flex items-center gap-4">
                    <div className="h-1 flex-1 bg-flownex-white/10 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-flownex-pink w-full origin-left" style={{ transform: isPlaying ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 10s linear' }}></div>
                    </div>
                    {formatTime(recordingTime)}
                  </div>

                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="w-10 h-10 rounded-full hover:bg-flownex-white/10 flex items-center justify-center transition-colors shrink-0 text-flownex-white/50 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <audio ref={audioPlayerRef} src={audioUrl} className="hidden" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <label className="font-body text-xs font-bold uppercase tracking-wider text-flownex-white/60">
              {audioUrl ? "AND/OR TYPE IT OUT" : "OR TYPE IT OUT"}
            </label>
            <textarea 
              name="problem"
              value={formData.problem}
              onChange={handleInputChange}
              rows={4}
              required={availabilityStatus === 'available' && !audioUrl}
              className="bg-flownex-white/5 border border-flownex-white/10 p-4 font-body text-lg text-flownex-white focus:outline-none focus:border-flownex-pink transition-colors rounded-xl resize-none"
              placeholder="Tell us about the processes that are slowing you down..."
            />
          </div>
        </section>

        {/* Section 04 - Optional */}
        <section className={`form-section space-y-12 border-t border-flownex-white/10 pt-12 transition-opacity duration-500 ${availabilityStatus === 'available' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="space-y-6">
            <h3 className="font-body text-sm font-bold uppercase tracking-wider text-flownex-white/80">
              WHAT ARE YOU TRYING TO IMPROVE? (OPTIONAL)
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Sales', 'CRM', 'Reporting', 'Internal Operations', 'Data', 'Customer Support', 'Approvals', 'Something Else'].map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleImprovementArea(area)}
                  className={`px-5 py-2.5 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    improvementAreas.includes(area)
                      ? 'bg-flownex-white text-black border-white'
                      : 'bg-transparent border-flownex-white/20 text-flownex-white/60 hover:border-flownex-white/60 hover:text-white'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-body text-sm font-bold uppercase tracking-wider text-flownex-white/80">
              HOW URGENT IS IT?
            </h3>
            <div className="flex flex-wrap gap-3">
              {['LOW', 'NORMAL', 'HIGH', 'ASAP'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                  className={`px-6 py-3 rounded-full font-body text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                    formData.urgency === level
                      ? 'bg-flownex-pink text-white border-flownex-pink shadow-[0_0_20px_rgba(255,42,109,0.3)]'
                      : 'bg-transparent border-flownex-white/20 text-flownex-white/60 hover:border-flownex-white/60 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className={`form-section pt-8 border-t border-flownex-white/10 flex items-center justify-between transition-opacity duration-500 ${availabilityStatus === 'available' ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <p className="font-body text-xs text-flownex-white/40 max-w-xs">
            By submitting this form, you agree to our privacy policy.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting' || !isSubmitValid}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 font-body text-sm font-bold tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SECURING YOUR MEETING...</span>
              </>
            ) : (
              <>
                <span>REQUEST MEETING</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
        
        {status === 'error' && errorMsg !== "That time was just taken." && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-body text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg || "Something went wrong. Please try again or contact us directly."}</span>
          </div>
        )}
      </form>
    </div>
  );
}
