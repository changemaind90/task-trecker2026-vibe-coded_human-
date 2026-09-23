"use client";

type Props = {
  loading: boolean;
  loadingText: string;
  text: string;
};

export default function AuthButton({ loading, loadingText, text }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mb-2 group relative w-full flex items-center justify-center rounded-lg bg-[#6366f1] px-3 py-2 text-sm font-medium text-white shadow-md hover:bg-[#4f46ba] active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
    >
      {loading ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}
