"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardData(senha: string) {
  if (senha !== "autoridade2026") {
    return { success: false, error: "Senha incorreta." };
  }

  try {
    // @ts-ignore
    const rsvps = await (prisma.rsvp || prisma.rSVP).findMany({
      orderBy: { criadoEm: 'desc' }
    });

    let config = await prisma.configuracao.findFirst();

    if (!config) {
      config = await prisma.configuracao.create({
        data: {
          dataInicio: new Date("2026-10-15T22:00:00Z"),
          dataFim: new Date("2026-10-16T00:00:00Z")
        }
      });
    }

    return { success: true, rsvps, config };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao ligar à base de dados." };
  }
}

export async function updateDatas(id: string, start: string, end: string) {
  try {
    await prisma.configuracao.update({
      where: { id },
      data: {
        dataInicio: new Date(start),
        dataFim: new Date(end)
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar a data." };
  }
}