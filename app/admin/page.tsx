"use client";

import { useState } from "react";
import { getDashboardData, updateDatas } from "../../actions/admin"; 
import { Lock, Users, Calendar, Save, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [senha, setSenha] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await getDashboardData(senha);
    if (res.success) {
      setRsvps(res.rsvps || []);
      setConfig(res.config);
      
      const start = new Date(res.config?.dataInicio).toISOString().slice(0, 16);
      const end = new Date(res.config?.dataFim).toISOString().slice(0, 16);
      setDataInicio(start);
      setDataFim(end);
      
      setIsLogged(true);
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  };

  const handleSaveDates = async () => {
    setIsSaving(true);
    const res = await updateDatas(config.id, dataInicio, dataFim);
    if (res.success) {
      alert("Data atualizada com sucesso!");
    } else {
      alert("Erro ao atualizar data.");
    }
    setIsSaving(false);
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900/80 p-8 rounded-3xl border border-white/10 w-full max-w-sm space-y-6 shadow-2xl">
          <div className="flex justify-center">
            <Lock className="text-red-600 h-10 w-10" />
          </div>
          <h1 className="text-white text-xl font-bold text-center">Acesso Restrito</h1>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha de Admin"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-red-600 outline-none text-center"
          />
          <button type="submit" disabled={isLoading} className="w-full bg-red-700 text-white p-3 rounded-xl font-bold flex justify-center hover:bg-red-800 transition-colors">
            {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="border-b border-zinc-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard <span className="text-red-600">Comunique</span></h1>
            <p className="text-zinc-400 mt-1">Gestão de inscrições e configurações.</p>
          </div>
          <div className="bg-zinc-900 px-4 py-2 rounded-xl flex items-center gap-3 border border-zinc-800">
            <Users className="text-red-500 h-5 w-5" />
            <span className="font-bold">{rsvps.length} Confirmados</span>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 h-fit space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" /> Data do Evento
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 uppercase font-bold ml-1">Início (Data e Hora)</label>
                <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1 outline-none focus:border-red-600" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase font-bold ml-1">Fim (Data e Hora)</label>
                <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1 outline-none focus:border-red-600" />
              </div>
              <button onClick={handleSaveDates} disabled={isSaving} className="w-full bg-zinc-800 hover:bg-red-700 text-white p-3 rounded-xl font-bold flex justify-center gap-2 transition-all border border-zinc-700 hover:border-red-600">
                {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                Guardar Data
              </button>
            </div>
          </div>

          <div className="md:col-span-2 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 overflow-hidden">
            <h2 className="text-xl font-bold mb-6">Inscritos Recentes</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/50 text-zinc-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="px-4 py-3 rounded-r-lg">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp, idx) => (
                    <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-white">{rsvp.nome}</td>
                      <td className="px-4 py-4">{rsvp.email}</td>
                      <td className="px-4 py-4">{rsvp.telefone || "-"}</td>
                      <td className="px-4 py-4">{new Date(rsvp.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}</td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-zinc-500">Nenhuma confirmação ainda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}