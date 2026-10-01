"use client";

import { useState, useEffect, useRef } from "react";
import { createRsvp } from "@/actions/rsvp"; 
import { CheckCircle2, Loader2, Mail, User, Volume2, VolumeX, Phone, ArrowRight } from "lucide-react";

export default function RsvpPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // UX: Reduzido para 800ms. Rápido o suficiente para o utilizador não abandonar a página, 
    // mas com atraso suficiente para o vídeo de fundo causar impacto primeiro.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black selection:bg-red-500/30">
      {/* UI: pointer-events-none impede que o utilizador pause o vídeo sem querer no telemóvel */}
      <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 scale-105 filter brightness-75 pointer-events-none" src="/fundo.mp4"></video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

      {/* UI: Botão de som otimizado para mobile (margens menores em ecrãs pequenos) */}
      <button onClick={toggleSound} className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 bg-black/50 hover:bg-black/80 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 shadow-xl group">
        {isMuted ? (
          <><VolumeX className="h-4 w-4 md:h-5 md:w-5 text-red-500 group-hover:rotate-12 transition-transform" /><span className="text-xs md:text-sm font-semibold tracking-wide">Ouvir Som</span></>
        ) : (
          <><Volume2 className="h-4 w-4 md:h-5 md:w-5 text-red-500 animate-pulse" /><span className="text-xs md:text-sm font-semibold tracking-wide">Silenciar</span></>
        )}
      </button>

      <div className="relative z-20 w-full max-w-md flex flex-col items-center mt-4">
        {/* UX/UI: Animação unificada e mais fluida usando Tailwind */}
        <div className={`w-full bg-zinc-950/70 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden border border-white/5 transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          <div className="h-1.5 w-full bg-gradient-to-r from-red-800 via-red-500 to-red-800 shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
          
          <div className="p-8 sm:p-10">
            {!isSuccess ? (
              <div className="space-y-7">
                <div className="text-center space-y-4">
                  <div className="flex justify-center mb-2">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-red-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <img 
                        src="/perfill.jpg" 
                        alt="Mentoria Comunique" 
                        className="relative h-20 w-auto max-w-[280px] rounded-xl border border-white/10 shadow-2xl object-contain bg-black/40 p-1"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Confirme a sua presença</h1>
                    <p className="text-zinc-400 text-[11px] tracking-[0.2em] uppercase font-semibold">Mentoria <span className="text-red-500 font-bold">Comunique</span></p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="nome" className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">Nome Completo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors duration-300" />
                      <input id="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-white placeholder-zinc-600 focus:bg-zinc-900/80 focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 outline-none transition-all duration-300 text-sm font-medium" placeholder="Como gosta de ser chamado?" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="telefone" className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">WhatsApp</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors duration-300" />
                      <input id="telefone" type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-white placeholder-zinc-600 focus:bg-zinc-900/80 focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 outline-none transition-all duration-300 text-sm font-medium" placeholder="(85) 90000-0000" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">E-mail Profissional</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors duration-300" />
                      <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-white placeholder-zinc-600 focus:bg-zinc-900/80 focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 outline-none transition-all duration-300 text-sm font-medium" placeholder="o-seu-melhor@email.com" />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-950/50 border border-red-900/50 text-red-400 text-xs rounded-xl font-medium text-center backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="group w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.4)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center text-sm disabled:opacity-70 disabled:hover:scale-100 mt-6 border border-red-500/50">
                    {isLoading ? (
                      <><Loader2 className="animate-spin mr-2 h-4 w-4" /> A processar...</>
                    ) : (
                      <>Garantir o meu lugar <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 py-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-full relative shadow-xl backdrop-blur-sm">
                      <CheckCircle2 className="h-12 w-12 text-emerald-400 relative z-10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Presença Confirmada!</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
                    Excelente decisão, <strong className="text-white font-semibold">{userName ? userName.split(" ")[0] : "Mentorando"}</strong>. O seu lugar está garantido. Entraremos em contacto através dos dados fornecidos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}