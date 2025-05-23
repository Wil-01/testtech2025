"use client";

// React et hooks essentiels pour la gestion du formulaire et des effets secondaires.
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import { questions, questionnaireHeader, Question, QuestionType } from "@/lib/questions";

// Génération Dynamique du Schéma de Validation Zod
// COnstruction du schéma Zod basé sur la configuration des questions.
const generateFormSchema = () => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  questions.forEach(question => {
    let baseSchema: z.ZodTypeAny;

    switch (question.type) {
      case QuestionType.TEXT:
        baseSchema = z.string({
          required_error: "Ce champ est requis.",
          invalid_type_error: "Doit être une chaîne de caractères.",
        });
        if (question.id === 'mainLanguage') { 
          baseSchema = (baseSchema as z.ZodString).optional().default("");
        } else if (question.required) {
          baseSchema = (baseSchema as z.ZodString).min(1, { message: "Ce champ est requis." });
        } else {
          baseSchema = (baseSchema as z.ZodString).optional().default("");
        }
        break;
      case QuestionType.NUMBER:
        baseSchema = z.preprocess(
          (val) => {
            if (typeof val === 'string' && val.trim() === '') return undefined;
            if (val === null || val === undefined) return undefined;
            const num = Number(val);
            return isNaN(num) ? val : num;
          },
          z.number({ invalid_type_error: "Veuillez entrer un nombre valide." })
        );
        if (question.required) {
          // .min(0) 
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
        baseSchema = z.string({
          required_error: "Ce champ est requis.",
          invalid_type_error: "Doit être une chaîne de caractères.",
        });
        if (question.required) {
          baseSchema = (baseSchema as z.ZodString).min(1, { message: "Ce champ est requis." });
        } else {
          baseSchema = (baseSchema as z.ZodString).optional().default("");
        }
        break;
      default:
        const exhaustiveCheck: never = question.type;
        throw new Error(`Type de question inconnu: ${exhaustiveCheck}`);
    }
    schemaFields[question.id] = baseSchema;
  });

  const baseObjectSchema = z.object(schemaFields);

  // Ajout d'une validation inter-champs (superRefine) pour la logique conditionnelle
  return baseObjectSchema.superRefine((data, ctx) => {
    if (data.isDeveloper === 'yes') {
      if (!data.mainLanguage || (typeof data.mainLanguage === 'string' && data.mainLanguage.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le langage principal est requis si vous êtes développeur.",
          path: ['mainLanguage'],
        });
      }
    }
  });
};

const formSchema = generateFormSchema(); 
type FormValues = z.infer<typeof formSchema>; 

// Génération des Valeurs par Défaut du Formulaire
const getDefaultValues = (): FormValues => {
  const defaultValues: Partial<FormValues> = {};
  questions.forEach(q => {
    const key = q.id as keyof FormValues;
    if (q.type === QuestionType.MULTI_SELECT) {
      defaultValues[key] = [];
    } else if (q.type === QuestionType.NUMBER) {
      defaultValues[key] = undefined;
    } else {
      defaultValues[key] = "";
    }
  });
  return defaultValues as FormValues;
}

