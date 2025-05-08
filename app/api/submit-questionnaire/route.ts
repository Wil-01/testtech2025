import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '../../../generated/prisma';
import { questions, QuestionType } from '@/lib/questions';

const generateServerFormSchema = () => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  questions.forEach(question => {
    let baseSchema: z.ZodTypeAny;

    switch (question.type) {
      case QuestionType.TEXT:
        baseSchema = z.string(); 
        if (question.required) {
          baseSchema = (baseSchema as z.ZodString).min(1, { message: "Ce champ est requis." });
        } else {
          baseSchema = (baseSchema as z.ZodString).optional().default("");
        }
        break;
      case QuestionType.NUMBER:
        baseSchema = z.preprocess(
          (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
          z.number({ invalid_type_error: "Doit être un nombre." })
        );
        if (question.required) {
          // Si min(0) est requis: baseSchema = (baseSchema as z.ZodNumber).min(0);
        } else {
          baseSchema = (baseSchema as z.ZodNumber).optional().nullable();
        }
        break;
      case QuestionType.RADIO:
        baseSchema = z.string({ required_error: "Veuillez sélectionner une option." });
        if (!question.required) {
          baseSchema = (baseSchema as z.ZodString).optional();
        }
        break;
      case QuestionType.MULTI_SELECT:
        baseSchema = z.array(z.string(), { required_error: "Veuillez faire au moins un choix." });
        if (question.required) {
          baseSchema = (baseSchema as z.ZodArray<z.ZodString>).min(1, { message: "Veuillez sélectionner au moins une option." });
        } else {
          baseSchema = (baseSchema as z.ZodArray<z.ZodString>).optional().default([]);
        }
        break;
      case QuestionType.TEXTAREA:
        baseSchema = z.string();
        if (question.required) {
          baseSchema = (baseSchema as z.ZodString).min(1, { message: "Ce champ est requis." });
        } else {
          baseSchema = (baseSchema as z.ZodString).optional().default("");
        }
        break;
      default:
        const exhaustiveCheck: never = question.type; 
        throw new Error(`Type de question inconnu dans le schéma serveur: ${exhaustiveCheck}`);
    }
    schemaFields[question.id] = baseSchema;
  });
  return z.object(schemaFields);
};

const serverFormSchema = generateServerFormSchema();

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = serverFormSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation Error (API):", validationResult.error.flatten());
      return NextResponse.json(
        {
          message: "Données invalides.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const newResponse = await prisma.surveyResponse.create({
      data: {
        answers: validatedData,
      },
    });

    console.log("Nouvelle réponse enregistrée:", newResponse.id);

    return NextResponse.json(
      {
        message: "Réponses enregistrées avec succès !",
        responseId: newResponse.id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur API (submit-questionnaire):", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}