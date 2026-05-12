import OnboardingForm from './OnboardingForm';

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl w-full mx-auto p-6 md:p-12 overflow-hidden">
      {/* Header */}
      <div className="text-start">
        <h1 className="font-headline text-primary text-4xl font-extrabold">
          Lengkapi Profil Anda
        </h1>
        <span className="font-mono text-sm text-muted-foreground">
          Kami membutuhkan beberapa data untuk menghitung kebutuhan kalori harian
          Anda secara akurat.
        </span>
      </div>

      {/* Form */}
      <div className="mt-6">
        <OnboardingForm />
      </div>
    </div>
  );
}
