import LogoSpinner from "./LogoSpinner";

const InitialLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-gradient-to-br from-white via-cyan-50 to-white">
      <LogoSpinner
        size={200}
        ringWidth={6}
        label="Preparing MedAI Assist..."
        labelClassName="text-teal-700 font-semibold tracking-wide"
      />
      <p className="mt-6 text-sm text-teal-600 animate-pulse">
        Detect early. Live fully.
      </p>
    </div>
  );
};

export default InitialLoadingScreen;
