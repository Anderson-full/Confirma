"use client";

import { useState, useEffect, useRef } from "react";
import { createRsvp, getEventConfig } from "@/actions/rsvp"; 
import { CheckCircle2, Calendar, Loader2, Mail, User, Sparkles, Volume2, VolumeX, Phone } from "lucide-react";

export default function RsvpPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Agora guardamos a data original do banco para facilitar a conversão no telemóvel
  const [eventDates, setEventDates] = useState({
    start: "2026-10-15T22:00:00.000Z",
    end: "2026-10-16T00:00:00.000Z"
  });

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const fetchDates = async () => {
      const res = await getEventConfig();
      if (res.success && res.start && res.end) {
        setEventDates({
          start: res.start,
          end: res.end
        });
      }
    };
    fetchDates();

    const timer = setTimeout(() => {
      setShowForm(true);
      setTimeout(() => setFadeIn(true), 50);
    }, 9000);
    
    return () => clearTimeout(timer);
  }, []);

  const eventDetails = {
    title: "Mentoria Comunique com Autoridade",
    location: "Google Meet",
    description: "Encontro ao vivo para alinhamento e próximos passos da mentoria.",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await createRsvp(nome, email, telefone);

      if (response.success) {
        setUserName(response.nome || nome || "Mentorando");
        setIsSuccess(true);
      } else {
        setError(response.error || "Erro desconhecido.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // A Mágica do Calendário Nativo (Deep Link)
  const handleCalendarClick = () => {
    const startDate = new Date(eventDates.start);
    const endDate = new Date(eventDates.end);
    
    // Tempos em milissegundos para o Android
    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime();

    // Detetar se é Android ou iPhone
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    if (isAndroid) {
      // Abre DIRETAMENTE a APP Calendário do Android (sem baixar arquivo)
      const intentUrl = `intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.item/event;S.title=${encodeURIComponent(eventDetails.title)};S.description=${encodeURIComponent(eventDetails.description)};S.eventLocation=${encodeURIComponent(eventDetails.location)};l.beginTime=${startMillis};l.endTime=${endMillis};end;`;
      window.location.href = intentUrl;
    } else {
      // Para iPhone (iOS) e Web: Abre o formato suportado pela Apple direto no ecrã
      const formatICSDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Mentoria Comunique//PT",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");

      if (isIOS) {
        // No iPhone, ele interpreta esta string e abre a janela de adicionar evento na hora!
        window.location.href = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
      } else {
        // Se for no Computador, faz o processo normal
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "mentoria-comunique.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 scale-105 filter brightness-90" src="/fundo.mp4"></video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-10 backdrop-blur-[2px]"></div>

      <button onClick={toggleSound} className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 bg-black/70 hover:bg-red-950 text-white px-5 py-3 rounded-full backdrop-blur-xl border border-white/20 transition-all hover:scale-105 shadow-2xl group">
        {isMuted ? (
          <><VolumeX className="h-5 w-5 text-red-500 group-hover:rotate-12 transition-transform" /><span className="text-sm font-semibold tracking-wide">Ouvir Som</span></>
        ) : (
          <><Volume2 className="h-5 w-5 text-red-500 animate-pulse" /><span className="text-sm font-semibold tracking-wide">Silenciar</span></>
        )}
      </button>

      <div className="relative z-20 w-full max-w-md flex flex-col items-center mt-8">
        {showForm && (
          <div className={`w-full bg-zinc-950/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 transition-all duration-1000 ease-out transform text-white ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-[0_0_15px_rgba(220,38,38,0.7)]"></div>
            <div className="p-8 sm:p-10">
              {!isSuccess ? (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center mb-2">
                      <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-2xl shadow-inner"><Sparkles className="h-7 w-7 text-red-500" /></div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Confirme a sua presença</h1>
                    <p className="text-zinc-400 text-xs tracking-wider uppercase font-medium">Mentoria <span className="font-bold text-red-500 normal-case">Comunique com Autoridade</span></p>
                  </div>

                  <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="nome" className="text-xs font-bold text-zinc-300 ml-1 uppercase tracking-wider">Nome Completo</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <input id="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:bg-zinc-900 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium shadow-inner" placeholder="Como gosta de ser chamado?" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="telefone" className="text-xs font-bold text-zinc-300 ml-1 uppercase tracking-wider">WhatsApp</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <input id="telefone" type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:bg-zinc-900 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium shadow-inner" placeholder="(85) 90000-0000" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-zinc-300 ml-1 uppercase tracking-wider">E-mail Profissional</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:bg-zinc-900 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm font-medium shadow-inner" placeholder="o-seu-melhor@email.com" />
                      </div>
                    </div>

                    {error && <div className="p-3 bg-red-950/90 border border-red-800/80 text-red-300 text-xs rounded-xl font-medium text-center shadow-lg">{error}</div>}

                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-semibold py-4 rounded-2xl shadow-[0_10px_25px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center text-sm disabled:opacity-70 mt-4">
                      {isLoading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> A processar...</> : "Garantir o meu lugar"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center"><div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-full relative shadow-lg"><CheckCircle2 className="h-10 w-10 text-emerald-400 relative z-10 animate-bounce" /></div></div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Presença Confirmada, {userName ? userName.split(" ")[0] : "Mentorando"}! 🎉</h2>
                    <p className="text-zinc-400 text-xs leading-relaxed">O seu lugar está garantido com sucesso. Adicione o evento à sua agenda para não perder nada:</p>
                  </div>
                  <div className="space-y-3 pt-4">
                    
                    {/* ESTE É O NOVO BOTÃO ÚNICO! */}
                    <button onClick={handleCalendarClick} className="w-full flex items-center justify-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold py-4 rounded-2xl transition-all text-sm shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:border-red-500/50">
                      <Calendar className="h-5 w-5 text-red-500" /> 
                      Adicionar ao Calendário do Celular
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}