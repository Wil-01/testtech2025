"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

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
        if (question.required) {
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
          // baseSchema = (baseSchema as z.ZodNumber).min(0, "Doit être positif ou nul.");
        } else {
          baseSchema = (baseSchema as z.ZodNumber).optional().nullable();
        }
        break;
      case QuestionType.RADIO:
        baseSchema = z.string({ required_error: "Veuillez sélectionner une option." });
        if (!question.required) { // Si non requis, le rendre optionnel
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

  return z.object(schemaFields);
};

const formSchema = generateFormSchema();
type FormValues = z.infer<typeof formSchema>;

const getDefaultValues = (): FormValues => {
  const defaultValues: Partial<FormValues> = {};
  questions.forEach(q => {
    if (q.type === QuestionType.MULTI_SELECT) {
      defaultValues[q.id as keyof FormValues] = [] as any;
    } else if (q.type === QuestionType.NUMBER) {
      defaultValues[q.id as keyof FormValues] = undefined as any;
    } else {
      defaultValues[q.id as keyof FormValues] = "" as any;
    }
  });
  return defaultValues as FormValues;
}

export default function QuestionnairePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: FormValues) {
    console.log("Données du formulaire soumises:", data);
    toast.loading("Formulaire en cours d'envoi...", {
      description: "Veuillez patienter.",
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success("Réponses (simulées) envoyées !", {
      description: (
        <pre className="mt-2 w-full max-w-[340px] overflow-x-auto rounded-md bg-slate-900 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      duration: 5000,
    });
  }

  const renderQuestionField = (question: Question) => {
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

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-8 text-center">
        {questionnaireHeader.imageUrl && questionnaireHeader.imageUrl.startsWith('http') && ( 
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {questions.map(renderQuestionField)}
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Envoi en cours..." : "Envoyer mes réponses"}
          </Button>
        </form>
      </Form>
      <SonnerToaster richColors position="top-right" />
    </div>
  );
}