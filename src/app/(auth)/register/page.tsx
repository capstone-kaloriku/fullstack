import RegisterInput from "./components/RegisterInput";

export default function Register() {
  return (
    <div className="max-w-2xl w-full mx-auto p-6 md:p-12 overflow-hidden">
      {/* Title Login Page */}
      <div className="text-start">
        <h1 className="font-headline text-primary text-4xl font-extrabold">
          Daftar akun Kaloriku
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
