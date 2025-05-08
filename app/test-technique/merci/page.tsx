import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react'; 

export default function ThankYouPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] flex-col items-center justify-center py-12 text-center">
      <CheckCircleIcon className="h-16 w-16 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
        Merci pour vos réponses !
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
        Votre questionnaire a été soumis avec succès. Nous apprécions votre temps et vos retours.
      </p>

      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/test-technique">Répondre à nouveau</Link>
        </Button>
      </div>
    </div>
  );
}