// Composant Principal de la Page Questionnaire
export default function QuestionnairePage() {
  const router = useRouter(); 
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const { watch, setValue, clearErrors } = form; 
  const isLoading = form.formState.isSubmitting; 

  // Surveille la valeur du champ 'isDeveloper' pour afficher/cacher 'mainLanguage'
  const isDeveloperValue = watch('isDeveloper');

  useEffect(() => {
    if (isDeveloperValue !== 'yes') {
      setValue('mainLanguage', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
      clearErrors('mainLanguage');
    }
  }, [isDeveloperValue, setValue, clearErrors]);

  // Gestion de la Soumission du Formulaire
  async function onSubmit(data: FormValues) {
    const submissionToastId = "form-submission-toast";
    toast.loading("Formulaire en cours d'envoi...", {
      id: submissionToastId,
      description: "Veuillez patienter.",
    });

    try {
      const response = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) { 
        console.error("Erreur API:", result);
        toast.error("Erreur lors de l'envoi des réponses.", {
          id: submissionToastId,
          description: result.message || "Une erreur s'est produite. Veuillez réessayer.",
          duration: 5000,
        });
        return;
      }

      // Succès de la soumission
      toast.success("Réponses enregistrées avec succès !", {
        id: submissionToastId,
        description: `Merci ! Votre ID de réponse est : ${result.responseId || ''}`,
        duration: 7000,
      });

      form.reset(); 
      router.push(`/test-technique/merci?responseId=${result.responseId || ''}`);

    } catch (error) { 
      console.error("Erreur réseau ou fetch:", error);
      toast.error("Erreur réseau.", {
        id: submissionToastId,
        description: "Impossible de joindre le serveur. Veuillez vérifier votre connexion.",
        duration: 5000,
      });
    }
  }

  // Fonction qui génère le JSX pour chaque question en fonction de son type
  const renderQuestionField = (question: Question) => {
    if (question.id === 'mainLanguage' && isDeveloperValue !== 'yes') {
      return null;
    }

    // Utilisation de FormField de Shadcn pour intégrer chaque champ avec react-hook-form
    return (
      <FormField
        key={question.id}
        control={form.control}
        name={question.id as keyof FormValues}
        render={({ field }) => (
          <FormItem className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
            <FormLabel className="text-lg font-semibold">{question.title}</FormLabel>
            {question.description && (
              <FormDescription className="text-sm text-muted-foreground mb-2">
                {question.description}
              </FormDescription>
            )}
            <FormControl>
              {(() => { 
                switch (question.type) {
                  case QuestionType.TEXT:
                    return <Input placeholder={question.placeholder} {...field} />;
                  case QuestionType.NUMBER:
                    return (
                      <Input
                        type="number"
                        placeholder={question.placeholder}
                        {...field}
                        value={field.value === null || field.value === undefined ? '' : String(field.value)}
                        onChange={e => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : Number(val));
                        }}
                      />
                    );
                  case QuestionType.TEXTAREA:
                    return <Textarea placeholder={question.placeholder} {...field} />;
                  case QuestionType.RADIO:
                    if (question.options && question.options.length > 0) {
                      return (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value as string | undefined}
                          className="flex flex-col space-y-1"
                        >
                          {question.options.map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                              </FormControl>
                              <FormLabel htmlFor={`${field.name}-${option.value}`} className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      );
                    }
                    return <p className="text-red-500">Configuration incorrecte: Options manquantes pour la question radio "{question.title}"</p>;
                  case QuestionType.MULTI_SELECT:
                    if (question.options && question.options.length > 0) {
                      return (
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <FormField
                              key={option.value}
                              control={form.control}
                              name={question.id as keyof FormValues}
                              render={({ field: multiSelectControllerField }) => {
                                const currentValues = (multiSelectControllerField.value as string[] | undefined) || [];
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={currentValues.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                          const newValues = checked
                                            ? [...currentValues, option.value]
                                            : currentValues.filter((value) => value !== option.value);
                                          multiSelectControllerField.onChange(newValues);
                                        }}
                                        id={`${multiSelectControllerField.name}-${option.value}`}
                                      />
                                    </FormControl>
                                    <FormLabel htmlFor={`${multiSelectControllerField.name}-${option.value}`} className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      );
                    }
                    return <p className="text-red-500">Configuration incorrecte: Options manquantes pour la question multi-select "{question.title}"</p>;
                  default:
                    const exhaustiveCheck: never = question.type;
                    return <p>Type de question non supporté: {exhaustiveCheck}</p>;
                }
              })()}
            </FormControl>
            <FormMessage /> 
          </FormItem>
        )}
      />
    );
  };

  // Structure de la Page
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      {/* En-tête du questionnaire (image, titre, description globale) */}
      <div className="mb-8 text-center">
        {questionnaireHeader.imageUrl && (questionnaireHeader.imageUrl.startsWith('http') || questionnaireHeader.imageUrl.startsWith('/')) && (
           <Image
            src={questionnaireHeader.imageUrl}
            alt="En-tête du questionnaire"
            width={600}
            height={200}
            className="mx-auto mb-4 rounded-lg object-cover"
            priority
          />
        )}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {questionnaireHeader.title}
        </h1>
        <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-300">
          {questionnaireHeader.description}
        </p>
      </div>
      <hr className="my-8" />

      {/* Composant Form de Shadcn qui wrappe le formulaire HTML natif */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {questions.map((question) => {
            const fieldElement = renderQuestionField(question);
            if (!fieldElement) return null;

            // Wrapper conditionnel pour l'animation de la question 'mainLanguage'
            if (question.id === 'mainLanguage') {
              return (
                <div
                  key={question.id}
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isDeveloperValue === 'yes' ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0' 
                  }`}
                >
                  {fieldElement}
                </div>
              );
            }
            return fieldElement;
          })}
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Envoi en cours..." : "Envoyer mes réponses"}
          </Button>
        </form>
      </Form>
      {/* Conteneur pour les notifications Toast */}
      <SonnerToaster richColors position="top-right" />
    </div>
  );
}