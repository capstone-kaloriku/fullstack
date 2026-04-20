const AI = () => {
  return (
    <div className="w-full mx-auto p-6 max-w-2xl ">
      <div className="flex flex-col items-center justify-center">
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
      </div>
    </div>
  );
};

export default AI;
