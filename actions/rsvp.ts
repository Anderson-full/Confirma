"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createRsvp(nome: string, email: string, telefone: string) {
  try {
    // @ts-ignore
    const rsvp = await (prisma.rsvp || prisma.rSVP).create({
      data: {
        nome,
        email,
        telefone,
      },
    });
    return { success: true, nome: rsvp.nome };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Este e-mail já está registado." };
    }
    return { success: false, error: "Erro ao guardar RSVP." };
  }
}

// Esta é a nova função que envia a data do painel Admin para o formulário
export async function getEventConfig() {
  try {
    const config = await prisma.configuracao.findFirst();
    if (config) {
      return { 
        success: true, 
        start: config.dataInicio.toISOString(), 
        end: config.dataFim.toISOString() 
      };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}