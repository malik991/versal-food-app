export function ErrorBox({ children }) {
  return (
    <div className="text-center bg-red-200 p-2 rounded-xl border-2 border-red-500">
      {children}
    </div>
  );
}
