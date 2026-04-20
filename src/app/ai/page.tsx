import { InputPrompt } from "./components/InputPrompt";

const AI = () => {
  return (
    <div className="bg-linear-to-t from-secondary via-white to-white min-h-screen w-full mx-auto p-6 max-w-2xl ">
      <div className="flex flex-col items-center justify-center gap-5">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-3 py-5 ">
          <h1 className="text-3xl font-extrabold text-secondary-foreground">
            Tanya KalorAI
          </h1>
          <span className="text-sm text-muted-foreground text-center">
            Asisten nutrisi cerdasmu, siap membantu dengan pertanyaan seputar
            kalori, nutrisi.
          </span>
        </div>
        {/* Chat Area*/}

        {/* Input Prompt */}
        <InputPrompt />
      </div>
    </div>
  );
};

export default AI;
