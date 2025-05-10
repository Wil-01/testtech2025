export interface QuestionOption {
    value: string;
    label: string;
  }
  
  export enum QuestionType {
    TEXT = 'text',
    NUMBER = 'number',
    RADIO = 'radio',
    MULTI_SELECT = 'multi-select', 
    TEXTAREA = 'textarea',
  }
  
  export interface Question {
    id: string; 
    title: string;
    description?: string;
    type: QuestionType;
    options?: QuestionOption[]; 
    placeholder?: string;
    required?: boolean; 
  }
  
  export const questionnaireHeader = {
    imageUrl: "/images/avatar.png", 
    title: "Questionnaire tech",
    description: "Bienvenue dans notre questionnaire. Vos réponses nous sont précieuses !",
  };
  
  export const questions: Question[] = [
    {
      id: 'fullName',
      title: 'Votre nom complet',
      description: 'Merci d\'indiquer votre nom et prénom.',
      type: QuestionType.TEXT,
      placeholder: 'Ex: Marie Curie',
      required: true,
    },
    {
      id: 'experienceYears',
      title: 'Années d\'expérience',
      description: 'Combien d\'années d\'expérience avez-vous dans ce domaine ?',
      type: QuestionType.NUMBER,
      placeholder: 'Ex: 5',
      required: true,
    },
    {
      id: 'preferredStack',
      title: 'Votre stack de prédilection',
      description: 'Quelle est votre stack technologique préférée ?',
      type: QuestionType.RADIO,
      required: true,
      options: [
        { value: 'react_next', label: 'React / Next.js' },
        { value: 'vue_nuxt', label: 'Vue / Nuxt.js' },
        { value: 'angular', label: 'Angular' },
        { value: 'other', label: 'Autre (précisez dans les commentaires)' },
      ],
    },
    {
      id: 'usedShadcnComponents',
      title: 'Composants Shadcn/ui utilisés',
      description: 'Quels composants Shadcn/ui avez-vous déjà utilisés ? (Plusieurs choix possibles)',
      type: QuestionType.MULTI_SELECT,
      required: true, 
      options: [
        { value: 'button', label: 'Button' },
        { value: 'input', label: 'Input' },
        { value: 'dialog', label: 'Dialog' },
        { value: 'toast', label: 'Toast' },
        { value: 'checkbox', label: 'Checkbox' },
      ],
    },
    {
      id: 'isDeveloper',
      title: 'Êtes-vous développeur ?',
      type: QuestionType.RADIO,
      required: true, 
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
      ],
    },
    {
      id: 'mainLanguage',
      title: 'Quel est votre langage de programmation principal ?',
      description: 'Cette question s\'affiche si vous avez répondu "Oui" à la précédente.',
      type: QuestionType.TEXT,
      placeholder: 'Ex: TypeScript, Python, Java...',
      required: false, 
    },
    {
      id: 'generalFeedback',
      title: 'Vos remarques générales',
      description: 'Avez-vous des commentaires, suggestions ou retours à nous faire parvenir ?',
      type: QuestionType.TEXTAREA,
      placeholder: 'Exprimez-vous librement ici...',
      required: false,
    },
  ];