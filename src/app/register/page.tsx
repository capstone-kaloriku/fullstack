import RegisterInput from "./components/RegisterInput";

export default function Register() {
  return (
    <div className="max-w-lg mx-auto p-6 overflow-hidden">
      {/* Title Login Page */}
      <div className="text-center">
        <h1 className="font-headline text-primary text-4xl font-extrabold italic">
          Kaloriku
        </h1>
        <span className="font-mono text-sm text-muted-foreground">
          Daftar untuk memulai perjalanan menuju versi terbaik dari diri Anda
          hari ini.
        </span>
      </div>

      {/* Form */}
      <div className="mt-4">
        <RegisterInput />
      </div>
    </div>
  );
}
