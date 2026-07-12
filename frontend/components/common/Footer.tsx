export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
      <p>
        Smart Import Engine &mdash; AI Powered CRM CSV Importer &copy;{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
